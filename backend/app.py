"""
Flask API Server for Lernexa AI - Learning Insights Dashboard
Main application entry point
"""

import os
from flask import Flask
from flask_cors import CORS # type: ignore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.getenv('DEBUG', 'False').lower() == 'true'

# Import routes
from routes import insights, trends, predictions, students

# Register blueprints
app.register_blueprint(insights.bp, url_prefix='/api/insights')
app.register_blueprint(trends.bp, url_prefix='/api/trends')
app.register_blueprint(predictions.bp, url_prefix='/api/predictions')
app.register_blueprint(students.bp, url_prefix='/api/students')

@app.route('/')
def health_check():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'message': 'Lernexa AI Learning Insights API',
        'version': '1.0.0'
    }

@app.route('/api/health')
def api_health():
    """API health check"""
    return {
        'status': 'ok',
        'service': 'lernexa-ai-backend'
    }

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = app.config['DEBUG']
    app.run(host='0.0.0.0', port=port, debug=debug)

