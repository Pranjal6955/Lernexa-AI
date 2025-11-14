import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

class DatabaseConfig:
    def __init__(self):
        self.connection_string = (
            os.getenv('MONGODB_URI') or 
            os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        )
        self.database_name = os.getenv('DATABASE_NAME', 'lernexa_ai')
        self.client = None
        self.db = None

    def connect(self):
        """Establish connection to MongoDB"""
        try:
            self.client = MongoClient(self.connection_string)
            self.client.admin.command('ping')
            self.db = self.client[self.database_name]
            print(f"Connected to MongoDB cluster: {self.connection_string}")
            print(f"Using database: {self.database_name}")
            return True
        except Exception as e:
            print(f"Database connection error: {e}")
            return False

    def get_collection(self, collection_name):
        """Return a MongoDB collection if connected"""
        if self.db is not None:
            return self.db[collection_name]
        return None

    def close(self):
        """Close database connection"""
        if self.client is not None:
            self.client.close()
            print("Database connection closed.")

db_config = DatabaseConfig()