import { motion } from 'framer-motion'
import { Award, Lock, Star, Flame, Target, Trophy, Zap } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'

const badges = [
  { id: 'first_workout', name: 'First Step', desc: 'Complete your first workout', icon: '🏃', condition: (h) => h.length >= 1 },
  { id: 'five_workouts', name: 'Getting Serious', desc: 'Complete 5 workouts', icon: '💪', condition: (h) => h.length >= 5 },
  { id: 'ten_workouts', name: 'Dedicated', desc: 'Complete 10 workouts', icon: '🏋️', condition: (h) => h.length >= 10 },
  { id: 'week_streak', name: 'On Fire', desc: '7-day workout streak', icon: '🔥', condition: (s) => s.current >= 7 },
  { id: 'month_streak', name: 'Unstoppable', desc: '30-day workout streak', icon: '⚡', condition: (s) => s.current >= 30 },
]

const AchievementsPage = () => {
  const { workoutHistory, achievements, streaks } = useTrimFitStore()
  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4"><h1 className="text-xl font-bold">Achievements</h1><p className="text-sm text-gray-400">{achievements.length} of {badges.length} unlocked</p></div>
      <div className="px-4 mt-4 space-y-3">
        {badges.map((badge, i) => {
          const unlocked = badge.condition(workoutHistory) || badge.condition(streaks)
          return (
            <motion.div key={badge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`border rounded-2xl p-4 flex items-center gap-3 ${unlocked ? 'bg-white/[0.03] border-white/10' : 'bg-white/[0.01] border-white/5 opacity-50'}`}>
              <span className="text-3xl">{badge.icon}</span>
              <div className="flex-1"><p className="font-bold text-sm">{badge.name}</p><p className="text-xs text-gray-400">{badge.desc}</p></div>
              {unlocked ? <Star size={16} className="text-amber-400" /> : <Lock size={16} className="text-gray-600" />}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
export default AchievementsPage
