import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, Sparkles, Dumbbell, UtensilsCrossed, TrendingUp, Crown } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'

const tourSteps = [
  {
    title: 'Welcome to TrimFit!',
    description: 'Your smart fitness companion for personalized workouts, nutrition tracking, and real results. Let us show you around!',
    icon: Sparkles,
    target: 'center',
  },
  {
    title: 'Your Dashboard',
    description: 'Track your daily progress, view workout stats, calorie intake, and stay on top of your fitness goals all in one place.',
    icon: TrendingUp,
    target: 'dashboard',
  },
  {
    title: 'Smart Workouts',
    description: 'Access 205+ exercises, smart workout generation, and follow-along videos. Your plan adapts to your level and goals.',
    icon: Dumbbell,
    target: 'workout',
  },
  {
    title: 'Nutrition Tracking',
    description: 'Log meals, track macros and calories, get personalized meal plans. Smart coaching helps you eat right for your goals.',
    icon: UtensilsCrossed,
    target: 'nutrition',
  },
  {
    title: 'Track Progress',
    description: 'See your transformation with progress charts, body measurements, before & after photos, and achievement badges.',
    icon: TrendingUp,
    target: 'progress',
  },
  {
    title: 'Go Premium',
    description: 'Unlock smart coaching, meal plans, advanced analytics, and more. Start with a free trial today!',
    icon: Crown,
    target: 'premium',
  },
]

const AppTour = () => {
  const { showTour, tourStep, setShowTour, setTourStep } = useTrimFitStore()
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const seen = localStorage.getItem('trimfit-tour-seen')
    if (!seen && !showTour) {
      const timer = setTimeout(() => setShowTour(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setDirection(1)
      setTourStep(tourStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (tourStep > 0) {
      setDirection(-1)
      setTourStep(tourStep - 1)
    }
  }

  const handleClose = () => {
    localStorage.setItem('trimfit-tour-seen', 'true')
    setShowTour(false)
    setTourStep(0)
  }

  if (!showTour) return null

  const current = tourSteps[tourStep]
  const Icon = current.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Content */}
        <motion.div
          key={tourStep}
          initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -direction * 50, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-surface rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10"
        >
          {/* Skip */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Icon size={30} className="text-primary" />
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-center mb-2">{current.title}</h3>
          <p className="text-gray-400 text-sm text-center leading-relaxed mb-6">{current.description}</p>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === tourStep ? 'w-6 bg-primary' : i < tourStep ? 'w-3 bg-primary/40' : 'w-3 bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {tourStep > 0 ? (
              <button
                onClick={handlePrev}
                className="flex-1 py-3 rounded-xl bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Back
              </button>
            ) : (
              <div className="flex-1" />
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-sm font-bold flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
            >
              {tourStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
              {tourStep < tourSteps.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AppTour
