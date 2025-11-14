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
    <div>
      <h2 className="text-lg font-semibold mb-4">Predictions</h2>
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow space-y-3">
        <div>
          <label className="block text-sm mb-1">Student ID</label>
          <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full px-3 py-2 rounded border" placeholder="e.g. 123" />
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handlePredict} className="px-3 py-2 bg-indigo-600 text-white rounded">
            Predict
          </button>
          {loading && <span>Loading...</span>}
        </div>

        {result && (
          <div className="mt-2 text-sm">
            <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
