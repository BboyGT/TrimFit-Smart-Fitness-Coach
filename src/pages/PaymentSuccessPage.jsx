import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Download, Calendar, CreditCard, Sparkles, Crown, Home } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/formatting'
import useTrimFitStore from '../store/useTrimFitStore'

const PaymentSuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { subscription } = useTrimFitStore()
  const paymentState = location.state

  useEffect(() => {
    if (!paymentState) navigate('/subscription')
  }, [paymentState, navigate])

  if (!paymentState) return null

  const { plan, paymentMethod, amount, billingDate, trialDays, interval } = paymentState

  const confettiColors = ['#10b981', '#34d399', '#f59e0b', '#6366f1', '#ec4899', '#f97316']

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Confetti Effect (CSS-based) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {confettiColors.map((color, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              y: -20,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 800,
              x: `+=${(Math.random() - 0.5) * 200}`,
              rotate: Math.random() * 720,
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 0.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              position: 'absolute',
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="relative"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.4, stiffness: 200 }}
            >
              <CheckCircle size={56} className="text-emerald-400" />
            </motion.div>
          </div>
          {/* Glow */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-2xl font-bold">
            {trialDays > 0 ? 'Welcome to Your Free Trial!' : 'Payment Successful!'}
          </h1>
          <p className="text-gray-400 mt-2">
            {trialDays > 0
              ? `Your ${trialDays}-day ${plan.name} trial has started`
              : `You are now a ${plan.name} member`}
          </p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-left space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                <Crown size={18} />
              </div>
              <div>
                <p className="font-bold">{plan.name} Plan</p>
                <p className="text-xs text-gray-400">{interval === 'year' ? 'Yearly' : 'Monthly'} subscription</p>
              </div>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-medium">
              Active
            </span>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment Method</span>
              <span className="flex items-center gap-1">
                <CreditCard size={12} />
                {paymentMethod.brand}
                {paymentMethod.last4 && ` •••• ${paymentMethod.last4}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Amount Paid</span>
              <span className="font-bold">{amount === 0 ? 'Free Trial' : formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Order ID</span>
              <span className="font-mono text-xs">TF-{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar size={12} />
                Next Billing
              </span>
              <span>{billingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {trialDays > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
              <Sparkles size={16} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-300">
                Your card will be charged <strong>{formatCurrency(interval === 'year' ? plan.yearlyPrice : plan.price)}</strong> on{' '}
                <strong>{billingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
                Cancel anytime before then at no charge.
              </p>
            </div>
          )}
        </motion.div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-left bg-white/[0.03] border border-white/5 rounded-2xl p-5"
        >
          <h3 className="font-bold mb-3">You now have access to:</h3>
          <div className="space-y-2">
            {plan.features
              .filter((f) => f.included && !f.isHeader)
              .slice(0, 5)
              .map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-sm text-gray-300">{feature.text}</span>
                </div>
              ))}
            {plan.features.filter((f) => f.included && !f.isHeader).length > 5 && (
              <p className="text-xs text-gray-500 ml-6">+{plan.features.filter(f => f.included && !f.isHeader).length - 5} more features</p>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="space-y-3 pt-2"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Home size={18} />
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/subscription')}
            className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl font-medium text-sm hover:bg-white/10 transition-colors"
          >
            Manage Subscription
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default PaymentSuccessPage
