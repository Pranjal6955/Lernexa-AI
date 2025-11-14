import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Predictions from './pages/Predictions'
import Trends from './pages/Trends'
import './index.css'

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
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/trends" element={<Trends />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
