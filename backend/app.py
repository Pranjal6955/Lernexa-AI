"""
Flask API Server for Lernexa AI - Learning Insights Dashboard
Main application entry point
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.getenv('DEBUG', 'False').lower() == 'true'

from routes import insights, trends, predictions, students

app.register_blueprint(insights.bp, url_prefix='/api/insights')
app.register_blueprint(trends.bp, url_prefix='/api/trends')
app.register_blueprint(predictions.bp, url_prefix='/api/predictions')
app.register_blueprint(students.bp, url_prefix='/api/students')

@app.route('/')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Lernexa AI Learning Insights API',
        'version': '1.0.0'
    })

@app.route('/api/health')
def api_health():
    """API health check"""
    return jsonify({
        'status': 'ok',
        'service': 'lernexa-ai-backend'
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = app.config['DEBUG']
    app.run(host='0.0.0.0', port=port, debug=debug)


