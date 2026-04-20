import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Dumbbell, Sparkles, ArrowRight, Star, Shield, Zap, CheckCircle } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import { Button } from '../components/UI'

const features = [
  { icon: Sparkles, label: 'Smart Coach', description: 'AI-powered workout recommendations' },
  { icon: Zap, label: '205+ Exercises', description: 'Comprehensive exercise library' },
  { icon: Shield, label: 'Track Progress', description: 'Monitor your fitness journey' },
]

const benefits = [
  'Personalized workout plans',
  'Nutrition tracking & meal plans',
  'Progress photos & measurements',
  'Achievements & challenges',
  'Community support',
]

const HomePage = () => {
  const navigate = useNavigate()
  const { onboardingComplete, isLoggedIn } = useTrimFitStore()

  useEffect(() => {
    if (onboardingComplete && isLoggedIn) {
      navigate('/dashboard', { replace: true })
    } else if (isLoggedIn && !onboardingComplete) {
      navigate('/onboarding', { replace: true })
    }
  }, [onboardingComplete, isLoggedIn, navigate])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-sm"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <Dumbbell size={36} className="text-white" />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Trim<span className="text-gradient">Fit</span>
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Your Smart Fitness Coach</p>
          </div>

          <p className="text-gray-500 leading-relaxed">
            205+ exercises, smart workout generation, nutrition tracking, and personalized coaching — all in one app.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <f.icon size={20} className="text-primary mx-auto mb-1" />
                <p className="text-xs text-gray-400">{f.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-left space-y-2 bg-white/[0.02] rounded-xl p-4 border border-white/5">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle size={14} className="text-primary shrink-0" />
                <span className="text-sm text-gray-400">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-6 pb-12 space-y-3"
      >
        <Button onClick={() => navigate('/register')} className="w-full py-4">
          Get Started Free <ArrowRight size={20} />
        </Button>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-3.5 bg-white/5 border border-white/10 rounded-2xl font-medium hover:bg-white/10 transition-colors"
        >
          I already have an account
        </button>
      </motion.div>
    </div>
  )
}

export default HomePage