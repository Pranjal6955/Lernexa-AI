import pandas as pd
import os

CLEANED_PATH = "datasets/processed/cleaned_student_data.csv"
FEATURE_PATH = "datasets/features/student_features.csv"


def generate_features():
    print("📂 Loading cleaned data...")
    df = pd.read_csv(CLEANED_PATH)

    # ---- Compute reference maximum values ----
    max_study_hours = df["StudyHours"].max()
    max_assignment = df["AssignmentCompletion"].max()
    max_discussions = df["Discussions"].max()
    max_resources = df["Resources"].max()

    print("⚙️ Generating new feature columns...")

    # Engagement score
    df["EngagementScore"] = (
        (df["StudyHours"] / max_study_hours) * 30 +
        (df["Attendance"] / 100) * 20 +
        (df["AssignmentCompletion"] / max_assignment) * 20 +
        (df["Discussions"] / max_discussions) * 20 +
        (df["Resources"] / max_resources) * 10
    )

    # Consistency
    df["Consistency"] = df["StudyHours"] / df["Attendance"]

    # Stress impact
    df["StressImpact"] = df["StressLevel"] / df["StudyHours"]

    # Tech score
    df["TechScore"] = (
        df["Internet"] * 0.3 +
        df["EduTech"] * 0.4 +
        df["OnlineCourses"] * 0.3
    )

    # Resource usage
    df["ResourceUsage"] = (
        df["Resources"] + df["Discussions"] + df["AssignmentCompletion"]
    ) / 3

    # Study efficiency
    df["StudyEfficiency"] = df["ExamScore"] / df["StudyHours"]

    # Attendance impact
    df["AttendanceImpact"] = df["FinalGrade"] / df["Attendance"]

    # Risk score
    df["RiskScore"] = (
        (100 - df["EngagementScore"]) * 0.4 +
        df["StressLevel"] * 0.4 +
        (100 - df["Attendance"]) * 0.2
    )

    # Ensure folder exists
    os.makedirs("datasets/features", exist_ok=True)

    print("💾 Saving feature dataset...")
    df.to_csv(FEATURE_PATH, index=False)

    print("✔️ Done! File created:")
    print(f" - {FEATURE_PATH}")


if __name__ == "__main__":
    generate_features()