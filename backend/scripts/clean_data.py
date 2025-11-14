"""
Data cleaning script for student performance dataset
Cleans raw data by removing duplicates and handling missing values
"""

import pandas as pd
import os
import sys

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

RAW_DATA_PATH = "datasets/raw/student_performance.csv"
CLEANED_PATH = "datasets/processed/cleaned_student_data.csv"

def clean():
    """Clean the raw student performance dataset"""
    print("📂 Loading dataset...")
    
    # Check if raw data exists
    if not os.path.exists(RAW_DATA_PATH):
        print(f"❌ Error: Raw data file not found at {RAW_DATA_PATH}")
        return False
    
    try:
        df = pd.read_csv(RAW_DATA_PATH)
        print(f"✅ Loaded {len(df)} records")
        
        print("\n🧹 Cleaning dataset...")
        
        # Remove duplicates
        initial_count = len(df)
        df = df.drop_duplicates()
        duplicates_removed = initial_count - len(df)
        if duplicates_removed > 0:
            print(f"   - Removed {duplicates_removed} duplicate records")
        
        # Handle missing values in numeric columns
        numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
        for column in numeric_cols:
            missing_count = df[column].isna().sum()
            if missing_count > 0:
                df[column] = df[column].fillna(df[column].median())
                print(f"   - Filled {missing_count} missing values in '{column}' with median")
        
        # Handle missing values in categorical columns
        categorical_cols = df.select_dtypes(include=['object']).columns
        for column in categorical_cols:
            missing_count = df[column].isna().sum()
            if missing_count > 0:
                mode_value = df[column].mode()[0] if len(df[column].mode()) > 0 else ''
                df[column] = df[column].fillna(mode_value)
                print(f"   - Filled {missing_count} missing values in '{column}' with mode")
        
        # Create processed directory if it doesn't exist
        os.makedirs(os.path.dirname(CLEANED_PATH), exist_ok=True)
        
        print("\n💾 Saving cleaned dataset...")
        df.to_csv(CLEANED_PATH, index=False)
        
        print(f"\n✅ Done! Cleaned file created:")
        print(f"   - {CLEANED_PATH}")
        print(f"   - Records: {len(df)}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error during cleaning: {e}")
        return False

if __name__ == "__main__":
    success = clean()
    sys.exit(0 if success else 1)
