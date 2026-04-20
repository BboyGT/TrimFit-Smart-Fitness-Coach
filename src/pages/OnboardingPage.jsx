import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, User, Target, Ruler, Sparkles, Check, Activity } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import { Button, Card, Input } from '../components/UI'

const goals = [
  { id: 'lose', label: 'Lose Weight', emoji: '🔥', description: 'Burn fat and get leaner' },
  { id: 'gain', label: 'Build Muscle', emoji: '💪', description: 'Gain strength and size' },
  { id: 'maintain', label: 'Stay Fit', emoji: '⚖️', description: 'Maintain your shape' },
  { id: 'endurance', label: 'Endurance', emoji: '🏃', description: 'Build stamina' },
]

const activityLevels = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { id: 'light', label: 'Light', description: 'Light exercise 1-3 days/week' },
  { id: 'moderate', label: 'Moderate', description: 'Moderate exercise 3-5 days/week' },
  { id: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week' },
]

const difficultyLevels = [
  { id: 'beginner', label: 'Beginner', color: 'emerald' },
  { id: 'intermediate', label: 'Intermediate', color: 'blue' },
  { id: 'advanced', label: 'Advanced', color: 'purple' },
]

const OnboardingPage = () => {
  const navigate = useNavigate()
  const { completeOnboarding, user } = useTrimFitStore()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: user?.name || '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: 'moderate',
    workoutDifficulty: 'intermediate'
  })
  const [error, setError] = useState('')

  const steps = [
    { title: 'What is your name?', subtitle: 'So we can personalize your experience', icon: User },
    { title: 'Tell us about yourself', subtitle: 'Help us understand you better', icon: Sparkles },
    { title: 'Your body metrics', subtitle: 'For accurate fitness recommendations', icon: Ruler },
    { title: 'Choose your goal', subtitle: 'What do you want to achieve?', icon: Target },
  ]

  const handleComplete = () => {
    if (!data.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!data.gender || !data.age) {
      setError('Please fill in all fields')
      return
    }
    if (!data.height || !data.weight) {
      setError('Please enter your height and weight')
      return
    }
    if (!data.goal) {
      setError('Please select a goal')
      return
    }

    completeOnboarding({
      name: data.name,
      gender: data.gender,
      age: parseInt(data.age),
      height: parseFloat(data.height),
      weight: parseFloat(data.weight),
      goal: data.goal,
      activityLevel: data.activityLevel,
      workoutDifficulty: data.workoutDifficulty,
    })
    navigate('/dashboard')
  }

  const canProceed = () => {
    if (step === 0) return data.name.trim().length > 0
    if (step === 1) return data.gender && data.age
    if (step === 2) return data.height && data.weight
    if (step === 3) return data.goal
    return false
  }

  const nextStep = () => {
    setError('')
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    setError('')
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="min-h-screen flex flex-col px-5 py-6">
      <div className="flex gap-2 mb-6">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-primary' : 'bg-white/10'
            }`} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              {step === 0 && <User size={24} className="text-primary" />}
              {step === 1 && <Sparkles size={24} className="text-primary" />}
              {step === 2 && <Ruler size={24} className="text-primary" />}
              {step === 3 && <Target size={24} className="text-primary" />}
            </div>
            <h2 className="text-2xl font-bold mb-1">{steps[step].title}</h2>
            <p className="text-gray-400 text-sm">{steps[step].subtitle}</p>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <Input
                value={data.name}
                onChange={(e) => setData({...data, name: e.target.value})}
                placeholder="Enter your name"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'male', label: 'Male', icon: '♂️' },
                    { id: 'female', label: 'Female', icon: '♀️' }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setData({...data, gender: g.id})}
                      className={`py-4 rounded-xl border text-center transition-all ${
                        data.gender === g.id 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{g.icon}</span>
                      <span className="font-medium text-sm">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Age</label>
                <input 
                  type="number" 
                  value={data.age} 
                  onChange={(e) => setData({...data, age: e.target.value})} 
                  placeholder="Enter your age"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Activity Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {activityLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setData({...data, activityLevel: level.id})}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        data.activityLevel === level.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <p className="text-sm font-medium">{level.label}</p>
                      <p className="text-xs text-gray-500">{level.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Workout Difficulty</label>
                <div className="flex gap-2">
                  {difficultyLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setData({...data, workoutDifficulty: level.id})}
                      className={`flex-1 py-3 rounded-xl border text-center transition-all ${
                        data.workoutDifficulty === level.id
                          ? `border-${level.color}-500 bg-${level.color}-500/10`
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm font-medium">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Height (cm)</label>
                <input 
                  type="number" 
                  value={data.height} 
                  onChange={(e) => setData({...data, height: e.target.value})} 
                  placeholder="175"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-3 block">Weight (kg)</label>
                <input 
                  type="number" 
                  value={data.weight} 
                  onChange={(e) => setData({...data, weight: e.target.value})} 
                  placeholder="70"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-white placeholder-gray-500"
                />
              </div>
              {data.height && data.weight && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3"
                >
                  <Activity size={20} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium">BMI: {((data.weight / ((data.height/100) ** 2)).toFixed(1))}</p>
                    <p className="text-xs text-gray-400">We'll personalize your plan based on this</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {goals.map(g => (
                <motion.button
                  key={g.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setData({...data, goal: g.id})}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    data.goal === g.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl block mb-2">{g.emoji}</span>
                  <p className="font-semibold text-sm">{g.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{g.description}</p>
                </motion.button>
              ))}
            </div>
          )}

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <Button variant="secondary" onClick={prevStep} className="flex-1">
            <ArrowLeft size={18} />
            Back
          </Button>
        )}
        <Button 
          onClick={step < 3 ? nextStep : handleComplete} 
          disabled={!canProceed()} 
          className="flex-1"
        >
          {step < 3 ? (
            <>Next <ArrowRight size={18} /></>
          ) : (
            <>Get Started <Check size={18} /></>
          )}
        </Button>
      </div>
    </div>
  )
}

export default OnboardingPage