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
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Student Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Detailed information and analytics for {student?.name || student?.Name || 'the student'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Information</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(student || {}).filter(([k]) => k !== 'email' && k !== 'Email').map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 w-40">{k}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                        <div className="break-words whitespace-pre-wrap max-w-full">
                          {typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v ?? '—')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <Suspense fallback={<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">Loading chart...</div>}>
            <ChartLine labels={metrics.labels || []} values={metrics.values || []} title="Performance Metrics" />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
