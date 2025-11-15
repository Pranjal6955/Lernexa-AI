import { useState } from 'react'
import api from '../services/api'

export default function Predictions() {
  const [studentId, setStudentId] = useState('')
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    if (!studentId) return
    setLoading(true)
    try {
      const res = await api.post('/predictions/completion-likelihood', { student_id: studentId })
      setResult(res.data)
    } catch (e: any) {
      setResult({ error: e?.response?.data || String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Predictions</h1>
        <p className="text-gray-600 dark:text-gray-400">Predict student completion likelihood and risk assessment</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student ID</label>
            <input 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handlePredict()}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
              placeholder="e.g., 123" 
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePredict} 
              disabled={!studentId || loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Predicting...' : 'Predict'}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Results</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-auto max-h-96">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
