import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Students() {
  const [students, setStudents] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api
      .get('/students', { params: { page, limit: 50 } })
      .then((res) => {
        // backend returns { students: [...], pagination: {...} }
        const data = res.data
        if (Array.isArray(data)) {
          setStudents(data)
        } else if (data && Array.isArray(data.students)) {
          setStudents(data.students)
        } else {
          setStudents([])
        }
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
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any) => {
                const id = s.id || s.StudentID || s._id || '—'
                const name = s.name || s.Name || '—'
                const email = s.email || s.Email || '—'
                const score = s.avg_score ?? s.FinalGrade ?? s.ExamScore ?? '—'
                return (
                  <tr key={id} className="border-b last:border-b-0">
                    <td className="px-4 py-2">{id}</td>
                    <td className="px-4 py-2">{name}</td>
                    <td className="px-4 py-2">{email}</td>
                    <td className="px-4 py-2">{score}</td>
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
