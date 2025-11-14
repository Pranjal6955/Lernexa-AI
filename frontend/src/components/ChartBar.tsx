import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Props = {
  labels: string[]
  values: number[]
  title?: string
}

export default function ChartBar({ labels, values, title }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: title || 'Values',
        data: values,
        backgroundColor: '#06B6D4',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: { legend: { display: !!title } },
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-medium mb-2">{title || 'Bar Chart'}</h3>
      <Bar data={data} options={options} />
    </div>
  )
}
