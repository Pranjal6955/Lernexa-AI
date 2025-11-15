import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type Props = {
  labels: string[]
  values: number[]
  title?: string
}

export default function ChartLine({ labels, values, title }: Props) {
  if (!labels || !values || labels.length === 0 || values.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title || 'Line Chart'}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    )
  }

  const data = {
    labels,
    datasets: [
      {
        label: title || 'Series',
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
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
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{title || 'Line Chart'}</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
