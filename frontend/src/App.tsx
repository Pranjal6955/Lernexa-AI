import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import './index.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Students = lazy(() => import('./pages/Students'))
const Predictions = lazy(() => import('./pages/Predictions'))
const Trends = lazy(() => import('./pages/Trends'))
const StudentDetail = lazy(() => import('./pages/StudentDetail'))
const ModelTraining = lazy(() => import('./pages/ModelTraining'))

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-lg transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Lernexa
                </h1>
              </div>
              <nav className="flex items-center gap-8">
                <div className="hidden md:flex space-x-6">
                  <Link to="/" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                  <Link to="/students" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Students</Link>
                  <Link to="/predictions" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Predictions</Link>
                  <Link to="/trends" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Trends</Link>
                  <Link to="/training" className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Training</Link>
                </div>
                <ThemeToggle />
              </nav>
            </div>
          </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<div className="text-center py-12">Loading page...</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/:id" element={<StudentDetail />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/training" element={<ModelTraining />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
    </ThemeProvider>
  )
}
