import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Plus, Clock, Dumbbell, ChevronRight, Zap, Star } from 'lucide-react'
import { workoutPlans } from '../data/exercises'
import { exercises } from '../data/exercises'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'

const WorkoutPage = () => {
  const navigate = useNavigate()
  const { setCurrentWorkout, completeWorkout, user, workoutHistory } = useTrimFitStore()
  const { canAccess, currentPlan } = useSubscription()
  const [activePlan, setActivePlan] = useState(0)

  const handleStartWorkout = (plan) => {
    const planExercises = Array.isArray(plan.exercises)
      ? plan.exercises.map(e => ({ ...e, exercise: exercises.find(ex => ex.id === e.exerciseId) }))
      : Object.entries(plan.exercises).map(([day, exs]) => exs.map(e => ({ ...e, exercise: exercises.find(ex => ex.id === e.exerciseId), day }))).flat()

    const workout = {
      id: Date.now().toString(),
      name: plan.name,
      exercises: planExercises,
      startTime: new Date().toISOString(),
      completed: false,
    }

    setCurrentWorkout(workout)
    navigate(`/workout/${workout.id}`)
  }

  const todayStr = new Date().toDateString()
  const todayWorkouts = workoutHistory.filter(w => new Date(w.completedAt).toDateString() === todayStr)

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <h1 className="text-xl font-bold">Workouts</h1>
        <p className="text-sm text-gray-400">{todayWorkouts.length} workout{todayWorkouts.length !== 1 ? 's' : ''} completed today</p>
      </div>

      <div className="px-4 mt-4 space-y-5">
        {/* Smart Workout Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (canAccess('smartRecommendations')) {
              const random = workoutPlans[Math.floor(Math.random() * workoutPlans.length)]
              handleStartWorkout(random)
            } else {
              navigate('/subscription')
            }
          }}
          className="w-full bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-5 flex items-center gap-4 text-left"
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Smart Workout</h3>
            <p className="text-sm text-white/70">
              {canAccess('smartRecommendations')
                ? 'Smart-generated workout for your level'
                : 'Upgrade to unlock smart generation'}
            </p>
          </div>
          <ChevronRight size={20} />
        </motion.button>

        {/* Plan Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {workoutPlans.map((plan, i) => (
            <button
              key={plan.id}
              onClick={() => setActivePlan(i)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activePlan === i ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>

        {/* Workout Plans */}
        {workoutPlans.map((plan, index) => {
          const exCount = Array.isArray(plan.exercises)
            ? plan.exercises.length
            : Object.values(plan.exercises).flat().length

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{plan.description}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 capitalize shrink-0 ml-2">
                  {plan.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock size={12} />{plan.duration}</span>
                <span className="flex items-center gap-1"><Dumbbell size={12} />{exCount} exercises</span>
                <span>{plan.frequency}</span>
              </div>

              <button
                onClick={() => handleStartWorkout(plan)}
                className="mt-3 w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Play size={14} /> Start Workout
              </button>
            </motion.div>
          )
        })}

        {/* History */}
        {workoutHistory.length > 0 && (
          <div>
            <h3 className="font-bold mb-3">Recent Workouts</h3>
            <div className="space-y-2">
              {workoutHistory.slice(0, 5).map((w) => (
                <div key={w.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Star size={14} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{w.name}</p>
                    <p className="text-xs text-gray-500">{new Date(w.completedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs text-emerald-400">Done</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkoutPage
