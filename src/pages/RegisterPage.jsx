import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Smartphone, Loader2, CheckCircle } from 'lucide-react'
import { socialProviders, GoogleIcon, FacebookIcon, AppleIcon, XTwitterIcon } from '../components/SocialIcons'
import { Button, Input, Divider, ErrorMessage } from '../components/UI'
import useTrimFitStore from '../store/useTrimFitStore'

const providerIcons = {
  google: GoogleIcon,
  facebook: FacebookIcon,
  apple: AppleIcon,
  x: XTwitterIcon,
}

const passwordRules = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
]

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, socialRegister } = useTrimFitStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', agreeTerms: false })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState(null)

  const pwStrength = passwordRules.filter((r) => r.test(form.password)).length
  const pwColor = pwStrength <= 1 ? 'bg-red-500' : pwStrength <= 2 ? 'bg-orange-500' : pwStrength <= 3 ? 'bg-yellow-500' : 'bg-emerald-500'
  const pwLabel = pwStrength <= 1 ? 'Weak' : pwStrength <= 2 ? 'Fair' : pwStrength <= 3 ? 'Good' : 'Strong'

  const handleRegister = async () => {
    setError('')
    if (!form.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!form.email.trim()) {
      setError('Please enter your email')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (pwStrength < 3) {
      setError('Password is too weak. Add uppercase, lowercase, and numbers.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!form.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }

    setLoading(true)
    const result = await register(form)
    if (result.success) {
      navigate('/onboarding')
    } else {
      setError(result.error || 'Registration failed. Please try again.')
    }
    setLoading(false)
  }

  const handleSocialRegister = async (provider) => {
    setSocialLoading(provider.id)
    setError('')
    const result = await socialRegister(provider.id)
    if (result.success) {
      navigate('/onboarding')
    } else {
      setError(result.error || `${provider.name} sign-up failed. Please try again.`)
    }
    setSocialLoading(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-5"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-400 text-sm">Start your smart fitness journey today</p>
        </div>

        <AnimatePresence>
          {error && (
            <ErrorMessage message={error} onDismiss={() => setError('')} />
          )}
        </AnimatePresence>

        <div className="space-y-2.5">
          <p className="text-xs text-gray-500 text-center uppercase tracking-wider font-medium">Sign up quickly with</p>
          <div className="grid grid-cols-2 gap-2.5">
            {socialProviders.map((provider) => {
              const IconComponent = providerIcons[provider.id]
              return (
                <button
                  key={provider.id}
                  onClick={() => handleSocialRegister(provider)}
                  disabled={socialLoading !== null}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {socialLoading === provider.id ? (
                    <Loader2 size={18} className="animate-spin text-primary" />
                  ) : (
                    <IconComponent />
                  )}
                  <span className="text-sm font-medium">{provider.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <Divider text="or sign up with email" />

        <div className="space-y-3">
          <Input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            icon={User}
          />
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email address"
            icon={Mail}
          />
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create password"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {form.password.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-1 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= pwStrength ? pwColor : 'bg-white/10'}`} />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-400">{pwLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {passwordRules.map((rule) => (
                  <div key={rule.label} className="flex items-center gap-1.5">
                    <CheckCircle size={12} className={rule.test(form.password) ? 'text-emerald-400' : 'text-white/10'} />
                    <span className={`text-[10px] ${rule.test(form.password) ? 'text-emerald-400' : 'text-gray-600'}`}>{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Confirm password"
            icon={Lock}
          />
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.agreeTerms}
            onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary mt-0.5"
          />
          <span className="text-xs text-gray-400 leading-relaxed">
            I agree to the{' '}
            <button type="button" onClick={() => navigate('/terms')} className="text-primary underline">Terms of Service</button>
            {' '}and{' '}
            <button type="button" onClick={() => navigate('/privacy')} className="text-primary underline">Privacy Policy</button>
          </span>
        </label>

        <Button onClick={handleRegister} loading={loading} className="w-full">
          Create Account <ArrowRight size={16} />
        </Button>

        <button
          onClick={() => navigate('/phone-auth')}
          className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
        >
          <Smartphone size={16} className="text-gray-400" />
          Sign up with Phone Number
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary font-medium hover:underline">
            Sign In
          </button>
        </p>
      </motion.div>
    </div>
  )
}
export default RegisterPage