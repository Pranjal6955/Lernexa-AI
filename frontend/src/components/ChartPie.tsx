import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  labels: string[]
  values: number[]
  title?: string
}

export default function ChartPie({ labels, values, title }: Props) {
  if (!labels || !values || labels.length === 0 || values.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h3 className="font-medium mb-2">{title || 'Pie Chart'}</h3>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    )
  }

  const data = {
    labels,
    datasets: [
      {
        label: title || 'Dataset',
        data: values,
        backgroundColor: [
          '#4F46E5',
          '#06B6D4',
          '#F59E0B',
          '#EF4444',
          '#10B981',
          '#8B5CF6',
          '#EC4899',
          '#F97316',
        ],
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        enabled: true,
      }
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-medium mb-2">{title || 'Pie Chart'}</h3>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  )
}
