import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, SkipForward, Timer, Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react'
import { exercises, categories } from '../data/exercises'
import useTrimFitStore from '../store/useTrimFitStore'

const REST_TIME = 60 // seconds rest between sets
const SETS_PER_EXERCISE = 3

const WorkoutDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentWorkout, setCurrentWorkout, completeWorkout } = useTrimFitStore()
  const [activeExercise, setActiveExercise] = useState(0)
  const [activeSet, setActiveSet] = useState(0)
  const [completedSets, setCompletedSets] = useState({})
  const [phase, setPhase] = useState('workout') // 'workout' | 'rest'
  const [restTimer, setRestTimer] = useState(REST_TIME)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const videoContainerRef = useRef(null)
  const timerRef = useRef(null)

  if (!currentWorkout) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Dumbbell size={48} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-3">No active workout</p>
          <button onClick={() => navigate('/workout')} className="text-primary hover:underline text-sm">Back to workouts</button>
        </div>
      </div>
    )
  }

  const workoutExercises = currentWorkout.exercises || []
  const currentEx = workoutExercises[activeExercise]
  const exerciseData = currentEx?.exercise || exercises.find(e => e.id === currentEx?.exerciseId)
  const totalSets = workoutExercises.length * SETS_PER_EXERCISE
  const doneSets = Object.keys(completedSets).length
  const progress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0

  // Total workout timer
  useEffect(() => {
    const interval = setInterval(() => setTotalElapsed(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Rest timer countdown
  useEffect(() => {
    if (phase === 'rest' && restTimer > 0) {
      timerRef.current = setTimeout(() => setRestTimer(r => r - 1), 1000)
      return () => clearTimeout(timerRef.current)
    } else if (phase === 'rest' && restTimer <= 0) {
      setPhase('workout')
    }
  }, [phase, restTimer])

  // Scroll video into view when exercise changes
  useEffect(() => {
    if (videoContainerRef.current) {
      videoContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeExercise])

  const handleCompleteSet = () => {
    const key = `${activeExercise}-${activeSet}`
    setCompletedSets(prev => ({ ...prev, [key]: true }))
    const nextSet = activeSet + 1
    if (nextSet >= SETS_PER_EXERCISE) {
      const nextExercise = activeExercise + 1
      if (nextExercise >= workoutExercises.length) {
        handleFinishWorkout()
        return
      }
      setActiveExercise(nextExercise)
      setActiveSet(0)
      setRestTimer(REST_TIME)
      setPhase('rest')
    } else {
      setActiveSet(nextSet)
      setRestTimer(REST_TIME)
      setPhase('rest')
    }
  }

  const handleSkipExercise = () => {
    const next = activeExercise + 1
    if (next < workoutExercises.length) {
      setActiveExercise(next)
      setActiveSet(0)
      setPhase('workout')
    }
  }

  const handlePrevExercise = () => {
    const prev = activeExercise - 1
    if (prev >= 0) {
      setActiveExercise(prev)
      setActiveSet(0)
      setPhase('workout')
    }
  }

  const handleFinishWorkout = () => {
    const completed = { ...currentWorkout, completed: true, totalDuration: totalElapsed }
    completeWorkout(completed)
    navigate('/workout')
  }

  const handleCancel = () => {
    setCurrentWorkout(null)
    navigate('/workout')
  }

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const restProgress = ((REST_TIME - restTimer) / REST_TIME) * 100

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={handleCancel} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate">{currentWorkout.name}</h1>
            <p className="text-xs text-gray-400">
              Exercise {activeExercise + 1}/{workoutExercises.length} · Set {activeSet + 1}/{SETS_PER_EXERCISE}
            </p>
          </div>
          <div className="text-right shrink-0">
            <Timer size={14} className="text-primary mx-auto mb-0.5" />
            <span className="text-sm font-mono font-bold">{formatTime(totalElapsed)}</span>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      {exerciseData && (
        <div className="px-4 mt-3 space-y-3">
          {/* Embedded YouTube Video */}
          {exerciseData.youtubeId && (
            <div ref={videoContainerRef} className="rounded-2xl overflow-hidden border border-white/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={exerciseData.youtubeId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full"
                  style={{ paddingBottom: '56.25%' }}
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${exerciseData.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${exerciseData.youtubeId}&rel=0&modestbranding=1&playsinline=1&controls=1`}
                    title={exerciseData.name}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    frameBorder="0"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Fallback if no video */}
          {!exerciseData.youtubeId && (
            <div className="aspect-video rounded-2xl bg-surface-light border border-white/5 flex items-center justify-center">
              <div className="text-center">
                <Dumbbell size={32} className="text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No video available</p>
                <p className="text-xs text-gray-600 mt-1">Follow the instructions below</p>
              </div>
            </div>
          )}

          {/* Exercise Name & Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${activeExercise}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <h2 className="text-xl font-bold">{exerciseData.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{exerciseData.muscle}</span>
                <span className="text-gray-600">·</span>
                <span className="text-xs text-gray-400">{exerciseData.equipment}</span>
                <span className="text-gray-600">·</span>
                <span className="text-xs text-gray-400 capitalize">{exerciseData.difficulty}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{currentEx?.sets || exerciseData.sets} sets × {currentEx?.reps || exerciseData.reps}</p>
            </motion.div>
          </AnimatePresence>

          {/* Rest Timer Overlay */}
          <AnimatePresence>
            {phase === 'rest' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-5 text-center"
              >
                <p className="text-sm text-blue-300 font-medium mb-1">Rest Between Sets</p>
                <div className="relative w-20 h-20 mx-auto my-2">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${restProgress * 2.64} 264`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold font-mono">{restTimer}</span>
                  </div>
                </div>
                <div className="flex gap-2 justify-center mt-3">
                  <button onClick={() => { setPhase('workout') }} className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-xs font-bold">
                    Skip Rest
                  </button>
                  <button onClick={() => setRestTimer(REST_TIME)} className="px-4 py-2 bg-white/5 rounded-xl text-xs font-medium text-gray-400">
                    Reset Timer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Set Indicators */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: SETS_PER_EXERCISE }, (_, s) => (
              <div
                key={s}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  completedSets[`${activeExercise}-${s}`]
                    ? 'bg-emerald-500/20 text-emerald-400 scale-95'
                    : s === activeSet && phase === 'workout'
                    ? 'bg-primary/20 text-primary ring-2 ring-primary'
                    : 'bg-white/5 text-gray-600'
                }`}
              >
                {completedSets[`${activeExercise}-${s}`] ? <Check size={16} /> : s + 1}
              </div>
            ))}
          </div>

          {/* Exercise Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevExercise}
              disabled={activeExercise === 0}
              className={`p-2.5 rounded-xl ${activeExercise === 0 ? 'bg-white/[0.02] text-gray-700' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="text-xs text-gray-500">Next</p>
              <p className="text-sm font-medium truncate max-w-[140px]">
                {workoutExercises[activeExercise + 1]
                  ? (workoutExercises[activeExercise + 1].exercise || exercises.find(e => e.id === workoutExercises[activeExercise + 1].exerciseId))?.name
                  : 'Final Exercise'
                }
              </p>
            </div>
            <button
              onClick={handleSkipExercise}
              disabled={activeExercise >= workoutExercises.length - 1}
              className={`p-2.5 rounded-xl ${activeExercise >= workoutExercises.length - 1 ? 'bg-white/[0.02] text-gray-700' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Quick Instructions */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3">
            <h3 className="font-bold text-xs text-gray-400 mb-2">How To</h3>
            <div className="space-y-1">
              {exerciseData.instructions.slice(0, 3).map((step, i) => (
                <p key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  {step}
                </p>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1 pb-4">
            {phase === 'workout' && (
              <button
                onClick={handleCompleteSet}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark rounded-xl font-bold text-base active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
              >
                {activeSet < SETS_PER_EXERCISE - 1
                  ? `Complete Set ${activeSet + 1} → Rest`
                  : `Complete Final Set → Next Exercise`
                }
              </button>
            )}
            <div className="flex gap-2">
              <button onClick={handleSkipExercise} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-colors">
                <SkipForward size={14} /> Skip Exercise
              </button>
              <button onClick={handleFinishWorkout} className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                Finish Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkoutDetailPage
