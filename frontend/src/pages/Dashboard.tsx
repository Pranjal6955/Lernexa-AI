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

    // fetch overview stats
    api.get('/insights/overview').then((res) => { if (mounted) setOverview(res.data) }).catch(() => {})

    // fetch a large page of students for building charts (limit high so features are visible)
    api.get('/students', { params: { page: 1, limit: 2000 } })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.students ?? []
        if (mounted) setStudents(list)
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  if (loading) return <div>Loading...</div>

  // Prepare feature distributions dynamically
  const allKeys = Array.from(new Set(students.flatMap((s: any) => Object.keys(s || {}))))

  // select numeric keys and categorical keys
  const numericKeys = allKeys.filter((k) => students.some((s) => isNumeric(s[k])))
  const categoricalKeys = allKeys.filter((k) => !numericKeys.includes(k) && students.some((s) => s[k] != null))

  // build small set of charts: up to 4 numeric histograms and up to 3 categorical pies
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Summary: {overview?.summary || '—'}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-medium mb-2">Stats</h3>
          <ul className="text-sm space-y-1">
            <li>Total students: {overview?.total_students ?? students.length ?? '—'}</li>
            <li>Avg score: {overview?.averages?.final_grade ?? '—'}</li>
            <li>Avg engagement: {overview?.averages?.engagement_score ?? '—'}</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <Suspense fallback={<div>Loading charts...</div>}>
            {numericCharts.map((c) => (
              <ChartBar key={c.key} labels={c.data.labels} values={c.data.values} title={`${c.key} distribution`} />
            ))}

            {categoricalCharts.map((c) => (
              <ChartPie key={c.key} labels={c.data.labels} values={c.data.values} title={`${c.key} breakdown`} />
            ))}
          </Suspense>
        </div>

        <div>
          <Suspense fallback={<div>Loading heatmap...</div>}>
            {heat ? (
              <Heatmap matrix={heat} title="Engagement Heatmap" />
            ) : (
              <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">No heatmap available</div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
