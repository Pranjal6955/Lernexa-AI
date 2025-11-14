import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Students = lazy(() => import('./pages/Students'))
const Predictions = lazy(() => import('./pages/Predictions'))
const Trends = lazy(() => import('./pages/Trends'))
const StudentDetail = lazy(() => import('./pages/StudentDetail'))
const ModelTraining = lazy(() => import('./pages/ModelTraining'))

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Lernexa Dashboard</h1>
            <nav className="space-x-4">
            <Link to="/" className="text-sm hover:underline">Dashboard</Link>
            <Link to="/students" className="text-sm hover:underline">Students</Link>
            <Link to="/predictions" className="text-sm hover:underline">Predictions</Link>
            <Link to="/trends" className="text-sm hover:underline">Trends</Link>
            <Link to="/training" className="text-sm hover:underline">Training</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <Suspense fallback={<div>Loading page...</div>}>
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
  )
}
