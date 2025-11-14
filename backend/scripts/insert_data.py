import pandas as pd
import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import db_config

load_dotenv()

FEATURE_PATH = "datasets/features/student_features.csv"

def insert_data():
    """Insert processed student data into MongoDB"""
    print("Loading feature dataset...")

    if not os.path.exists(FEATURE_PATH):
        print(f"Error: Feature data file not found at {FEATURE_PATH}")
        print("   Please run generate_features.py first!")
        return False
    
    try:
        df = pd.read_csv(FEATURE_PATH)
        print(f"Loaded {len(df)} records")
        
        print("\n🔌 Connecting to MongoDB...")
        if not db_config.connect():
            print("Failed to connect to MongoDB")
            return False
        
        print(f"Connected to database: {db_config.database_name}")
        
        collection = db_config.get_collection('students')
        if collection is None:
            print("Failed to get students collection")
            return False
        
        print("\nClearing existing data...")
        result = collection.delete_many({})
        print(f"   - Deleted {result.deleted_count} existing records")
        
        print("\nInserting data into MongoDB...")

        records = df.to_dict('records')

        for record in records:
            for key, value in record.items():
                if pd.isna(value):
                    record[key] = None
        
        batch_size = 1000
        total_inserted = 0
        
        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]
            try:
                collection.insert_many(batch, ordered=False)
                total_inserted += len(batch)
                print(f"   - Inserted batch {i//batch_size + 1}: {len(batch)} records")
            except Exception as e:
                print(f"Error inserting batch {i//batch_size + 1}: {e}")
                for record in batch:
                    try:
                        collection.insert_one(record)
                        total_inserted += 1
                    except:
                        pass
        
        print(f"\nInserted {total_inserted} records")
        print(f"Total in DB: {collection.count_documents({})}")
        
        db_config.close()
        return True
        
    except Exception as e:
        print(f"\nError during data insertion: {e}")
        db_config.close()
        return False

if __name__ == "__main__":
    success = insert_data()
    sys.exit(0 if success else 1)