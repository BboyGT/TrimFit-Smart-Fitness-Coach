import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'

const StreaksPage = () => {
  const { streaks, workoutHistory } = useTrimFitStore()
  const today = new Date()
  const days = Array.from({ length: 30 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() - (29 - i)); return d })

  // Build a set of date strings that had workouts
  const workoutDates = new Set(
    workoutHistory.map(w => {
      const d = new Date(w.completedAt || w.startTime)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    })
  )

  // Day labels for the calendar header
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <h1 className="text-xl font-bold">Streaks</h1>
        <p className="text-sm text-gray-400">Stay consistent, see results</p>
      </div>
      <div className="px-4 mt-4 space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 text-center"
        >
          <Flame size={48} className="text-orange-400 mx-auto mb-2" />
          <p className="text-4xl font-bold">{streaks.current}</p>
          <p className="text-sm text-gray-400">Day Streak</p>
          <p className="text-xs text-gray-500 mt-1">Longest: {streaks.longest} days</p>
        </motion.div>

        {/* Streak milestones */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { target: 7, label: '1 Week', emoji: '🔥' },
            { target: 14, label: '2 Weeks', emoji: '💪' },
            { target: 30, label: '1 Month', emoji: '⭐' },
            { target: 100, label: '100 Days', emoji: '🏆' },
          ].map(m => {
            const reached = streaks.longest >= m.target
            return (
              <motion.div
                key={m.target}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: m.target * 0.01 }}
                className={`rounded-xl p-3 text-center ${reached ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-white/[0.02] border border-white/5'}`}
              >
                <span className="text-lg block mb-1">{m.emoji}</span>
                <p className="text-[10px] font-medium">{m.label}</p>
                <p className={`text-[9px] ${reached ? 'text-orange-400' : 'text-gray-600'}`}>
                  {reached ? 'Reached!' : `${m.target - streaks.current} to go`}
                </p>
              </motion.div>
            )
          })}
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <h3 className="font-bold mb-3">Last 30 Days</h3>
          {/* Day labels header */}
          <div className="grid grid-cols-7 gap-1.5 mb-1">
            {dayLabels.map(d => (
              <div key={d} className="text-[8px] text-gray-600 text-center">{d}</div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d, i) => {
              const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
              const hasWorkout = workoutDates.has(dateStr)
              const isToday = d.toDateString() === today.toDateString()
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[9px] transition-all ${
                    hasWorkout
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold'
                      : isToday
                      ? 'bg-primary/10 border border-primary/30 text-primary font-bold'
                      : 'bg-white/5 text-gray-600'
                  }`}
                  title={hasWorkout ? 'Workout completed!' : ''}
                >
                  {d.getDate()}
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/40" />
              Workout day
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary/10 border border-primary/30" />
              Today
            </span>
          </div>
        </div>

        {/* Motivational message */}
        {streaks.current > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center"
          >
            <p className="text-sm text-gray-300">
              {streaks.current >= 30
                ? "You're on fire! A full month of consistency. Keep it up!"
                : streaks.current >= 14
                ? 'Two weeks strong! You are building a solid habit.'
                : streaks.current >= 7
                ? 'One week down! You are building momentum.'
                : 'Great start! Keep going to build your streak.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
export default StreaksPage
