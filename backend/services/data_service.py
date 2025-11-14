"""
Data service for fetching and managing student data from MongoDB
"""

from config.database import db_config
from bson import ObjectId

class DataService:
    """Service for data operations"""

    def __init__(self):
        # Ensure database is connected
        if db_config.db is None:
            connected = db_config.connect()
            if not connected:
                raise Exception("Failed to connect to MongoDB")
        
        # Assign the students collection
        self.collection = db_config.get_collection('students')

    def _convert_objectid(self, obj):
        """Convert ObjectId to string for JSON serialization"""
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, dict):
            return {k: self._convert_objectid(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._convert_objectid(item) for item in obj]
        return obj

    def get_student_by_id(self, student_id):
        """Get a student by ID"""
        try:
            # Try to find by StudentID first (string)
            student = self.collection.find_one({'StudentID': str(student_id)})
            if not student:
                # Try ObjectId if it's a MongoDB _id
                try:
                    student = self.collection.find_one({'_id': ObjectId(student_id)})
                except:
                    pass
            
            if student:
                student = self._convert_objectid(student)
                if '_id' in student:
                    student['id'] = student.pop('_id')
                return student
            return None
        except Exception as e:
            print(f"Error fetching student: {e}")
            return None

    def get_students(self, page=1, limit=50, search=''):
        """Get paginated list of students"""
        try:
            skip = (page - 1) * limit
            query = {}

            if search:
                query = {
                    '$or': [
                        {'StudentID': {'$regex': search, '$options': 'i'}},
                        {'Name': {'$regex': search, '$options': 'i'}}
                    ]
                }
            
            students = list(self.collection.find(query).skip(skip).limit(limit))
            total = self.collection.count_documents(query)

            students = [self._convert_objectid(s) for s in students]
            for student in students:
                if '_id' in student:
                    student['id'] = student.pop('_id')
            
            return {
                'students': students,
                'pagination': {
                    'page': page,
                    'limit': limit,
                    'total': total,
                    'pages': (total + limit - 1) // limit
                }
            }
        except Exception as e:
            print(f"Error fetching students: {e}")
            return {'students': [], 'pagination': {'page': 1, 'limit': limit, 'total': 0, 'pages': 0}}

    def get_all_students(self):
        """Get all students (for analysis)"""
        try:
            students = list(self.collection.find({}))
            return [self._convert_objectid(s) for s in students]
        except Exception as e:
            print(f"Error fetching all students: {e}")
            return []

    def get_student_stats(self):
        """Get overall student statistics"""
        try:
            total_students = self.collection.count_documents({})

            pipeline = [
                {
                    '$group': {
                        '_id': None,
                        'avgFinalGrade': {'$avg': '$FinalGrade'},
                        'avgExamScore': {'$avg': '$ExamScore'},
                        'avgStudyHours': {'$avg': '$StudyHours'},
                        'avgAttendance': {'$avg': '$Attendance'},
                        'avgEngagementScore': {'$avg': '$EngagementScore'},
                        'minFinalGrade': {'$min': '$FinalGrade'},
                        'maxFinalGrade': {'$max': '$FinalGrade'}
                    }
                }
            ]

            result = list(self.collection.aggregate(pipeline))
            stats = result[0] if result else {}

            high_risk = self.collection.count_documents({'RiskScore': {'$gte': 70}})
            medium_risk = self.collection.count_documents({'RiskScore': {'$gte': 40, '$lt': 70}})
            low_risk = self.collection.count_documents({'RiskScore': {'$lt': 40}})

            return {
                'total_students': total_students,
                'averages': {
                    'final_grade': round(stats.get('avgFinalGrade', 0), 2),
                    'exam_score': round(stats.get('avgExamScore', 0), 2),
                    'study_hours': round(stats.get('avgStudyHours', 0), 2),
                    'attendance': round(stats.get('avgAttendance', 0), 2),
                    'engagement_score': round(stats.get('avgEngagementScore', 0), 2)
                },
                'ranges': {
                    'final_grade': {
                        'min': stats.get('minFinalGrade', 0),
                        'max': stats.get('maxFinalGrade', 0)
                    }
                },
                'risk_distribution': {
                    'high': high_risk,
                    'medium': medium_risk,
                    'low': low_risk
                }
            }
        except Exception as e:
            print(f"Error calculating stats: {e}")
            return {
                'total_students': 0,
                'averages': {},
                'ranges': {},
                'risk_distribution': {'high': 0, 'medium': 0, 'low': 0}
            }