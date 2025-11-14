import { } from 'react'

type Props = {
  matrix: number[][]
  labels?: string[]
  title?: string
}

function getColor(value: number, max = 1) {
  const v = Math.max(0, Math.min(1, value / max))
  const r = Math.round(255 * (1 - v))
  const g = Math.round(180 * v)
  return `rgb(${r}, ${g}, 80)`
}

export default function Heatmap({ matrix, labels, title }: Props) {
  if (!matrix || !Array.isArray(matrix) || matrix.length === 0 || !matrix[0] || matrix[0].length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h3 className="font-medium mb-2">{title || 'Heatmap'}</h3>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    )
  }

  const max = Math.max(...matrix.flat(), 1)

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="font-medium mb-2">{title || 'Heatmap'}</h3>
      <div className="overflow-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, 28px)` }}>
          {matrix.flatMap((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                title={`${labels ? labels[cIdx] : cIdx}: ${cell}`}
                className="w-7 h-7 rounded-sm"
                style={{ backgroundColor: getColor(cell, max) }}
              />
            )),
          )}
        </div>
      </div>
    </div>
  )
}
