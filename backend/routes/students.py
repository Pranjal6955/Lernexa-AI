"""
API routes for student data
"""

from flask import Blueprint, jsonify, request
from services.data_service import DataService

bp = Blueprint('students', __name__)
data_service = DataService()

@bp.route('/', methods=['GET'])
def get_students():
    """Get list of students with optional filtering"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 200))
        search = request.args.get('search', '')
        
        students = data_service.get_students(page=page, limit=limit, search=search)
        return jsonify(students), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<student_id>', methods=['GET'])
def get_student(student_id):
    """Get a specific student by ID"""
    try:
        student = data_service.get_student_by_id(student_id)
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        return jsonify(student), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/stats', methods=['GET'])
def get_student_stats():
    """Get overall student statistics"""
    try:
        stats = data_service.get_student_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

