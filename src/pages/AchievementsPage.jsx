import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Trophy, Flame, Target, Dumbbell, Star, Crown,
  Lock, Zap, Clock, TrendingUp, Award, ChevronRight
} from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'
import PremiumPaywall from '../components/PremiumPaywall'

const achievementDefs = [
  {
    id: 'first_workout',
    title: 'First Step',
    description: 'Complete your first workout',
    icon: Dumbbell,
    condition: (state) => state.workoutHistory.length >= 1,
    tier: 'free',
    xp: 10,
    gradient: 'from-emerald-500 to-emerald-700',
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: Flame,
    condition: (state) => state.streaks.current >= 7 || state.streaks.longest >= 7,
    tier: 'free',
    xp: 50,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'streak_14',
    title: 'Two Week Titan',
    description: 'Maintain a 14-day workout streak',
    icon: Flame,
    condition: (state) => state.streaks.current >= 14 || state.streaks.longest >= 14,
    tier: 'free',
    xp: 100,
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day workout streak',
    icon: Zap,
    condition: (state) => state.streaks.current >= 30 || state.streaks.longest >= 30,
    tier: 'basic',
    xp: 250,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'streak_100',
    title: 'Century Champion',
    description: 'Maintain a 100-day workout streak',
    icon: Crown,
    condition: (state) => state.streaks.current >= 100 || state.streaks.longest >= 100,
    tier: 'basic',
    xp: 500,
    gradient: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'workouts_10',
    title: 'Getting Serious',
    description: 'Complete 10 workouts',
    icon: Target,
    condition: (state) => state.workoutHistory.length >= 10,
    tier: 'free',
    xp: 30,
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    id: 'workouts_50',
    title: 'Half Century',
    description: 'Complete 50 workouts',
    icon: Target,
    condition: (state) => state.workoutHistory.length >= 50,
    tier: 'basic',
    xp: 200,
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'workouts_100',
    title: 'Centurion',
    description: 'Complete 100 workouts',
    icon: Trophy,
    condition: (state) => state.workoutHistory.length >= 100,
    tier: 'pro',
    xp: 500,
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'measurements_5',
    title: 'Body Aware',
    description: 'Log 5 body measurements',
    icon: TrendingUp,
    condition: (state) => state.measurements.length >= 5,
    tier: 'basic',
    xp: 75,
    gradient: 'from-cyan-500 to-teal-600',
  },
  {
    id: 'meals_20',
    title: 'Nutrition Ninja',
    description: 'Log 20 meals',
    icon: Star,
    condition: (state) => state.meals.length >= 20,
    tier: 'basic',
    xp: 100,
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    id: 'goal_setter',
    title: 'Goal Setter',
    description: 'Set your first fitness goal',
    icon: Target,
    condition: (state) => state.user.goal && state.user.goal.length > 0,
    tier: 'free',
    xp: 15,
    gradient: 'from-teal-500 to-cyan-600',
  },
  {
    id: 'all_rounder',
    title: 'All-Rounder',
    description: 'Log workouts across 5 different categories',
    icon: Award,
    condition: (state) => {
      const categories = new Set(state.workoutHistory.map(w => w.category).filter(Boolean))
      return categories.size >= 5
    },
    tier: 'pro',
    xp: 300,
    gradient: 'from-rose-500 to-pink-600',
  },
]

