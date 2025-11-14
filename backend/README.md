# Lernexa AI - Learning Insights Dashboard Backend

AI-Powered Learning Insights Dashboard backend API built with Flask, MongoDB, and scikit-learn.

## Features

- 📊 **Student Insights**: Personalized learning insights and recommendations
- 📈 **Trends Analysis**: Learning completion, scores, dropout rates, and engagement trends
- 🤖 **ML Predictions**: Completion likelihood prediction using Gradient Boosting
- 🎯 **Risk Assessment**: Dropout risk assessment for early intervention
- 📚 **Kaggle Integration**: Support for downloading education datasets

## Tech Stack

- **Framework**: Flask 3.0
- **Database**: MongoDB (via PyMongo)
- **ML**: scikit-learn (Gradient Boosting Classifier)
- **Data Processing**: Pandas, NumPy
- **Visualization**: Plotly (for frontend integration)

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/learning?retryWrites=true&w=majority

DATABASE_NAME=lernexa_ai
PORT=5000
DEBUG=True
SECRET_KEY=your-secret-key-here
MODEL_DIR=./models
```

### 3. Prepare Data

Run the data pipeline:

```bash
python run.py
# Select option 4 to run all steps:
# 1. Clean raw data
# 2. Generate features
# 3. Insert data to MongoDB
```

### 4. Start the API Server

```bash
python start_server.py
# Or
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /api/health` - API health check

### Students
- `GET /api/students` - Get paginated list of students
  - Query params: `page`, `limit`, `search`
- `GET /api/students/<student_id>` - Get specific student
- `GET /api/students/stats` - Get overall statistics

### Insights
- `GET /api/insights/student/<student_id>` - Get personalized insights for a student
- `GET /api/insights/overview` - Get overall insights
- `GET /api/insights/engagement?student_id=<id>` - Get engagement insights
- `GET /api/insights/performance?student_id=<id>` - Get performance insights

### Trends
- `GET /api/trends/completion?period=all` - Learning completion trends
- `GET /api/trends/scores?period=all` - Average score trends
- `GET /api/trends/dropout?period=all` - Dropout rate trends
- `GET /api/trends/engagement?period=all` - Engagement trends
- `GET /api/trends/all?period=all` - All trends in one response

### Predictions (ML)
- `POST /api/predictions/completion-likelihood` - Predict completion likelihood
  ```json
  {
    "student_id": "STU001"
  }
  ```
- `POST /api/predictions/batch-predict` - Batch predictions
  ```json
  {
    "student_ids": ["STU001", "STU002"]
  }
  ```
- `POST /api/predictions/risk-assessment` - Assess dropout risk
- `POST /api/predictions/train-model` - Train/retrain ML model
- `GET /api/predictions/model-info` - Get model information

## ML Model

The backend includes a Gradient Boosting Classifier that predicts student completion likelihood based on:
- Study hours
- Attendance
- Assignment completion
- Engagement metrics
- Stress levels
- Technology usage

### Training the Model

```bash
# Via API
curl -X POST http://localhost:5000/api/predictions/train-model

# Or programmatically
from services.ml_service import MLService
ml_service = MLService()
result = ml_service.train_model()
```

The model is automatically saved to `./models/` directory and loaded on startup.

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── start_server.py        # Server startup script
├── run.py                 # Data pipeline CLI
├── requirements.txt       # Python dependencies
├── config/
│   └── database.py        # Database configuration
├── routes/
│   ├── insights.py        # Insights endpoints
│   ├── trends.py          # Trends endpoints
│   ├── predictions.py     # ML prediction endpoints
│   └── students.py        # Student data endpoints
├── services/
│   ├── data_service.py    # Data access layer
│   ├── insights_service.py # Insights generation
│   ├── trends_service.py  # Trend calculations
│   └── ml_service.py       # ML model operations
├── database/
│   └── insert_data.py     # MongoDB data insertion
├── scripts/
│   ├── clean_data.py      # Data cleaning
│   └── generate_features.py # Feature engineering
├── utils/
│   └── kaggle_api.py      # Kaggle API integration
└── models/                # Saved ML models (created automatically)
```

## Testing with Postman

1. Import the API endpoints into Postman
2. Set base URL: `http://localhost:5000`
3. Test endpoints:
   - Health: `GET /api/health`
   - Students: `GET /api/students`
   - Insights: `GET /api/insights/overview`
   - Trends: `GET /api/trends/all`
   - Predict: `POST /api/predictions/completion-likelihood` with body `{"student_id": "STU001"}`

## Kaggle API Setup (Optional)

To use Kaggle API for downloading datasets:

1. Get Kaggle API credentials from https://www.kaggle.com/account
2. Download `kaggle.json`
3. Place it in `~/.kaggle/kaggle.json`
4. Use the utility:
   ```python
   from utils.kaggle_api import KaggleAPI
   kaggle = KaggleAPI()
   result = kaggle.download_dataset('spscientist/students-performance-in-exams')
   ```

## Development

### Code Style
- Follow PEP 8
- Use `black` for formatting: `black .`
- Use `flake8` for linting: `flake8 .`

### Testing
```bash
pytest
```

## License

MIT

