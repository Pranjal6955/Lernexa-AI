import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Students() {
  const [students, setStudents] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    api
      .get('/students', { params: { page, limit: 200 } })
      .then((res) => {
        // backend returns { students: [...], pagination: {...} }
        const data = res.data
        const list = Array.isArray(data) ? data : data?.students ?? []
        setStudents(list)

        // derive table columns dynamically from the returned student objects
        const cols = new Set<string>()
        list.forEach((s: any) => Object.keys(s || {}).forEach((k) => cols.add(k)))
        // remove email fields if present (dataset doesn't include them)
        cols.delete('email')
        cols.delete('Email')
        // remove id and name columns per request
        cols.delete('id')
        cols.delete('Name')
        cols.delete('name')
        // prefer common ordering: StudentID, FinalGrade/ExamScore, then the rest
        const preferred: string[] = []
        if (cols.has('StudentID')) preferred.push('StudentID')
        if (cols.has('FinalGrade')) preferred.push('FinalGrade')
        if (cols.has('ExamScore')) preferred.push('ExamScore')
        
        const rest = Array.from(cols).filter((c) => !preferred.includes(c)).sort()
        setColumns([...preferred, ...rest])
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Students</h1>
        <p className="text-gray-600 dark:text-gray-400">Browse and manage student profiles</p>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No students found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  {columns.map((col) => (
                    <th key={col} className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s: any, idx: number) => {
                  const id = s.id || s.StudentID || s._id || `row-${idx}`
                  return (
                    <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors">
                      {columns.map((col) => {
                        let cell = s[col]
                        if (typeof cell === 'object' && cell !== null) {
                          try {
                            cell = JSON.stringify(cell)
                          } catch {
                            cell = String(cell)
                          }
                        }

                        if ((col === 'StudentID' || col === 'id' || col === '_id') && id) {
                          return (
                            <td key={col} className="px-6 py-3">
                              <Link to={`/students/${id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                {s.Name || s.name || id}
                              </Link>
                            </td>
                          )
                        }

                        return (
                          <td key={col} className="px-6 py-3 text-gray-700 dark:text-gray-300">
                            {cell ?? '—'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          disabled={page === 1}
        >
          ← Previous
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Page {page}</span>
        <button 
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
