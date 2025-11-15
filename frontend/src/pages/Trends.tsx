import { useEffect, useState, Suspense, lazy } from 'react'
import api from '../services/api'

const ChartLine = lazy(() => import('../components/ChartLine'))
const ChartBar = lazy(() => import('../components/ChartBar'))
const ChartDonut = lazy(() => import('../components/ChartDonut'))

export default function Trends() {
  const [trends, setTrends] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/trends/all')
      .then((res) => {
        if (mounted) setTrends(res.data)
      })
      .catch((err) => {
        console.error('Error fetching trends:', err)
        if (mounted) setTrends(null)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  
  if (!trends) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Trends</h2>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <p className="text-sm text-gray-500">No trends data available. Please ensure the backend is running and has student data.</p>
        </div>
      </div>
    )
  }

  // Map backend trends to labels/values for charts
  const completionByGrade = trends?.completion?.completion_by_grade || null
  const completion = completionByGrade
    ? { labels: Object.keys(completionByGrade), values: Object.values(completionByGrade).map((v: any) => Number(v)) }
    : { labels: [], values: [] }

  const scoreDist = trends?.scores?.score_distribution || null
  const scoresHistogram = scoreDist
    ? { labels: Object.keys(scoreDist), values: Object.values(scoreDist).map((v: any) => Number(v)) }
    : { labels: [], values: [] }

  const dropoutData = trends?.dropout || null
  const dropout = (() => {
    if (!dropoutData) return { labels: [], values: [] }
    if (dropoutData.at_risk_students != null && dropoutData.total_students != null) {
      return { labels: ['At risk', 'Others'], values: [dropoutData.at_risk_students, Math.max(0, dropoutData.total_students - dropoutData.at_risk_students)] }
    }
    if (dropoutData.risk_indicators && typeof dropoutData.risk_indicators === 'object') {
      return { labels: Object.keys(dropoutData.risk_indicators), values: Object.values(dropoutData.risk_indicators) }
    }
    return { labels: [], values: [] }
  })()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Trends</h1>
        <p className="text-gray-600 dark:text-gray-400">Analyze student performance trends and patterns</p>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Loading trends data...</p>
        </div>
      ) : !trends ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No trends data available. Please ensure the backend is running.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">Loading chart...</div>}>
              <ChartLine labels={completion.labels || []} values={completion.values || []} title="Completion Trends" />
            </Suspense>

            <Suspense fallback={<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">Loading chart...</div>}>
              <ChartBar labels={scoresHistogram.labels || []} values={scoresHistogram.values || []} title="Score Distribution" />
            </Suspense>
          </div>

          <Suspense fallback={<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">Loading chart...</div>}>
            <ChartDonut labels={dropout.labels || []} values={dropout.values || []} title="Dropout Risk Analysis" />
          </Suspense>
        </div>
      )}
    </div>
  )
}
