import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Target, TrendingUp, Crown, ChevronRight, Flame, Dumbbell, Apple } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'
import { formatCurrency, calculateBMI, getBMICategory } from '../utils/formatting'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, streaks, workoutHistory, meals, waterIntake, dailyCalorieGoal } = useTrimFitStore()
  const { subscription, currentPlan, canAccess } = useSubscription()

  const todayWorkouts = workoutHistory.filter(w => {
    const d = new Date(w.completedAt)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  })

  const todayCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0)
  const todayWater = waterIntake
  const bmi = calculateBMI(user.weight, user.height)
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const weekWorkouts = weekDays.map(d => {
    return workoutHistory.filter(w => new Date(w.completedAt).toDateString() === d.toDateString()).length
  })

  const maxCalories = dailyCalorieGoal || 2000

  const quickActions = [
    { label: 'Start Workout', icon: Dumbbell, color: 'from-emerald-500 to-emerald-700', path: '/workout' },
    { label: 'Log Meal', icon: Apple, color: 'from-blue-500 to-blue-700', path: '/nutrition' },
    { label: 'Track Progress', icon: TrendingUp, color: 'from-purple-500 to-purple-700', path: '/progress' },
    { label: 'View Plans', icon: Crown, color: 'from-amber-500 to-amber-700', path: '/subscription' },
  ]

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-gray-400 text-sm"
            >
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold mt-0.5"
            >
              Hey, {user.name || 'Champion'}! 👋
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-lg font-bold"
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </motion.div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Subscription Banner */}
        {subscription.plan === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-amber-500/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Crown size={20} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Upgrade to Pro</p>
              <p className="text-xs text-gray-400">Unlock smart coaching & meal plans</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame size={16} className="text-orange-400" />
              <span className="text-xs text-gray-400">Streak</span>
            </div>
            <p className="text-2xl font-bold">{streaks.current}</p>
            <p className="text-xs text-gray-500">day{streaks.current !== 1 ? 's' : ''} in a row</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-blue-400" />
              <span className="text-xs text-gray-400">Workouts</span>
            </div>
            <p className="text-2xl font-bold">{todayWorkouts.length}</p>
            <p className="text-xs text-gray-500">today</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-amber-400" />
              <span className="text-xs text-gray-400">Calories</span>
            </div>
            <p className="text-2xl font-bold">{todayCalories}</p>
            <p className="text-xs text-gray-500">/ {maxCalories} goal</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-300 text-sm">💧</span>
              <span className="text-xs text-gray-400">Water</span>
            </div>
            <p className="text-2xl font-bold">{todayWater}</p>
            <p className="text-xs text-gray-500">/ 8 glasses</p>
          </motion.div>
        </div>

        {/* BMI Card */}
        {bmi && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">BMI</p>
                <p className="text-xl font-bold">{bmi}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: bmiCategory.color + '20', color: bmiCategory.color }}>
                {bmiCategory.label}
              </span>
            </div>
          </motion.div>
        )}

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
        >
          <h3 className="font-bold mb-3">This Week</h3>
          <div className="flex items-end justify-between gap-2 h-24">
            {weekDays.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: weekWorkouts[i] > 0 ? `${Math.min(weekWorkouts[i] * 30, 100)}%` : '4px',
                      backgroundColor: weekWorkouts[i] > 0 ? '#10b981' : 'rgba(255,255,255,0.05)',
                      minHeight: '4px',
                    }}
                  />
                </div>
                <span className="text-[10px] text-gray-500">
                  {day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-bold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.label}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(action.path)}
                  className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/[0.05] transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Current Plan</h3>
            <button onClick={() => navigate('/subscription')} className="text-xs text-primary hover:underline">Manage</button>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentPlan.gradient} flex items-center justify-center`}>
              <Crown size={18} />
            </div>
            <div>
              <p className="font-medium capitalize">{currentPlan.name}</p>
              <p className="text-xs text-gray-400">
                {currentPlan.price === 0 ? 'Free forever' : formatCurrency(currentPlan.price) + '/month'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
