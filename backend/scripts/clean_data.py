import pandas as pd
import os

RAW_DATA_PATH = "datasets/raw/student_performance.csv"
CLEANED_PATH = "datasets/processed/cleaned_student_data.csv"

def clean():
    print("Loading dataset...")
    df = pd.read_csv(RAW_DATA_PATH)

    print("Cleaning dataset...")
    df = df.drop_duplicates()

    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
    for column in numeric_cols:
        df[column] = df[column].fillna(df[column].median())

    categorical_cols = df.select_dtypes(include=['object']).columns
    for column in categorical_cols:
        df[column] = df[column].fillna(df[column].mode()[0])

    os.makedirs("datasets/processed", exist_ok=True)

    print("Saving cleaned dataset...")
    df.to_csv(CLEANED_PATH, index=False)

    print("Done! Cleaned file created:")
    print(f" - {CLEANED_PATH}")

if __name__ == "__main__":
    clean()