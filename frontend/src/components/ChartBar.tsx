import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Props = {
  labels: string[]
  values: number[]
  title?: string
}

export default function ChartBar({ labels, values, title }: Props) {
  if (!labels || !values || labels.length === 0 || values.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title || 'Bar Chart'}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    )
  }

  const data = {
    labels,
    datasets: [
      {
        label: title || 'Values',
        data: values,
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#06b6d4',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#ec4899',
          '#14b8a6',
          '#f97316',
          '#06b6d4',
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { 
      legend: { display: !!title, labels: { font: { size: 12, weight: 500 as any }, color: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#374151' } },
      tooltip: {
        enabled: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        titleColor: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#111827',
        bodyColor: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#1f2937',
        borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280' },
        grid: { color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb' },
      },
      x: {
        ticks: { color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280' },
        grid: { color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb' },
      }
    }
  }

    return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{title || 'Bar Chart'}</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
