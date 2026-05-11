import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Lock, X, ChevronRight, Sparkles, Star } from 'lucide-react'
import useSubscription from '../hooks/useSubscription'

const planColors = {
  basic: { gradient: 'from-blue-500 to-blue-700', text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  pro: { gradient: 'from-emerald-500 to-emerald-700', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
}

const PremiumPaywall = memo(({ feature, title, description, onClose }) => {
  const navigate = useNavigate()
  const { requiresUpgrade, getUpsellPlan } = useSubscription()

  const requiredPlan = requiresUpgrade(feature)
  const upsellPlan = getUpsellPlan()
  const colors = planColors[requiredPlan] || planColors.pro

  const handleUpgrade = () => {
    if (onClose) onClose()
    navigate('/subscription')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-full max-w-sm bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] border border-white/10 rounded-3xl overflow-hidden"
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}

        {/* Header */}
        <div className="relative pt-8 pb-6 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}
            >
              <Crown size={28} className="text-white" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">{title || 'Premium Feature'}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {description || 'Unlock this feature and more with a premium subscription.'}
            </p>
          </div>
        </div>

        {/* Required Plan Info */}
        <div className="px-6">
          <div className={`${colors.bg} ${colors.border} border rounded-2xl p-4 mb-4`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                {requiredPlan === 'pro' ? <Sparkles size={18} /> : <Star size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold capitalize">{requiredPlan} Plan Required</p>
                {upsellPlan && (
                  <p className="text-xs text-gray-400">
                    Starting at {upsellPlan.price === 0 ? 'Free' : `$${upsellPlan.price}/month`}
                    {upsellPlan.trialDays && ` · ${upsellPlan.trialDays}-day free trial`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Features preview */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Includes:</p>
            {upsellPlan?.features?.filter(f => f.included && !f.isHeader).slice(0, 4).map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-2"
              >
                <div className={`w-4 h-4 rounded-full ${colors.bg} flex items-center justify-center`}>
                  <Sparkles size={10} className={colors.text} />
                </div>
                <span className="text-sm text-gray-300">{feat.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleUpgrade}
              className={`w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r ${colors.gradient} text-white shadow-lg flex items-center justify-center gap-2`}
            >
              <Lock size={16} />
              Upgrade to {requiredPlan === 'pro' ? 'Pro' : 'Basic'}
              <ChevronRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 mt-2 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-500">
            30-day money-back guarantee · Cancel anytime
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
})

PremiumPaywall.displayName = 'PremiumPaywall'
export default PremiumPaywall
