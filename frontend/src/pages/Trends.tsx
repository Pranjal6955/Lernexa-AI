import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ChartLine from '../components/ChartLine'

export default function Trends() {
  const [trends, setTrends] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    api
      .get('/trends/all')
      .then((res) => mounted && setTrends(res.data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div>Loading...</div>

  const completion = trends?.completion?.series || { labels: [], values: [] }
  const scores = trends?.scores?.series || { labels: [], values: [] }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartLine labels={completion.labels || []} values={completion.values || []} title="Completion Trends" />
        <ChartLine labels={scores.labels || []} values={scores.values || []} title="Average Scores" />
      </div>
    </div>
  )
}
