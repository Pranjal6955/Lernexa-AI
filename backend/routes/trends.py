"""
API routes for learning trends and analytics
"""

from flask import Blueprint, jsonify, request
from services.data_service import DataService
from services.trends_service import TrendsService

bp = Blueprint('trends', __name__)
data_service = DataService()
trends_service = TrendsService()

@bp.route('/completion', methods=['GET'])
def get_completion_trends():
    """Get learning completion trends"""
    try:
        period = request.args.get('period', 'all')  # all, week, month, year
        trends = trends_service.get_completion_trends(period)
        return jsonify(trends), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/scores', methods=['GET'])
def get_score_trends():
    """Get average score trends"""
    try:
        period = request.args.get('period', 'all')
        trends = trends_service.get_score_trends(period)
        return jsonify(trends), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/dropout', methods=['GET'])
def get_dropout_trends():
    """Get dropout rate trends"""
    try:
        period = request.args.get('period', 'all')
        trends = trends_service.get_dropout_trends(period)
        return jsonify(trends), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/engagement', methods=['GET'])
def get_engagement_trends():
    """Get engagement trends over time"""
    try:
        period = request.args.get('period', 'all')
        trends = trends_service.get_engagement_trends(period)
        return jsonify(trends), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/all', methods=['GET'])
def get_all_trends():
    """Get all trends in one response"""
    try:
        period = request.args.get('period', 'all')
        all_trends = trends_service.get_all_trends(period)
        return jsonify(all_trends), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

