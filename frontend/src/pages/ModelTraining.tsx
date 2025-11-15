import { useEffect, useState } from 'react'
import api from '../services/api'

export default function ModelTraining() {
  const [modelInfo, setModelInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Model Training</h1>
          <p className="text-gray-600 dark:text-gray-400">Train and monitor the ML model for student prediction</p>
        </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🤖 Train Completion Model</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Train the ML model to predict student completion likelihood and assess dropout risk.
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-6">
              <li>✓ Predicts final grade completion (≥median)</li>
              <li>✓ Analyzes 12 key student features</li>
              <li>✓ Generates feature importance metrics</li>
            </ul>
          </div>
        </div>
      </div>

      {trainingResult && (
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border-l-4 ${trainingResult.success ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
          <h3 className={`text-lg font-bold mb-2 ${trainingResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
            {trainingResult.success ? '✅ Training Successful' : '❌ Training Failed'}
          </h3>
          <p className={`text-sm mb-2 ${trainingResult.success ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
            {trainingResult.message}
          </p>
          {trainingResult.error && (
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">{trainingResult.error}</p>
          )}
        </div>
      )}

      {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Loading model information...</p>
        </div>
      ) : modelInfo?.trained ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</h3>
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {(modelInfo.accuracy * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Overall correctness</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Precision</h3>
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {(modelInfo.precision * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Positive prediction accuracy</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Recall</h3>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {(modelInfo.recall * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">True positive rate</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">F1 Score</h3>
                <span className="text-2xl">⭐</span>
              </div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {(modelInfo.f1_score * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Harmonic mean</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📚 Training Data</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Training Samples</span>
                  <span className="font-bold text-gray-900 dark:text-white">{modelInfo.training_samples}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Test Samples</span>
                  <span className="font-bold text-gray-900 dark:text-white">{modelInfo.test_samples}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {(modelInfo.training_samples || 0) + (modelInfo.test_samples || 0)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">80/20 Train/Test Split</div>
              </div>
            </div>

              <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Features Used ({modelInfo.features_used?.length || 0})</h3>
                <div className="grid grid-cols-2 gap-2">
                  {modelInfo.features_used?.map((feat: string) => (
                    <div key={feat} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-3 py-2 rounded-lg font-medium">
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">⭐ Top 10 Feature Importance</h3>
            <div className="space-y-3">
              {modelInfo.feature_importance &&
                Object.entries(modelInfo.feature_importance)
                  .sort((a: any, b: any) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([feat, importance]: [string, any], idx) => (
                    <div key={feat} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">#{idx + 1} {feat}</span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {((importance as number) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${(importance as number) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      ) : (
          <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-2">⚠️ Model Not Trained</h3>
          <p className="text-amber-800 dark:text-amber-200 mb-4">
            The model has not been trained yet. Click the Train Model button above to train it on student data.
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Training typically takes 1-2 minutes and will provide predictions for student completion likelihood.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">📖 How the Model Works</h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Predicts whether students will complete their studies (final grade ≥ median)</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Uses 12 key features: Study Hours, Attendance, Assignment Completion, Discussion Participation, Resource Usage, Stress Level, Internet Access, EdTech Adoption, Online Courses, Engagement, Risk Score, and Consistency</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Trained with Gradient Boosting algorithm on 80% of data, tested on remaining 20%</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Feature Importance shows which inputs most influence the predictions</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Retrain periodically as new student data becomes available</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
