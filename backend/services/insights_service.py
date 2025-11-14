"""
Service for generating personalized insights and recommendations
"""

from services.data_service import DataService

class InsightsService:
    """Service for generating insights"""
    
    def __init__(self):
        self.data_service = DataService()
    
    def generate_student_insights(self, student):
        """Generate comprehensive insights for a student"""
        insights = {
            'student_id': student.get('StudentID'),
            'overview': self._get_overview(student),
            'strengths': self._identify_strengths(student),
            'weaknesses': self._identify_weaknesses(student),
            'recommendations': self._generate_recommendations(student),
            'engagement_analysis': self._analyze_engagement(student),
            'performance_analysis': self._analyze_performance(student),
            'risk_factors': self._identify_risk_factors(student)
        }
        return insights
    
    def get_overview_insights(self):
        """Get overall insights across all students"""
        all_students = self.data_service.get_all_students()
        if not all_students:
            return {
                'total_students': 0,
                'summary': 'No student data available',
                'averages': {
                    'final_grade': 0,
                    'engagement_score': 0
                },
                'high_risk_students': 0,
                'high_risk_percentage': 0,
                'engagement_heatmap': []
            }
        
        total = len(all_students)
        avg_engagement = sum(s.get('EngagementScore', 0) for s in all_students) / total
        avg_grade = sum(s.get('FinalGrade', 0) for s in all_students) / total
        avg_study_hours = sum(s.get('StudyHours', 0) for s in all_students) / total
        avg_attendance = sum(s.get('Attendance', 0) for s in all_students) / total
        high_risk = sum(1 for s in all_students if s.get('RiskScore', 0) >= 70)
        
        # Generate engagement heatmap (7x5 grid representing engagement patterns)
        # Group students by engagement score ranges and create a heatmap
        engagement_ranges = [
            (0, 20), (20, 40), (40, 60), (60, 80), (80, 100)
        ]
        attendance_ranges = [
            (0, 40), (40, 60), (60, 80), (80, 90), (90, 100)
        ]
        
        heatmap = []
        for att_range in attendance_ranges:
            row = []
            for eng_range in engagement_ranges:
                count = sum(1 for s in all_students 
                           if att_range[0] <= s.get('Attendance', 0) < att_range[1]
                           and eng_range[0] <= s.get('EngagementScore', 0) < eng_range[1])
                row.append(count)
            heatmap.append(row)
        
        # Generate summary
        passing_rate = (sum(1 for s in all_students if s.get('FinalGrade', 0) >= 60) / total * 100) if total > 0 else 0
        summary_parts = [
            f"Total students: {total}",
            f"Average grade: {avg_grade:.1f}",
            f"Passing rate: {passing_rate:.1f}%",
            f"High risk students: {high_risk} ({high_risk/total*100:.1f}%)" if total > 0 else "High risk students: 0"
        ]
        summary = ". ".join(summary_parts)
        
        return {
            'total_students': total,
            'summary': summary,
            'averages': {
                'final_grade': round(avg_grade, 2),
                'engagement_score': round(avg_engagement, 2),
                'study_hours': round(avg_study_hours, 2),
                'attendance': round(avg_attendance, 2)
            },
            'high_risk_students': high_risk,
            'high_risk_percentage': round((high_risk / total) * 100, 2) if total > 0 else 0,
            'engagement_heatmap': heatmap
        }
    
    def get_engagement_insights(self, student=None):
        """Get engagement insights"""
        if student:
            return self._analyze_engagement(student)
        else:
            all_students = self.data_service.get_all_students()
            if not all_students:
                return {'error': 'No student data available'}
            
            avg_engagement = sum(s.get('EngagementScore', 0) for s in all_students) / len(all_students)
            high_engagement = sum(1 for s in all_students if s.get('EngagementScore', 0) >= 70)
            
            return {
                'average_engagement': round(avg_engagement, 2),
                'high_engagement_count': high_engagement,
                'total_students': len(all_students)
            }
    
    def get_performance_insights(self, student=None):
        """Get performance insights"""
        if student:
            return self._analyze_performance(student)
        else:
            all_students = self.data_service.get_all_students()
            if not all_students:
                return {'error': 'No student data available'}
            
            avg_grade = sum(s.get('FinalGrade', 0) for s in all_students) / len(all_students)
            avg_exam = sum(s.get('ExamScore', 0) for s in all_students) / len(all_students)
            passing = sum(1 for s in all_students if s.get('FinalGrade', 0) >= 60)
            
            return {
                'average_grade': round(avg_grade, 2),
                'average_exam_score': round(avg_exam, 2),
                'passing_students': passing,
                'passing_rate': round((passing / len(all_students)) * 100, 2) if all_students else 0,
                'total_students': len(all_students)
            }
    
    def _get_overview(self, student):
        """Get overview of student status"""
        engagement = student.get('EngagementScore', 0)
        grade = student.get('FinalGrade', 0)
        risk = student.get('RiskScore', 0)
        
        status = 'excellent'
        if risk >= 70:
            status = 'at_risk'
        elif risk >= 40:
            status = 'needs_attention'
        elif engagement < 50:
            status = 'low_engagement'
        
        return {
            'status': status,
            'engagement_score': round(engagement, 2),
            'final_grade': round(grade, 2),
            'risk_score': round(risk, 2)
        }
    
    def _identify_strengths(self, student):
        """Identify student strengths"""
        strengths = []
        
        if student.get('Attendance', 0) >= 90:
            strengths.append('Excellent attendance')
        if student.get('EngagementScore', 0) >= 70:
            strengths.append('High engagement')
        if student.get('StudyHours', 0) >= 20:
            strengths.append('Dedicated study time')
        if student.get('AssignmentCompletion', 0) >= 80:
            strengths.append('Strong assignment completion')
        if student.get('FinalGrade', 0) >= 80:
            strengths.append('High academic performance')
        
        return strengths if strengths else ['Keep up the good work!']
    
    def _identify_weaknesses(self, student):
        """Identify areas for improvement"""
        weaknesses = []
        
        if student.get('Attendance', 0) < 70:
            weaknesses.append('Low attendance - consider improving')
        if student.get('StudyHours', 0) < 10:
            weaknesses.append('Insufficient study hours')
        if student.get('AssignmentCompletion', 0) < 60:
            weaknesses.append('Low assignment completion rate')
        if student.get('StressLevel', 0) > 70:
            weaknesses.append('High stress level - consider support')
        if student.get('EngagementScore', 0) < 50:
            weaknesses.append('Low engagement - needs attention')
        
        return weaknesses if weaknesses else ['No major concerns identified']
    
    def _generate_recommendations(self, student):
        """Generate personalized recommendations"""
        recommendations = []
        
        if student.get('StudyHours', 0) < 15:
            recommendations.append({
                'type': 'study_time',
                'message': 'Increase study hours to at least 15 hours per week',
                'priority': 'high'
            })
        
        if student.get('Attendance', 0) < 80:
            recommendations.append({
                'type': 'attendance',
                'message': 'Improve attendance to boost performance',
                'priority': 'high'
            })
        
        if student.get('StressLevel', 0) > 60:
            recommendations.append({
                'type': 'wellness',
                'message': 'Consider stress management techniques',
                'priority': 'medium'
            })
        
        if student.get('Discussions', 0) < 5:
            recommendations.append({
                'type': 'engagement',
                'message': 'Participate more in discussions',
                'priority': 'medium'
            })
        
        if not recommendations:
            recommendations.append({
                'type': 'maintain',
                'message': 'Continue maintaining current performance',
                'priority': 'low'
            })
        
        return recommendations
    
    def _analyze_engagement(self, student):
        """Analyze student engagement"""
        engagement_score = student.get('EngagementScore', 0)
        study_hours = student.get('StudyHours', 0)
        attendance = student.get('Attendance', 0)
        discussions = student.get('Discussions', 0)
        resources = student.get('Resources', 0)
        
        return {
            'engagement_score': round(engagement_score, 2),
            'study_hours': study_hours,
            'attendance_percentage': round(attendance, 2),
            'discussion_participation': discussions,
            'resource_usage': resources,
            'level': 'high' if engagement_score >= 70 else 'medium' if engagement_score >= 50 else 'low'
        }
    
    def _analyze_performance(self, student):
        """Analyze student performance"""
        final_grade = student.get('FinalGrade', 0)
        exam_score = student.get('ExamScore', 0)
        assignment_completion = student.get('AssignmentCompletion', 0)
        
        return {
            'final_grade': round(final_grade, 2),
            'exam_score': round(exam_score, 2),
            'assignment_completion': round(assignment_completion, 2),
            'performance_level': 'excellent' if final_grade >= 80 else 'good' if final_grade >= 60 else 'needs_improvement'
        }
    
    def _identify_risk_factors(self, student):
        """Identify risk factors"""
        risk_factors = []
        risk_score = student.get('RiskScore', 0)
        
        if student.get('Attendance', 0) < 70:
            risk_factors.append('Low attendance')
        if student.get('EngagementScore', 0) < 50:
            risk_factors.append('Low engagement')
        if student.get('FinalGrade', 0) < 60:
            risk_factors.append('Below passing grade')
        if student.get('StressLevel', 0) > 70:
            risk_factors.append('High stress')
        
        return {
            'risk_score': round(risk_score, 2),
            'risk_level': 'high' if risk_score >= 70 else 'medium' if risk_score >= 40 else 'low',
            'factors': risk_factors
        }

