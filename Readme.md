# Lernexa-AI 🚀

**AI-Powered Learning Insights Dashboard** - A comprehensive full-stack application that provides intelligent insights, predictive analytics, and data visualization for educational performance monitoring.

![GitHub repo size](https://img.shields.io/github/repo-size/Pranjal6955/Lernexa-AI)
![GitHub language count](https://img.shields.io/github/languages/count/Pranjal6955/Lernexa-AI)
![GitHub top language](https://img.shields.io/github/languages/top/Pranjal6955/Lernexa-AI)
![GitHub last commit](https://img.shields.io/github/last-commit/Pranjal6955/Lernexa-AI)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Lernexa-AI is a modern learning analytics platform that combines machine learning, data visualization, and intuitive user interfaces to provide actionable insights into student performance. The platform helps educators identify at-risk students, track learning trends, and make data-driven decisions to improve educational outcomes.

### Key Capabilities
- **📊 Student Performance Analytics**: Comprehensive dashboards with individual student insights
- **🤖 AI-Powered Predictions**: Machine learning models for completion likelihood and dropout risk assessment
- **📈 Trend Analysis**: Visual analysis of learning patterns, engagement metrics, and performance trends
- **🎯 Risk Assessment**: Early identification of students at risk of dropping out
- **📚 Interactive Dashboards**: Real-time data visualization with responsive design

## ✨ Features

### 🎓 Student Management
- **Student Profiles**: Detailed individual student information and performance metrics
- **Search & Filtering**: Advanced search capabilities with pagination
- **Bulk Operations**: Batch predictions and data processing
- **Performance Tracking**: Comprehensive score and engagement monitoring

### 📊 Analytics & Insights
- **Personalized Insights**: AI-generated recommendations for individual students
- **Engagement Metrics**: Track study hours, attendance, and participation
- **Performance Trends**: Historical analysis of scores and completion rates
- **Comparative Analysis**: Benchmarking against cohort averages

### 🤖 Machine Learning
- **Completion Prediction**: Gradient boosting models for success likelihood
- **Dropout Risk Assessment**: Early warning system for at-risk students
- **Feature Engineering**: Advanced student behavior modeling
- **Model Management**: Training, evaluation, and deployment pipelines

### 📈 Visualizations
- **Interactive Charts**: Line charts, bar charts, pie charts, and heatmaps
- **Real-time Dashboards**: Live data updates with responsive design
- **Trend Analysis**: Multi-period trend visualization
- **Custom Reports**: Exportable insights and analytics

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Chart.js & React-Chart.js-2** - Data visualization
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Flask 3.1** - Python web framework
- **MongoDB** with PyMongo - NoSQL database
- **scikit-learn** - Machine learning library
- **Pandas & NumPy** - Data processing and analysis
- **Flask-CORS** - Cross-origin resource sharing
- **Plotly** - Advanced visualization support

### DevOps & Tools
- **Python 3.8+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **Git** - Version control
- **ESLint** - Code linting
- **TypeScript** - Type safety

## 📁 Project Structure

```
Lernexa-AI/
├── 📄 README.md                    # Project documentation
├── 🔧 .gitignore                   # Git ignore rules
├── 🖥️ frontend/                    # React frontend application
│   ├── 📦 package.json             # Node.js dependencies
│   ├── ⚡ vite.config.ts           # Vite configuration
│   ├── 🔧 tsconfig.json            # TypeScript configuration
│   ├── 🎨 src/                     # Source code
│   │   ├── 📱 App.tsx              # Main application component
│   │   ├── 🏠 pages/               # Page components
│   │   │   ├── Dashboard.tsx       # Main dashboard
│   │   │   ├── Students.tsx        # Student list view
│   │   │   ├── StudentDetail.tsx   # Individual student details
│   │   │   ├── Predictions.tsx     # ML predictions interface
│   │   │   └── Trends.tsx          # Trend analysis
│   │   ├── 🧩 components/          # Reusable components
│   │   │   ├── ChartBar.tsx        # Bar chart component
│   │   │   ├── ChartLine.tsx       # Line chart component
│   │   │   ├── ChartPie.tsx        # Pie chart component
│   │   │   ├── ChartDonut.tsx      # Donut chart component
│   │   │   └── Heatmap.tsx         # Heatmap visualization
│   │   └── 🔌 services/            # API service layer
│   └── 🌐 public/                  # Static assets
├── 🖲️ backend/                     # Flask backend API
│   ├── 📋 requirements.txt         # Python dependencies
│   ├── 🚀 app.py                   # Flask application entry point
│   ├── ⚙️ run.py                   # Data pipeline CLI
│   ├── 🔧 config/                  # Configuration modules
│   │   └── database.py             # Database setup
│   ├── 🛣️ routes/                  # API route handlers
│   │   ├── students.py             # Student endpoints
│   │   ├── insights.py             # Insights endpoints
│   │   ├── trends.py               # Trend analysis endpoints
│   │   └── predictions.py          # ML prediction endpoints
│   ├── 🎯 services/                # Business logic layer
│   │   ├── data_service.py         # Data access service
│   │   ├── insights_service.py     # Insights generation
│   │   ├── trends_service.py       # Trend calculation
│   │   └── ml_service.py           # Machine learning service
│   ├── 📊 datasets/                # Data storage
│   │   ├── raw/                    # Original datasets
│   │   ├── processed/              # Cleaned data
│   │   └── features/               # Engineered features
│   ├── 📜 scripts/                 # Data processing scripts
│   │   ├── clean_data.py           # Data cleaning
│   │   ├── generate_features.py    # Feature engineering
│   │   └── insert_data.py          # Database insertion
│   └── 🧠 models/                  # Trained ML models
```

## 🚀 Installation

### Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Pranjal6955/Lernexa-AI.git
cd Lernexa-AI
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env_examples .env
```

**Configure your `.env` file:**
```env
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=lernexa_ai
PORT=5000
DEBUG=True
SECRET_KEY=your-secret-key-here
MODEL_DIR=./models
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Install additional chart dependencies if needed
npm install chart.js react-chartjs-2
```

### 4. Database Setup

```bash
# From backend directory, run data pipeline
cd ../backend
python run.py

# Follow the interactive prompts to:
# 1. Clean raw data
# 2. Generate features  
# 3. Insert data to MongoDB
# 4. Or run all steps at once
```

## 🎮 Usage

### Starting the Application

**Option 1: Manual Start**
```bash
# Terminal 1 - Start Backend
cd backend
python app.py
# Backend runs on http://localhost:5000

# Terminal 2 - Start Frontend  
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

**Option 2: Development Scripts**
```bash
# Backend development mode
cd backend
python app.py

# Frontend development mode  
cd frontend
npm run dev
```

### Accessing the Application

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
python app.py              # Start Flask server
python run.py             # Run data pipeline
python -m pytest         # Run tests (if available)
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | API health check |
| `/students` | GET | Get paginated students list |
| `/students/{id}` | GET | Get specific student details |
| `/insights/overview` | GET | Get general insights |
| `/insights/student/{id}` | GET | Get student-specific insights |
| `/trends/all` | GET | Get all trend data |
| `/predictions/completion-likelihood` | POST | Predict completion likelihood |
| `/predictions/risk-assessment` | POST | Assess dropout risk |

### Example API Calls

**Get Students:**
```bash
curl -X GET "http://localhost:5000/api/students?page=1&limit=10"
```

**Get Student Insights:**
```bash
curl -X GET "http://localhost:5000/api/insights/student/STU001"
```

**Predict Completion:**
```bash
curl -X POST "http://localhost:5000/api/predictions/completion-likelihood" \
  -H "Content-Type: application/json" \
  -d '{"student_id": "STU001"}'
```

For detailed API documentation, see [Backend README](./backend/README.md).

## 📸 Screenshots

*Coming Soon - Add screenshots of your dashboard, charts, and key features*

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly
- Use meaningful commit messages

### Code Style
- **Frontend**: ESLint configuration in `frontend/eslint.config.js`
- **Backend**: Follow PEP 8 standards
- **TypeScript**: Strict type checking enabled
- **Python**: Use type hints where applicable

## 🐛 Troubleshooting

**Common Issues:**

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify database permissions

2. **Frontend Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Python Import Errors**
   - Activate virtual environment
   - Install requirements: `pip install -r requirements.txt`
   - Check Python version compatibility

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Author**: Pranjal Negi
- **GitHub**: [@Pranjal6955](https://github.com/Pranjal6955)
- **Repository**: [Lernexa-AI](https://github.com/Pranjal6955/Lernexa-AI)

---

**⭐ Star this repository if you found it helpful!**

**📤 Share feedback and suggestions via Issues**

*Built with ❤️ for better educational insights*