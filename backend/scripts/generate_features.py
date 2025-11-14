"""
Feature engineering script for student performance dataset
Generates computed features like EngagementScore, RiskScore, etc.
"""

import pandas as pd
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

CLEANED_PATH = "datasets/processed/cleaned_student_data.csv"
FEATURE_PATH = "datasets/features/student_features.csv"

def generate_features():
    """Generate computed features from cleaned data"""
    print("📂 Loading cleaned data...")
    
    # Check if cleaned data exists
    if not os.path.exists(CLEANED_PATH):
        print(f"Error: Cleaned data file not found at {CLEANED_PATH}")
        print("   Please run clean_data.py first!")
        return False
    
    try:
        df = pd.read_csv(CLEANED_PATH)
        print(f"Loaded {len(df)} records")
        
        # Compute reference maximum values (avoid division by zero)
        max_study_hours = max(df["StudyHours"].max(), 1)
        max_assignment = max(df["AssignmentCompletion"].max(), 1)
        max_discussions = max(df["Discussions"].max(), 1)
        max_resources = max(df["Resources"].max(), 1)
        max_exam_score = max(df["ExamScore"].max(), 1)
        max_attendance = max(df["Attendance"].max(), 1)
        
        print("\nGenerating new feature columns...")

        if 'StudentID' not in df.columns:
            df['StudentID'] = [f"STU{i+1:04d}" for i in range(len(df))]
            print("   - Added StudentID column")

        if 'Name' not in df.columns:
            df['Name'] = [f"Student {i+1}" for i in range(len(df))]
            print("   - Added Name column")

        df["EngagementScore"] = (
            (df["StudyHours"] / max_study_hours) * 30 +
            (df["Attendance"] / 100) * 20 +
            (df["AssignmentCompletion"] / max_assignment) * 20 +
            (df["Discussions"] / max_discussions) * 20 +
            (df["Resources"] / max_resources) * 10
        )
        print("   - Generated EngagementScore")

        df["Consistency"] = df["StudyHours"] / df["Attendance"].replace(0, 1)
        print("   - Generated Consistency")

        df["StressImpact"] = df["StressLevel"] / df["StudyHours"].replace(0, 1)
        print("   - Generated StressImpact")

        df["TechScore"] = (
            df["Internet"] * 0.3 +
            df["EduTech"] * 0.4 +
            df["OnlineCourses"] * 0.3
        )
        print("   - Generated TechScore")

        df["ResourceUsage"] = (
            df["Resources"] + df["Discussions"] + df["AssignmentCompletion"]
        ) / 3
        print("   - Generated ResourceUsage")

        df["StudyEfficiency"] = df["ExamScore"] / df["StudyHours"].replace(0, 1)
        print("   - Generated StudyEfficiency")

        df["AttendanceImpact"] = df["FinalGrade"] / df["Attendance"].replace(0, 1)
        print("   - Generated AttendanceImpact")

        df["RiskScore"] = (
            (100 - df["EngagementScore"]) * 0.4 +
            df["StressLevel"] * 0.4 +
            (100 - df["Attendance"]) * 0.2
        )

        df["RiskScore"] = df["RiskScore"].clip(0, 100)
        print("   - Generated RiskScore")

        os.makedirs(os.path.dirname(FEATURE_PATH), exist_ok=True)
        
        print("\nSaving feature dataset...")
        df.to_csv(FEATURE_PATH, index=False)
        
        print(f"\nDone! Feature file created:")
        print(f"   - {FEATURE_PATH}")
        print(f"   - Records: {len(df)}")
        print(f"   - Features added: EngagementScore, RiskScore, Consistency, TechScore, etc.")
        
        return True
        
    except Exception as e:
        print(f"\nError during feature generation: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = generate_features()
    sys.exit(0 if success else 1)
