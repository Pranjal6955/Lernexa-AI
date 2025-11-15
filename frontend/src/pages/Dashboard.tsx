import { useEffect, useState, Suspense, lazy } from 'react'
import api from '../services/api'

const ChartPie = lazy(() => import('../components/ChartPie'))
const ChartBar = lazy(() => import('../components/ChartBar'))
const Heatmap = lazy(() => import('../components/Heatmap'))

function isNumeric(v: any) {
  return v !== null && v !== undefined && !isNaN(Number(v))
}

function histogram(values: number[], bins = 6) {
  if (!values.length) return { labels: [], values: [] }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const step = (max - min) / bins || 1
  const counts = new Array(bins).fill(0)
  values.forEach((v) => {
    const idx = Math.min(bins - 1, Math.floor((v - min) / step))
    counts[idx]++
  })
  const labels = counts.map((_, i) => `${(min + i * step).toFixed(1)}–${(min + (i + 1) * step).toFixed(1)}`)
  return { labels, values: counts }
}

export default function Dashboard() {
  const [overview, setOverview] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    let mounted = true

    api.get('/insights/overview')
      .then((res) => { 
        if (mounted) setOverview(res.data)
      })
      .catch((err) => {
        console.error('Error fetching overview:', err)
        if (mounted) setOverview(null)
      })

    api.get('/students', { params: { page: 1, limit: 2000 } })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.students ?? []
        if (mounted) setStudents(list)
      })
      .catch((err) => {
        console.error('Error fetching students:', err)
        if (mounted) setStudents([])
      })
      .finally(() => { 
        if (mounted) setLoading(false) 
      })

    return () => { mounted = false }
  }, [])

  if (loading) return <div className="p-4">Loading...</div>

  const allKeys = students.length > 0 
    ? Array.from(new Set(students.flatMap((s: any) => Object.keys(s || {}))))
    : []

  const excludeKeys = ['_id', 'id', 'StudentID', '__v']
  const chartKeys = allKeys.filter((k) => !excludeKeys.includes(k))

  const numericKeys = chartKeys.filter((k) => students.some((s) => isNumeric(s[k])))
  const categoricalKeys = chartKeys.filter((k) => !numericKeys.includes(k) && students.some((s) => s[k] != null))

  const numericCharts = numericKeys.slice(0, 4).map((k) => {
    const vals = students.map((s) => Number(s[k])).filter((n) => !isNaN(n))
    return { key: k, data: histogram(vals, 6) }
  })

  const categoricalCharts = categoricalKeys.slice(0, 3).map((k) => {
    const counts: Record<string, number> = {}
    students.forEach((s) => {
      const v = s[k] == null ? 'Unknown' : String(s[k])
      counts[v] = (counts[v] || 0) + 1
    })
    return { key: k, data: { labels: Object.keys(counts), values: Object.values(counts).map((n) => Number(n)) } }
  })

  const heat = overview?.engagement_heatmap || null

  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your student analytics overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</h3>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {overview?.total_students ?? students.length ?? 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Active students</p>
        </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Score</h3>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {(overview?.averages?.final_grade ?? 0).toFixed(1)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Final grade average</p>
        </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</h3>
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {(overview?.averages?.engagement_score ?? 0).toFixed(1)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Student engagement</p>
        </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Overview</h3>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
            {overview?.summary || 'System ready'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Data Visualizations</h2>
          <p className="text-gray-600 dark:text-gray-400">Explore student performance metrics</p>
        </div>

        {students.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No student data available. Please ensure the backend is running.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Suspense fallback={<div className="text-center py-12">Loading charts...</div>}>
                {numericCharts.length === 0 && categoricalCharts.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No chartable data available.</p>
                  </div>
                ) : (
                  <>
                    {numericCharts.map((c) => (
                      <ChartBar key={c.key} labels={c.data.labels} values={c.data.values} title={`${c.key} distribution`} />
                    ))}

                    {categoricalCharts.map((c) => (
                      <ChartPie key={c.key} labels={c.data.labels} values={c.data.values} title={`${c.key} breakdown`} />
                    ))}
                  </>
                )}
              </Suspense>
            </div>

            <div>
              <Suspense fallback={<div className="text-center py-12">Loading heatmap...</div>}>
                {heat ? (
                  <Heatmap matrix={heat} title="Engagement Heatmap" />
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Heatmap unavailable</p>
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
