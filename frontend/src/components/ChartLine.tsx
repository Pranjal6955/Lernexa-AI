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
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h3 className="font-medium mb-2">{title || 'Line Chart'}</h3>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    )
  }

  const data = {
    labels,
    datasets: [
      {
        label: title || 'Series',
        data: values,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79,70,229,0.08)',
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { 
      legend: { display: !!title },
      tooltip: {
        enabled: true,
      }
    },
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-medium mb-2">{title || 'Line Chart'}</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
