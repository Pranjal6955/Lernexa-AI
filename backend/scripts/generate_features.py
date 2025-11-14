"""
Feature engineering script for student performance dataset
Generates computed features like EngagementScore, RiskScore, etc.
"""

import pandas as pd
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

CLEANED_PATH = "datasets/processed/cleaned_student_data.csv"
FEATURE_PATH = "datasets/features/student_features.csv"

def generate_features():
    """Generate computed features from cleaned data"""
    print("📂 Loading cleaned data...")
    
    # Check if cleaned data exists
    if not os.path.exists(CLEANED_PATH):
        print(f"❌ Error: Cleaned data file not found at {CLEANED_PATH}")
        print("   Please run clean_data.py first!")
        return False
    
    try:
        df = pd.read_csv(CLEANED_PATH)
        print(f"✅ Loaded {len(df)} records")
        
        # Compute reference maximum values (avoid division by zero)
        max_study_hours = max(df["StudyHours"].max(), 1)
        max_assignment = max(df["AssignmentCompletion"].max(), 1)
        max_discussions = max(df["Discussions"].max(), 1)
        max_resources = max(df["Resources"].max(), 1)
        max_exam_score = max(df["ExamScore"].max(), 1)
        max_attendance = max(df["Attendance"].max(), 1)
        
        print("\n⚙️  Generating new feature columns...")
        
        # Add StudentID if it doesn't exist
        if 'StudentID' not in df.columns:
            df['StudentID'] = [f"STU{i+1:04d}" for i in range(len(df))]
            print("   - Added StudentID column")
        
        # Add Name if it doesn't exist
        if 'Name' not in df.columns:
            df['Name'] = [f"Student {i+1}" for i in range(len(df))]
            print("   - Added Name column")
        
        # Engagement Score (0-100 scale)
        # Weighted combination of study hours, attendance, assignments, discussions, and resources
        df["EngagementScore"] = (
            (df["StudyHours"] / max_study_hours) * 30 +
            (df["Attendance"] / 100) * 20 +
            (df["AssignmentCompletion"] / max_assignment) * 20 +
            (df["Discussions"] / max_discussions) * 20 +
            (df["Resources"] / max_resources) * 10
        )
        print("   - Generated EngagementScore")
        
        # Consistency (Study Hours / Attendance)
        # Higher values indicate more study per attendance percentage
        df["Consistency"] = df["StudyHours"] / df["Attendance"].replace(0, 1)
        print("   - Generated Consistency")
        
        # Stress Impact (Stress Level / Study Hours)
        # Higher values indicate stress not matched by study effort
        df["StressImpact"] = df["StressLevel"] / df["StudyHours"].replace(0, 1)
        print("   - Generated StressImpact")
        
        # Tech Score (0-1 scale)
        # Combined score for technology usage
        df["TechScore"] = (
            df["Internet"] * 0.3 +
            df["EduTech"] * 0.4 +
            df["OnlineCourses"] * 0.3
        )
        print("   - Generated TechScore")
        
        # Resource Usage (average of resources, discussions, assignments)
        df["ResourceUsage"] = (
            df["Resources"] + df["Discussions"] + df["AssignmentCompletion"]
        ) / 3
        print("   - Generated ResourceUsage")
        
        # Study Efficiency (Exam Score / Study Hours)
        # Higher values indicate better output per study hour
        df["StudyEfficiency"] = df["ExamScore"] / df["StudyHours"].replace(0, 1)
        print("   - Generated StudyEfficiency")
        
        # Attendance Impact (Final Grade / Attendance)
        # Shows how attendance correlates with final grade
        df["AttendanceImpact"] = df["FinalGrade"] / df["Attendance"].replace(0, 1)
        print("   - Generated AttendanceImpact")
        
        # Risk Score (0-100 scale, higher = more risk)
        # Combines inverse engagement, stress, and inverse attendance
        df["RiskScore"] = (
            (100 - df["EngagementScore"]) * 0.4 +
            df["StressLevel"] * 0.4 +
            (100 - df["Attendance"]) * 0.2
        )
        # Ensure RiskScore is within bounds
        df["RiskScore"] = df["RiskScore"].clip(0, 100)
        print("   - Generated RiskScore")
        
        # Create features directory if it doesn't exist
        os.makedirs(os.path.dirname(FEATURE_PATH), exist_ok=True)
        
        print("\n💾 Saving feature dataset...")
        df.to_csv(FEATURE_PATH, index=False)
        
        print(f"\n✅ Done! Feature file created:")
        print(f"   - {FEATURE_PATH}")
        print(f"   - Records: {len(df)}")
        print(f"   - Features added: EngagementScore, RiskScore, Consistency, TechScore, etc.")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error during feature generation: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = generate_features()
    sys.exit(0 if success else 1)
