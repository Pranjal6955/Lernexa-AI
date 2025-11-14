"""
Data insertion script for loading processed student data into MongoDB
"""

import pandas as pd
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import db_config

# Load environment variables
load_dotenv()

FEATURE_PATH = "datasets/features/student_features.csv"

def insert_data():
    """Insert processed student data into MongoDB"""
    print("📂 Loading feature dataset...")
    
    # Check if feature data exists
    if not os.path.exists(FEATURE_PATH):
        print(f"❌ Error: Feature data file not found at {FEATURE_PATH}")
        print("   Please run generate_features.py first!")
        return False
    
    try:
        df = pd.read_csv(FEATURE_PATH)
        print(f"✅ Loaded {len(df)} records")
        
        print("\n🔌 Connecting to MongoDB...")
        if not db_config.connect():
            print("❌ Failed to connect to MongoDB")
            print("   Please check your MONGO_URI in .env file")
            print("   Make sure MongoDB is running on your system")
            print("\n   To start MongoDB locally:")
            print("   - Linux: sudo systemctl start mongod")
            print("   - Mac: brew services start mongodb-community")
            print("   - Windows: net start MongoDB")
            return False
        
        print(f"✅ Connected to database: {db_config.database_name}")
        
        collection = db_config.get_collection('students')
        if not collection:
            print("❌ Failed to get students collection")
            return False
        
        print("\n🗑️  Clearing existing data...")
        result = collection.delete_many({})
        print(f"   - Deleted {result.deleted_count} existing records")
        
        print("\n📥 Inserting data into MongoDB...")
        
        # Convert DataFrame to list of dictionaries
        records = df.to_dict('records')
        
        # Convert NaN values to None (MongoDB compatible)
        for record in records:
            for key, value in record.items():
                if pd.isna(value):
                    record[key] = None
        
        # Insert in batches for better performance
        batch_size = 1000
        total_inserted = 0
        
        for i in range(0, len(records), batch_size):
            batch = records[i:i + batch_size]
            try:
                collection.insert_many(batch, ordered=False)
                total_inserted += len(batch)
                print(f"   - Inserted batch {i//batch_size + 1}: {len(batch)} records (Total: {total_inserted}/{len(records)})")
            except Exception as e:
                print(f"   ⚠️  Warning: Some records in batch {i//batch_size + 1} may have failed: {e}")
                # Try inserting individually for this batch
                for record in batch:
                    try:
                        collection.insert_one(record)
                        total_inserted += 1
                    except Exception as insert_error:
                        print(f"      ⚠️  Failed to insert record {record.get('StudentID', 'unknown')}: {insert_error}")
        
        print(f"\n✅ Successfully inserted {total_inserted} records into MongoDB")
        
        # Verify insertion
        count = collection.count_documents({})
        print(f"✅ Total records in database: {count}")
        
        # Show sample statistics
        if count > 0:
            print("\n📊 Sample Statistics:")
            sample = collection.find_one({})
            if sample:
                print(f"   - Sample StudentID: {sample.get('StudentID', 'N/A')}")
                print(f"   - Sample EngagementScore: {sample.get('EngagementScore', 'N/A')}")
                print(f"   - Sample RiskScore: {sample.get('RiskScore', 'N/A')}")
        
        db_config.close()
        print("\n✅ Data insertion completed successfully!")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error during data insertion: {e}")
        import traceback
        traceback.print_exc()
        if db_config.client:
            db_config.close()
        return False

if __name__ == "__main__":
    success = insert_data()
    sys.exit(0 if success else 1)
