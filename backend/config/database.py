import os
from pymongo import MongoClient

class DatabaseConfig:
    """Database configuration and connection management"""
    
    def __init__(self):
        # Support both MONGO_URI and MONGODB_URI for compatibility
        self.connection_string = os.getenv('MONGODB_URI') or os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        self.database_name = os.getenv('DATABASE_NAME', 'lernexa_ai')
        self.client = None
        self.db = None
    
    def connect(self):
        """Establish connection to MongoDB"""
        try:
            self.client = MongoClient(self.connection_string)
            self.client.admin.command('ping')
            self.db = self.client[self.database_name]
            return True
        except Exception as e:
            print(f"Database connection error: {e}")
            return False
    
    def get_collection(self, collection_name):
        """Get a specific collection"""
        if self.db:
            return self.db[collection_name]
        return None
    
    def close(self):
        """Close database connection"""
        if self.client:
            self.client.close()

# Global database instance
db_config = DatabaseConfig()

db_config.connect()
