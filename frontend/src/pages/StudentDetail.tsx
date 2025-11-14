import { useEffect, useState, Suspense, lazy } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

const ChartLine = lazy(() => import('../components/ChartLine'))

export default function StudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let mounted = true
    api
      .get(`/insights/student/${id}`)
      .then((res) => mounted && setStudent(res.data))
      .catch(() => setStudent(null))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!student) return <div>Student not found</div>

  // Build a small metrics series from available fields if no explicit metrics provided
  const metrics = (() => {
    if (student?.metrics && Array.isArray(student.metrics.labels)) return student.metrics
    // try performance_analysis or engagement_analysis
    const perf = student?.performance_analysis || {}
    const engage = student?.engagement_analysis || {}
    const labels: string[] = []
    const values: number[] = []

    if (perf.final_grade != null) {
      labels.push('FinalGrade')
      values.push(Number(perf.final_grade))
    }
    if (perf.exam_score != null) {
      labels.push('ExamScore')
      values.push(Number(perf.exam_score))
    }
    if (engage.engagement_score != null) {
      labels.push('Engagement')
      values.push(Number(engage.engagement_score))
    }

    return { labels, values }
  })()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Student: {student?.name || student?.Name || id}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-medium mb-2">Details</h3>
          <table className="text-sm w-full table-auto">
            <tbody>
              {Object.entries(student || {}).filter(([k]) => k !== 'email' && k !== 'Email').map(([k, v]) => (
                <tr key={k}>
                  <td className="py-1 font-medium align-top w-36 pr-4 text-xs">{k}</td>
                  <td className="py-1 align-top">
                    <div className="break-words whitespace-pre-wrap max-w-full text-sm">{typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v ?? '—')}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <Suspense fallback={<div>Loading chart...</div>}>
            <ChartLine labels={metrics.labels || []} values={metrics.values || []} title="Performance Over Time" />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
