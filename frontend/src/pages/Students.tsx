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
    <div>
      <h2 className="text-lg font-semibold mb-4">Students</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-auto bg-white dark:bg-gray-800 rounded shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                {columns.map((col) => (
                  <th key={col} className="px-4 py-2">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s: any, idx: number) => {
                const id = s.id || s.StudentID || s._id || `row-${idx}`
                return (
                  <tr key={id} className="border-b last:border-b-0">
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
                          <td key={col} className="px-4 py-2">
                            <Link to={`/students/${id}`} className="text-indigo-600 hover:underline">{s.Name || s.name || id}</Link>
                          </td>
                        )
                      }

                      return (
                        <td key={col} className="px-4 py-2">{cell ?? '—'}</td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center space-x-2">
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span>Page {page}</span>
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
