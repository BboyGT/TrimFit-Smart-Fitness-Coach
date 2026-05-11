import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, TrendingUp, Target, Calendar, Flame, Award,
  Camera, ChevronRight, Ruler, Dumbbell, Zap, Activity, Crown
} from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'
import { formatCurrency, calculateBMI, getBMICategory, calculateBMR, calculateTDEE } from '../utils/formatting'
import PremiumPaywall from '../components/PremiumPaywall'

const ProgressPage = () => {
  const navigate = useNavigate()
  const { user, workoutHistory, measurements, streaks, meals } = useTrimFitStore()
  const { subscription, currentPlan, canAccess } = useSubscription()
  const [paywallFeature, setPaywallFeature] = useState(null)

  const bmi = calculateBMI(user.weight, user.height)
  const bmiCategory = bmi ? getBMICategory(bmi) : null
  const bmr = calculateBMR(user.weight, user.height, user.age, user.gender)
  const tdee = bmr ? calculateTDEE(bmr, user.activityLevel) : null

  const totalWorkouts = workoutHistory.length
  const totalDuration = workoutHistory.reduce((sum, w) => sum + (w.duration || 0), 0)
  const totalCaloriesBurned = workoutHistory.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0)
  const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0

  // Weekly data
  const now = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const weeklyWorkouts = weekDays.map(d => {
    return workoutHistory.filter(w => new Date(w.completedAt).toDateString() === d.toDateString()).length
  })

  // Monthly data
  const thisMonth = workoutHistory.filter(w => {
    const d = new Date(w.completedAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  // Category breakdown
  const categoryBreakdown = workoutHistory.reduce((acc, w) => {
    const cat = w.category || 'Other'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const measurementHistory = measurements.length > 0 ? measurements.slice(-5).reverse() : []
  const recentWorkouts = workoutHistory.slice(0, 5)

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Progress</h1>
            <p className="text-sm text-gray-400">Your fitness journey at a glance</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-5">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell size={16} className="text-emerald-400" />
              <span className="text-xs text-gray-400">Total Workouts</span>
            </div>
            <p className="text-2xl font-bold">{totalWorkouts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame size={16} className="text-orange-400" />
              <span className="text-xs text-gray-400">Streak</span>
            </div>
            <p className="text-2xl font-bold">{streaks.current}<span className="text-sm text-gray-500 font-normal"> days</span></p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-amber-400" />
              <span className="text-xs text-gray-400">Calories Burned</span>
            </div>
            <p className="text-2xl font-bold">{totalCaloriesBurned > 999 ? `${(totalCaloriesBurned / 1000).toFixed(1)}k` : totalCaloriesBurned}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-blue-400" />
              <span className="text-xs text-gray-400">Avg Duration</span>
            </div>
            <p className="text-2xl font-bold">{avgDuration}<span className="text-sm text-gray-500 font-normal"> min</span></p>
          </motion.div>
        </div>

        {/* BMI & Body Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
        >
          <h3 className="font-bold mb-3">Body Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            {bmi && (
              <div className="bg-white/[0.02] rounded-xl p-3">
                <p className="text-xs text-gray-500">BMI</p>
                <p className="text-xl font-bold">{bmi}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: bmiCategory.color + '20', color: bmiCategory.color }}>
                  {bmiCategory.label}
                </span>
              </div>
            )}
            {bmr && (
              <div className="bg-white/[0.02] rounded-xl p-3">
                <p className="text-xs text-gray-500">BMR</p>
                <p className="text-xl font-bold">{bmr}</p>
                <p className="text-[10px] text-gray-600">cal/day</p>
              </div>
            )}
            {tdee && (
              <div className="bg-white/[0.02] rounded-xl p-3">
                <p className="text-xs text-gray-500">TDEE</p>
                <p className="text-xl font-bold">{tdee}</p>
                <p className="text-[10px] text-gray-600">cal/day</p>
              </div>
            )}
            {user.weight && (
              <div className="bg-white/[0.02] rounded-xl p-3">
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-xl font-bold">{user.weight}</p>
                <p className="text-[10px] text-gray-600">kg</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">This Week</h3>
            <span className="text-xs text-gray-400">{weeklyWorkouts.reduce((a, b) => a + b, 0)} workouts</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {weekDays.map((day, i) => {
              const count = weeklyWorkouts[i]
              const maxCount = Math.max(...weeklyWorkouts, 1)
              const height = count > 0 ? `${(count / maxCount) * 100}%` : '4px'
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  {count > 0 && <span className="text-[10px] text-gray-400">{count}</span>}
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="w-full rounded-t-lg"
                      style={{
                        backgroundColor: count > 0 ? '#10b981' : 'rgba(255,255,255,0.05)',
                        minHeight: '4px',
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Workout Category Breakdown */}
        {sortedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <h3 className="font-bold mb-3">Workout Categories</h3>
            <div className="space-y-2.5">
              {sortedCategories.map(([cat, count]) => {
                const percent = Math.round((count / totalWorkouts) * 100)
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-300 capitalize">{cat}</span>
                      <span className="text-xs text-gray-500">{count} ({percent}%)</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Recent Measurement History */}
        {measurementHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Recent Measurements</h3>
              <button onClick={() => navigate('/measurements')} className="text-xs text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-2">
              {measurementHistory.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <Ruler size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-300 capitalize">{m.part}</span>
                  </div>
                  <span className="text-sm font-medium">{m.value} {m.unit}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Before/After Photos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => {
            if (!canAccess('progressPhotos')) {
              setPaywallFeature('progressPhotos')
            }
          }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">Before & After Photos</p>
                <p className="text-xs text-gray-500">
                  {canAccess('progressPhotos') ? 'Track your visual progress' : 'Pro feature - Upgrade to unlock'}
                </p>
              </div>
            </div>
            {canAccess('progressPhotos') ? (
              <ChevronRight size={16} className="text-gray-600" />
            ) : (
              <Crown size={16} className="text-amber-400" />
            )}
          </div>
        </motion.div>

        {/* Recent Workouts */}
        {recentWorkouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Recent Workouts</h3>
              <button onClick={() => navigate('/workout')} className="text-xs text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-2">
              {recentWorkouts.map((w) => (
                <div key={w.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-b-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Dumbbell size={14} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{w.name || w.title || 'Workout'}</p>
                    <p className="text-[10px] text-gray-500">{new Date(w.completedAt).toLocaleDateString()}</p>
                  </div>
                  {w.duration && <span className="text-xs text-gray-400">{w.duration} min</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Premium Upsell */}
        {subscription.plan === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
          >
            <Crown size={20} className="text-amber-400" />
            <div className="flex-1">
              <p className="text-sm font-bold">Get Advanced Analytics</p>
              <p className="text-xs text-gray-400">Upgrade to Pro for detailed insights & body composition analysis</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </motion.div>
        )}
      </div>

      {paywallFeature && (
        <PremiumPaywall
          feature={paywallFeature}
          title="Premium Progress Tracking"
          description="Unlock before & after photos, body composition analysis, and advanced progress insights."
          onClose={() => setPaywallFeature(null)}
        />
      )}
    </div>
  )
}

export default ProgressPage