const AchievementCard = ({ achievement, isUnlocked, isLocked }) => {
  const Icon = achievement.icon
  const tierColors = { free: 'text-gray-400', basic: 'text-blue-400', pro: 'text-amber-400' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white/[0.03] border rounded-2xl p-4 overflow-hidden transition-all ${
        isUnlocked
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : isLocked
          ? 'border-white/5 opacity-50'
          : 'border-white/5'
      }`}
    >
      {/* Unlocked glow */}
      {isUnlocked && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      )}

      <div className="relative z-10 flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center shrink-0 ${
          isUnlocked ? '' : 'grayscale opacity-50'
        }`}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm truncate">{achievement.title}</h4>
            {isUnlocked && (
              <span className="shrink-0 text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                Unlocked
              </span>
            )}
            {isLocked && (
              <Lock size={10} className="shrink-0 text-gray-600" />
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{achievement.description}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] font-bold uppercase ${tierColors[achievement.tier]}`}>
              {achievement.tier}
            </span>
            <span className="text-[10px] text-gray-600">+{achievement.xp} XP</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const AchievementsPage = () => {
  const navigate = useNavigate()
  const state = useTrimFitStore()
  const { canAccess } = useSubscription()
  const [paywallFeature, setPaywallFeature] = useState(null)

  const unlockedIds = new Set(state.achievements.map(a => a.id))

  const checkUnlocked = (def) => {
    try { return def.condition(state) } catch { return false }
  }

  const allAchievements = achievementDefs.map(def => ({
    ...def,
    unlocked: checkUnlocked(def),
  }))

  const unlocked = allAchievements.filter(a => a.unlocked || unlockedIds.has(a.id))
  const locked = allAchievements.filter(a => !a.unlocked && !unlockedIds.has(a.id))

  const unlockedXP = unlocked.reduce((sum, a) => sum + a.xp, 0)
  const totalXP = allAchievements.reduce((sum, a) => sum + a.xp, 0)
  const progressPercent = totalXP > 0 ? Math.round((unlockedXP / totalXP) * 100) : 0

  const tierProgress = {
    free: { total: allAchievements.filter(a => a.tier === 'free').length, unlocked: unlocked.filter(a => a.tier === 'free').length },
    basic: { total: allAchievements.filter(a => a.tier === 'basic').length, unlocked: unlocked.filter(a => a.tier === 'basic').length },
    pro: { total: allAchievements.filter(a => a.tier === 'pro').length, unlocked: unlocked.filter(a => a.tier === 'pro').length },
  }

  const handleAchievementClick = (achievement) => {
    if (achievement.tier === 'basic' && !canAccess('achievements')) {
      setPaywallFeature('achievements')
    } else if (achievement.tier === 'pro' && !canAccess('smartCoaching')) {
      setPaywallFeature('smartCoaching')
    }
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Achievements</h1>
            <p className="text-sm text-gray-400">Track your fitness milestones</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-5">
        {/* XP Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400">Total XP</p>
              <p className="text-2xl font-bold">{unlockedXP}<span className="text-sm text-gray-500 font-normal">/{totalXP}</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Unlocked</p>
              <p className="text-2xl font-bold">{unlocked.length}<span className="text-sm text-gray-500 font-normal">/{allAchievements.length}</span></p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">{progressPercent}% complete</p>

          {/* Tier Progress */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {Object.entries(tierProgress).map(([tier, data]) => (
              <div key={tier} className="text-center p-2 rounded-xl bg-white/[0.02]">
                <p className="text-xs font-bold capitalize text-gray-300">{tier}</p>
                <p className="text-sm font-bold mt-0.5">{data.unlocked}/{data.total}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Unlocked Achievements */}
        {unlocked.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Unlocked ({unlocked.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {unlocked.map((a, i) => (
                <AchievementCard key={a.id} achievement={a} isUnlocked={true} />
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {locked.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Locked ({locked.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {locked.map((a, i) => (
                <div key={a.id} onClick={() => handleAchievementClick(a)}>
                  <AchievementCard achievement={a} isUnlocked={false} isLocked={a.tier !== 'free'} />
                </div>
              ))}
            </div>
          </div>
        )}

        {allAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">No Achievements Yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start working out to unlock achievements!</p>
            <button
              onClick={() => navigate('/workout')}
              className="px-6 py-3 bg-primary rounded-xl text-sm font-medium"
            >
              Start Workout
            </button>
          </div>
        )}
      </div>

      {/* Premium Paywall */}
      {paywallFeature && (
        <PremiumPaywall
          feature={paywallFeature}
          title="Premium Achievement"
          description="Upgrade to unlock premium achievements and track your fitness milestones."
          onClose={() => setPaywallFeature(null)}
        />
      )}
    </div>
  )
}

export default AchievementsPage
