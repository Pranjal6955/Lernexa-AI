import React from 'react'
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
        ],
      },
    ],
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-medium mb-2">{title || 'Pie Chart'}</h3>
      <Pie data={data} />
    </div>
  )
}
