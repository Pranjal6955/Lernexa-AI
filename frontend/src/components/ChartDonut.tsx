import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  labels: string[]
  values: number[]
  title?: string
}

export default function ChartDonut({ labels, values, title }: Props) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ['#4F46E5', '#06B6D4', '#F59E0B', '#EF4444', '#10B981'],
      },
    ],
  }

  const options = {
    responsive: true,
    cutout: '60%'
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-medium mb-2">{title || 'Donut Chart'}</h3>
      <Doughnut data={data} options={options} />
    </div>
  )
}
