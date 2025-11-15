import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { mode, toggleTheme } = useTheme()

  const getModeIcon = () => {
    return mode === 'light' ? '☀️' : '🌙'
  }

  const getModeLabel = () => {
    return mode === 'light' ? 'Light' : 'Dark'
  }

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm flex items-center gap-2"
      title={`Toggle theme (currently ${getModeLabel()})`}
    >
      <span>{getModeIcon()}</span>
      <span className="hidden sm:inline">{getModeLabel()}</span>
    </button>
  )
}
