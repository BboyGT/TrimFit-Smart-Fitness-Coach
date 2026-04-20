import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone, Loader2 } from 'lucide-react'
import { socialProviders, GoogleIcon, FacebookIcon, AppleIcon, XTwitterIcon } from '../components/SocialIcons'
import { Button, Input, Divider, ErrorMessage } from '../components/UI'
import useTrimFitStore from '../store/useTrimFitStore'

const providerIcons = {
  google: GoogleIcon,
  facebook: FacebookIcon,
  apple: AppleIcon,
  x: XTwitterIcon,
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, socialLogin } = useTrimFitStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState(null)

  const handleLogin = async () => {
    setError('')
    if (!email.trim() || !password) {
      setError('Please enter your email and password')
      return
    }
    setLoading(true)
    const result = await login(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed. Please try again.')
    }
    setLoading(false)
  }

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider.id)
    setError('')
    const result = await socialLogin(provider.id)
    if (result.success) {
      navigate(result.needsOnboarding ? '/onboarding' : '/dashboard')
    } else {
      setError(result.error || `${provider.name} sign-in failed. Please try again.`)
    }
    setSocialLoading(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 2 4 4"/><path d="m3 7v-1h1"/><path d="m20 17v1h-1"/><path d="m7 3h-1v1"/><path d="m17 20h1v-1"/></svg>
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to continue your fitness journey</p>
        </div>

        <AnimatePresence>
          {error && (
            <ErrorMessage message={error} onDismiss={() => setError('')} />
          )}
        </AnimatePresence>

        <div className="space-y-2.5">
          <p className="text-xs text-gray-500 text-center uppercase tracking-wider font-medium">Continue with</p>
          <div className="grid grid-cols-2 gap-2.5">
            {socialProviders.map((provider) => {
              const IconComponent = providerIcons[provider.id]
              return (
                <button
                  key={provider.id}
                  onClick={() => handleSocialLogin(provider)}
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

        <Divider text="or sign in with email" />

        <div className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            icon={Mail}
          />
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 accent-primary" />
              <span className="text-xs text-gray-400">Remember me</span>
            </label>
            <button onClick={() => navigate('/forgot-password')} className="text-xs text-primary hover:underline font-medium">
              Forgot password?
            </button>
          </div>
        </div>

        <Button onClick={handleLogin} loading={loading} className="w-full">
          Sign In <ArrowRight size={16} />
        </Button>

        <button
          onClick={() => navigate('/phone-auth')}
          className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
        >
          <Smartphone size={16} className="text-gray-400" />
          Sign in with Phone Number
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-primary font-medium hover:underline">
            Create Account
          </button>
        </p>

        <p className="text-center text-[10px] text-gray-600 leading-relaxed">
          By continuing, you agree to our{' '}
          <button onClick={() => navigate('/terms')} className="text-gray-500 underline">Terms of Service</button>
          {' '}and{' '}
          <button onClick={() => navigate('/privacy')} className="text-gray-500 underline">Privacy Policy</button>
        </p>
      </motion.div>
    </div>
  )
}
export default LoginPage