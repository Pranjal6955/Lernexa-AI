"""
API routes for ML predictions
"""

from flask import Blueprint, jsonify, request
from services.data_service import DataService
from services.ml_service import MLService

bp = Blueprint('predictions', __name__)
data_service = DataService()
ml_service = MLService()

@bp.route('/completion-likelihood', methods=['POST'])
def predict_completion():
    """Predict completion likelihood for a student"""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        
        if not student_id:
            return jsonify({'error': 'student_id is required'}), 400
        
        student = data_service.get_student_by_id(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        prediction = ml_service.predict_completion_likelihood(student)
        return jsonify(prediction), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/batch-predict', methods=['POST'])
def batch_predict():
    """Predict completion likelihood for multiple students"""
    try:
        data = request.get_json()
        student_ids = data.get('student_ids', [])
        
        if not student_ids:
            return jsonify({'error': 'student_ids array is required'}), 400
        
        predictions = ml_service.batch_predict_completion(student_ids)
        return jsonify(predictions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/risk-assessment', methods=['POST'])
def assess_risk():
    """Assess dropout risk for a student"""
    try:
        data = request.get_json()
        student_id = data.get('student_id')
        
        if not student_id:
            return jsonify({'error': 'student_id is required'}), 400
        
        student = data_service.get_student_by_id(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        risk_assessment = ml_service.assess_dropout_risk(student)
        return jsonify(risk_assessment), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/train-model', methods=['POST'])
def train_model():
    """Train/retrain the ML model"""
    try:
        result = ml_service.train_model()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/model-info', methods=['GET'])
def get_model_info():
    """Get information about the current ML model"""
    try:
        info = ml_service.get_model_info()
        return jsonify(info), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

