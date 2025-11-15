"""
ML Service for training models and making predictions
"""

import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from services.data_service import DataService
import warnings
warnings.filterwarnings('ignore')

class MLService:
    """Service for ML model operations"""
    
    def __init__(self):
        self.data_service = DataService()
        self.model_dir = os.getenv('MODEL_DIR', './models')
        self.model = None
        self.scaler = None
        self.model_info = {}
        
        os.makedirs(self.model_dir, exist_ok=True)
        
        self._load_model()
    
    def train_model(self):
        """Train the completion prediction model"""
        try:
            all_students = self.data_service.get_all_students()
            if not all_students or len(all_students) < 10:
                return {
                    'error': 'Insufficient data for training',
                    'message': 'Need at least 10 student records'
                }
            
            df = pd.DataFrame(all_students)
            
            feature_columns = [
                'StudyHours', 'Attendance', 'AssignmentCompletion',
                'Discussions', 'Resources', 'StressLevel',
                'Internet', 'EduTech', 'OnlineCourses'
            ]
            
            if 'EngagementScore' in df.columns:
                feature_columns.append('EngagementScore')
            if 'RiskScore' in df.columns:
                feature_columns.append('RiskScore')
            if 'Consistency' in df.columns:
                feature_columns.append('Consistency')
            
            available_features = [f for f in feature_columns if f in df.columns]
            
            if not available_features:
                return {'error': 'No suitable features found for training'}
            
            X = df[available_features].fillna(0)
            
            if 'FinalGrade' in df.columns:
                final_grade_median = df['FinalGrade'].median()
                y = (df['FinalGrade'] >= final_grade_median).astype(int)
            elif 'RiskScore' in df.columns:
                risk_median = df['RiskScore'].median()
                y = (df['RiskScore'] <= risk_median).astype(int)
            else:
                return {'error': 'No target variable (FinalGrade or RiskScore) found for training'}
            
            if y.nunique() < 2:
                return {
                    'error': 'Imbalanced target variable',
                    'message': 'All students have same outcome. Need diverse student outcomes for training.'
                }
            
            try:
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y, test_size=0.2, random_state=42, stratify=y
                )
            except:
                X_train, X_test, y_train, y_test = train_test_split(
                    X, y, test_size=0.2, random_state=42
                )
            
            self.scaler = StandardScaler()
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            self.model = GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=5,
                random_state=42
            )
            
            self.model.fit(X_train_scaled, y_train)
            
            y_pred = self.model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            precision = precision_score(y_test, y_pred, zero_division=0)
            recall = recall_score(y_test, y_pred, zero_division=0)
            f1 = f1_score(y_test, y_pred, zero_division=0)
            
            feature_importance = dict(zip(available_features, self.model.feature_importances_))
            
            self._save_model()
            
            self.model_info = {
                'trained': True,
                'accuracy': round(accuracy, 4),
                'precision': round(precision, 4),
                'recall': round(recall, 4),
                'f1_score': round(f1, 4),
                'features_used': available_features,
                'feature_importance': {k: round(v, 4) for k, v in feature_importance.items()},
                'training_samples': len(X_train),
                'test_samples': len(X_test)
            }
            
            return {
                'success': True,
                'message': 'Model trained successfully',
                'metrics': self.model_info
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': 'Model training failed'
            }
    
    def predict_completion_likelihood(self, student):
        """Predict completion likelihood for a student"""
        try:
            if not self.model:
                if not self._load_model():
                    train_result = self.train_model()
                    if not train_result.get('success'):
                        return {
                            'error': 'Model not available',
                            'message': 'Please train the model first'
                        }
            
            feature_columns = self.model_info.get('features_used', [
                'StudyHours', 'Attendance', 'AssignmentCompletion',
                'Discussions', 'Resources', 'StressLevel',
                'Internet', 'EduTech', 'OnlineCourses', 'EngagementScore', 'RiskScore'
            ])
            
            features = []
            for col in feature_columns:
                features.append(student.get(col, 0))
            
            features_array = np.array(features).reshape(1, -1)
            
            features_scaled = self.scaler.transform(features_array)
            
            prediction = self.model.predict(features_scaled)[0]
            probability = self.model.predict_proba(features_scaled)[0]
            
            completion_likelihood = probability[1] * 100
            
            return {
                'student_id': student.get('StudentID'),
                'will_complete': bool(prediction),
                'completion_likelihood': round(completion_likelihood, 2),
                'confidence': round(max(probability) * 100, 2),
                'risk_level': 'low' if completion_likelihood >= 70 else 'medium' if completion_likelihood >= 50 else 'high'
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'message': 'Prediction failed'
            }
    
    def batch_predict_completion(self, student_ids):
        """Predict completion for multiple students"""
        predictions = []
        for student_id in student_ids:
            student = self.data_service.get_student_by_id(student_id)
            if student:
                prediction = self.predict_completion_likelihood(student)
                predictions.append(prediction)
            else:
                predictions.append({
                    'student_id': student_id,
                    'error': 'Student not found'
                })
        return {'predictions': predictions}
    
    def assess_dropout_risk(self, student):
        """Assess dropout risk for a student"""
        try:
            # Get completion prediction
            completion_pred = self.predict_completion_likelihood(student)
            
            # Additional risk factors
            risk_score = student.get('RiskScore', 0)
            attendance = student.get('Attendance', 0)
            engagement = student.get('EngagementScore', 0)
            
            # Calculate overall risk
            risk_factors = []
            if attendance < 50:
                risk_factors.append('Very low attendance')
            if engagement < 30:
                risk_factors.append('Very low engagement')
            if risk_score >= 70:
                risk_factors.append('High risk score')
            if completion_pred.get('completion_likelihood', 0) < 40:
                risk_factors.append('Low completion likelihood')
            
            # Determine risk level
            if len(risk_factors) >= 3 or risk_score >= 80:
                risk_level = 'critical'
            elif len(risk_factors) >= 2 or risk_score >= 70:
                risk_level = 'high'
            elif len(risk_factors) >= 1 or risk_score >= 50:
                risk_level = 'medium'
            else:
                risk_level = 'low'
            
            return {
                'student_id': student.get('StudentID'),
                'risk_level': risk_level,
                'risk_score': round(risk_score, 2),
                'completion_likelihood': completion_pred.get('completion_likelihood', 0),
                'risk_factors': risk_factors,
                'recommendations': self._get_risk_recommendations(risk_level, risk_factors)
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'message': 'Risk assessment failed'
            }
    
    def get_model_info(self):
        """Get information about the current model"""
        if not self.model_info:
            self._load_model()
        
        if not self.model:
            return {
                'trained': False,
                'message': 'Model not trained yet'
            }
        
        return self.model_info
    
    def _save_model(self):
        """Save model to disk"""
        try:
            model_path = os.path.join(self.model_dir, 'completion_model.pkl')
            scaler_path = os.path.join(self.model_dir, 'scaler.pkl')
            info_path = os.path.join(self.model_dir, 'model_info.pkl')
            
            with open(model_path, 'wb') as f:
                pickle.dump(self.model, f)
            
            if self.scaler:
                with open(scaler_path, 'wb') as f:
                    pickle.dump(self.scaler, f)
            
            with open(info_path, 'wb') as f:
                pickle.dump(self.model_info, f)
            
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def _load_model(self):
        """Load model from disk"""
        try:
            model_path = os.path.join(self.model_dir, 'completion_model.pkl')
            scaler_path = os.path.join(self.model_dir, 'scaler.pkl')
            info_path = os.path.join(self.model_dir, 'model_info.pkl')
            
            if os.path.exists(model_path):
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                
                if os.path.exists(scaler_path):
                    with open(scaler_path, 'rb') as f:
                        self.scaler = pickle.load(f)
                
                if os.path.exists(info_path):
                    with open(info_path, 'rb') as f:
                        self.model_info = pickle.load(f)
                
                return True
            return False
            
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def _get_risk_recommendations(self, risk_level, risk_factors):
        """Get recommendations based on risk level"""
        recommendations = []
        
        if risk_level == 'critical':
            recommendations.append('Immediate intervention required')
            recommendations.append('Schedule one-on-one meeting')
            recommendations.append('Provide additional support resources')
        elif risk_level == 'high':
            recommendations.append('Close monitoring recommended')
            recommendations.append('Increase engagement activities')
            recommendations.append('Provide academic support')
        elif risk_level == 'medium':
            recommendations.append('Regular check-ins recommended')
            recommendations.append('Encourage participation')
        else:
            recommendations.append('Continue current support level')
        
        return recommendations

