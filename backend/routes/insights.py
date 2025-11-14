"""
API routes for student insights and personalized recommendations
"""

from flask import Blueprint, jsonify, request
from services.data_service import DataService
from services.insights_service import InsightsService

bp = Blueprint('insights', __name__)
data_service = DataService()
insights_service = InsightsService()

@bp.route('/student/<student_id>', methods=['GET'])
def get_student_insights(student_id):
    """Get personalized insights for a specific student"""
    try:
        student = data_service.get_student_by_id(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        insights = insights_service.generate_student_insights(student)
        return jsonify(insights), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/overview', methods=['GET'])
def get_overview():
    """Get overall insights overview"""
    try:
        overview = insights_service.get_overview_insights()
        return jsonify(overview), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/engagement', methods=['GET'])
def get_engagement_insights():
    """Get engagement insights"""
    try:
        student_id = request.args.get('student_id')
        if student_id:
            student = data_service.get_student_by_id(student_id)
            if not student:
                return jsonify({'error': 'Student not found'}), 404
            insights = insights_service.get_engagement_insights(student)
        else:
            insights = insights_service.get_engagement_insights()
        return jsonify(insights), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/performance', methods=['GET'])
def get_performance_insights():
    """Get performance insights"""
    try:
        student_id = request.args.get('student_id')
        if student_id:
            student = data_service.get_student_by_id(student_id)
            if not student:
                return jsonify({'error': 'Student not found'}), 404
            insights = insights_service.get_performance_insights(student)
        else:
            insights = insights_service.get_performance_insights()
        return jsonify(insights), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

