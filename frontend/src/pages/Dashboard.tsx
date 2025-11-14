import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ChartPie from '../components/ChartPie'
import Heatmap from '../components/Heatmap'

export default function Dashboard() {
  const [overview, setOverview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/insights/overview')
      .then((res) => {
        if (mounted) setOverview(res.data)
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div>Loading...</div>

  const categories = overview?.category_distribution || { labels: [], values: [] }
  const heat = overview?.engagement_heatmap || [[0]]

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
            <li>Total students: {overview?.total_students ?? '—'}</li>
            <li>Avg score: {overview?.avg_score ?? '—'}</li>
            <li>Completion rate: {overview?.completion_rate ?? '—'}</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ChartPie labels={categories.labels || []} values={categories.values || []} title="Category Distribution" />
        </div>
        <div>
          <Heatmap matrix={heat} title="Engagement Heatmap" />
        </div>
      </div>
    </div>
  )
}
