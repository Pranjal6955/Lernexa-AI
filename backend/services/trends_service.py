"""
Service for calculating learning trends and analytics
"""

from services.data_service import DataService
from datetime import datetime, timedelta
import statistics

class TrendsService:
    """Service for trend analysis"""
    
    def __init__(self):
        self.data_service = DataService()
    
    def get_completion_trends(self, period='all'):
        """Get learning completion trends"""
        all_students = self.data_service.get_all_students()
        if not all_students:
            return {'error': 'No student data available'}
        
        total_students = len(all_students)
        completed = sum(1 for s in all_students if s.get('FinalGrade', 0) >= 60)
        completion_rate = (completed / total_students * 100) if total_students > 0 else 0
        
        avg_assignment_completion = statistics.mean([s.get('AssignmentCompletion', 0) for s in all_students])
        
        excellent = sum(1 for s in all_students if s.get('FinalGrade', 0) >= 80)
        good = sum(1 for s in all_students if 60 <= s.get('FinalGrade', 0) < 80)
        needs_improvement = sum(1 for s in all_students if s.get('FinalGrade', 0) < 60)
        
        return {
            'total_students': total_students,
            'completion_rate': round(completion_rate, 2),
            'completed_students': completed,
            'incomplete_students': total_students - completed,
            'average_assignment_completion': round(avg_assignment_completion, 2),
            'completion_by_grade': {
                'excellent': excellent,
                'good': good,
                'needs_improvement': needs_improvement
            },
            'period': period
        }
    
    def get_score_trends(self, period='all'):
        """Get average score trends"""
        all_students = self.data_service.get_all_students()
        if not all_students:
            return {'error': 'No student data available'}
        
        final_grades = [s.get('FinalGrade', 0) for s in all_students]
        exam_scores = [s.get('ExamScore', 0) for s in all_students]
        
        return {
            'average_final_grade': round(statistics.mean(final_grades), 2),
            'average_exam_score': round(statistics.mean(exam_scores), 2),
            'median_final_grade': round(statistics.median(final_grades), 2),
            'median_exam_score': round(statistics.median(exam_scores), 2),
            'min_final_grade': round(min(final_grades), 2),
            'max_final_grade': round(max(final_grades), 2),
            'min_exam_score': round(min(exam_scores), 2),
            'max_exam_score': round(max(exam_scores), 2),
            'score_distribution': {
                '90-100': sum(1 for g in final_grades if 90 <= g <= 100),
                '80-89': sum(1 for g in final_grades if 80 <= g < 90),
                '70-79': sum(1 for g in final_grades if 70 <= g < 80),
                '60-69': sum(1 for g in final_grades if 60 <= g < 70),
                'below_60': sum(1 for g in final_grades if g < 60)
            },
            'period': period
        }
    
    def get_dropout_trends(self, period='all'):
        """Get dropout rate trends"""
        all_students = self.data_service.get_all_students()
        if not all_students:
            return {'error': 'No student data available'}
        
        total_students = len(all_students)
        
        high_risk = sum(1 for s in all_students if s.get('RiskScore', 0) >= 70)
        very_low_attendance = sum(1 for s in all_students if s.get('Attendance', 0) < 50)
        very_low_engagement = sum(1 for s in all_students if s.get('EngagementScore', 0) < 30)
        failing = sum(1 for s in all_students if s.get('FinalGrade', 0) < 50)
        
        at_risk = sum(1 for s in all_students if (
            s.get('RiskScore', 0) >= 70 or
            (s.get('Attendance', 0) < 50 and s.get('EngagementScore', 0) < 40)
        ))
        
        dropout_rate = (at_risk / total_students * 100) if total_students > 0 else 0
        
        return {
            'total_students': total_students,
            'at_risk_students': at_risk,
            'dropout_rate': round(dropout_rate, 2),
            'risk_indicators': {
                'high_risk_score': high_risk,
                'very_low_attendance': very_low_attendance,
                'very_low_engagement': very_low_engagement,
                'failing_grade': failing
            },
            'period': period
        }
    
    def get_engagement_trends(self, period='all'):
        """Get engagement trends"""
        all_students = self.data_service.get_all_students()
        if not all_students:
            return {'error': 'No student data available'}
        
        engagement_scores = [s.get('EngagementScore', 0) for s in all_students]
        study_hours = [s.get('StudyHours', 0) for s in all_students]
        attendance = [s.get('Attendance', 0) for s in all_students]
        
        return {
            'average_engagement_score': round(statistics.mean(engagement_scores), 2),
            'average_study_hours': round(statistics.mean(study_hours), 2),
            'average_attendance': round(statistics.mean(attendance), 2),
            'engagement_distribution': {
                'high': sum(1 for e in engagement_scores if e >= 70),
                'medium': sum(1 for e in engagement_scores if 50 <= e < 70),
                'low': sum(1 for e in engagement_scores if e < 50)
            },
            'period': period
        }
    
    def get_all_trends(self, period='all'):
        """Get all trends in one response"""
        return {
            'completion': self.get_completion_trends(period),
            'scores': self.get_score_trends(period),
            'dropout': self.get_dropout_trends(period),
            'engagement': self.get_engagement_trends(period),
            'period': period,
            'generated_at': datetime.now().isoformat()
        }

