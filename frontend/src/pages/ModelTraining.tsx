import { useEffect, useState } from 'react'
import api from '../services/api'

export default function ModelTraining() {
  const [modelInfo, setModelInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [training, setTraining] = useState(false)
  const [trainingResult, setTrainingResult] = useState<any>(null)

  useEffect(() => {
    fetchModelInfo()
  }, [])

  const fetchModelInfo = async () => {
    setLoading(true)
    try {
      const res = await api.get('/predictions/model-info')
      setModelInfo(res.data)
    } catch (err) {
      console.error('Failed to fetch model info:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTrainModel = async () => {
    setTraining(true)
    setTrainingResult(null)
    try {
      const res = await api.post('/predictions/train-model', {})
      setTrainingResult(res.data)
      if (res.data.success) {
        await fetchModelInfo()
      }
    } catch (err) {
      setTrainingResult({
        success: false,
        error: String(err),
        message: 'Failed to train model'
      })
    } finally {
      setTraining(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Model Training</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Train the ML model to predict student completion likelihood and assess dropout risk.
        </p>

        <button
          onClick={handleTrainModel}
          disabled={training}
          className="px-6 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {training ? 'Training...' : '🚀 Train Model'}
        </button>
      </div>

      {trainingResult && (
        <div className={`p-4 rounded shadow ${trainingResult.success ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'}`}>
          <h3 className="font-bold mb-2">{trainingResult.success ? '✅ Success' : '❌ Error'}</h3>
          <p className="text-sm mb-2">{trainingResult.message}</p>
          {trainingResult.error && (
            <p className="text-xs text-gray-600 dark:text-gray-400">{trainingResult.error}</p>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading model information...</div>
      ) : modelInfo?.trained ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Metrics Card */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">📊 Model Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="font-mono font-bold text-green-600">{(modelInfo.accuracy * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Precision:</span>
                <span className="font-mono font-bold text-blue-600">{(modelInfo.precision * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Recall:</span>
                <span className="font-mono font-bold text-yellow-600">{(modelInfo.recall * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>F1 Score:</span>
                <span className="font-mono font-bold text-purple-600">{(modelInfo.f1_score * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Training Data Card */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">📚 Training Data</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Training Samples:</span>
                <span className="font-mono font-bold">{modelInfo.training_samples}</span>
              </div>
              <div className="flex justify-between">
                <span>Test Samples:</span>
                <span className="font-mono font-bold">{modelInfo.test_samples}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-mono font-bold">
                  {(modelInfo.training_samples || 0) + (modelInfo.test_samples || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Train/Test Split:</span>
                <span className="font-mono text-xs">80/20</span>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">🎯 Features Used ({modelInfo.features_used?.length || 0})</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {modelInfo.features_used?.map((feat: string) => (
                <div key={feat} className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
                  {feat}
                </div>
              ))}
            </div>
          </div>

          {/* Feature Importance Card */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">⭐ Feature Importance (Top 10)</h3>
            <div className="space-y-2">
              {modelInfo.feature_importance &&
                Object.entries(modelInfo.feature_importance)
                  .sort((a: any, b: any) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([feat, importance]: [string, any]) => (
                    <div key={feat} className="flex items-center gap-2">
                      <span className="w-32 text-sm truncate">{feat}</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded h-6">
                        <div
                          className="bg-indigo-500 h-6 rounded flex items-center justify-end pr-2"
                          style={{ width: `${(importance as number) * 100}%` }}
                        >
                          <span className="text-white text-xs font-bold">
                            {((importance as number) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded">
          <h3 className="font-bold mb-2">⚠️ Model Not Trained</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            The model has not been trained yet. Click the button above to train it on student data.
          </p>
        </div>
      )}

      {/* Help Section */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
        <h3 className="font-bold mb-2">📖 How it Works</h3>
        <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
          <li>• The model predicts whether students will complete their studies (final grade ≥ 60)</li>
          <li>• It uses features like study hours, attendance, engagement, and stress level</li>
          <li>• Accuracy measures overall correctness of predictions</li>
          <li>• Feature importance shows which inputs most influence predictions</li>
          <li>• Retrain periodically as new student data arrives</li>
        </ul>
      </div>
    </div>
  )
}
