import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Award, Camera } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'
import { formatDate, calculateBMI, getBMICategory } from '../utils/formatting'

const ProgressPage = () => {
  const navigate = useNavigate()
  const { user, workoutHistory, measurements, achievements } = useTrimFitStore()
  const { canAccess, currentPlan } = useSubscription()
  const bmi = calculateBMI(user.weight, user.height)
  const bmiCat = bmi ? getBMICategory(bmi) : null
  const totalWorkouts = workoutHistory.length
  const thisWeek = workoutHistory.filter(w => new Date(w.completedAt) > new Date(Date.now() - 7 * 86400000)).length
  const totalCals = workoutHistory.reduce((s, w) => s + (w.calories || 0), 0)

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <h1 className="text-xl font-bold">Progress</h1>
        <p className="text-sm text-gray-400">Track your transformation</p>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Total Workouts', value: totalWorkouts, icon: '🏋️' },
            { label: 'This Week', value: thisWeek, icon: '📅' },
            { label: 'Achievements', value: achievements.length, icon: '🏆' },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
              <span className="text-xl block mb-1">{s.icon}</span>
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[10px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {bmi && (
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div><p className="text-xs text-gray-400">Current BMI</p><p className="text-xl font-bold">{bmi}</p></div>
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: bmiCat.color + '20', color: bmiCat.color }}>{bmiCat.label}</span>
          </div>
        )}

        {/* Before/After Photos */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <h3 className="font-bold mb-2 flex items-center gap-2"><Camera size={16} /> Before & After Photos</h3>
          {canAccess('progressPhotos') ? (
            <p className="text-sm text-gray-400">Take monthly comparison photos to see your transformation.</p>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">Available on Pro plan</p>
              <button onClick={() => navigate('/subscription')} className="mt-2 text-xs text-primary hover:underline">Upgrade to Pro</button>
            </div>
          )}
        </div>

        {/* Recent Workouts */}
        {workoutHistory.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">Recent Activity</h3>
            <div className="space-y-2">
              {workoutHistory.slice(0, 5).map(w => (
                <div key={w.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <div><p className="text-sm font-medium">{w.name}</p><p className="text-xs text-gray-500">{formatDate(w.completedAt)}</p></div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Done</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default ProgressPage
