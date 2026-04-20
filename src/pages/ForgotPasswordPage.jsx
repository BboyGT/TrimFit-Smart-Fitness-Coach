import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  if (sent) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 max-w-sm">
        <CheckCircle size={64} className="text-primary mx-auto" />
        <h2 className="text-2xl font-bold">Email Sent!</h2>
        <p className="text-gray-400 text-sm">Check your inbox at {email} for password reset instructions.</p>
        <button onClick={() => navigate('/login')} className="w-full py-3 bg-primary rounded-xl font-bold">Back to Login</button>
      </motion.div>
    </div>
  )
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10"><ArrowLeft size={20} /></button>
        <div className="text-center"><h1 className="text-2xl font-bold">Reset Password</h1><p className="text-gray-400 mt-1 text-sm">Enter your email to receive reset instructions</p></div>
        <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary" /></div>
        <button onClick={() => setSent(true)} className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl font-bold">Send Reset Link</button>
      </motion.div>
    </div>
  )
}
export default ForgotPasswordPage
