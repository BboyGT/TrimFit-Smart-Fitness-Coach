import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Crown, Star, Gift, ChevronRight, Sparkles, Shield, Zap, ArrowLeft } from 'lucide-react'
import { subscriptionPlans } from '../data/plans'
import { formatCurrency } from '../utils/formatting'
import useTrimFitStore from '../store/useTrimFitStore'

const planIcons = {
  Gift: Gift,
  Star: Star,
  Crown: Crown,
  Diamond: Zap,
}

const SubscriptionPage = () => {
  const navigate = useNavigate()
  const { subscription, setSubscriptionPlan } = useTrimFitStore()
  const [isYearly, setIsYearly] = useState(false)
  const [expandedPlan, setExpandedPlan] = useState(null)

  const currentPlanId = subscription.plan

  const handleSelectPlan = (plan) => {
    if (plan.id === 'free') {
      setSubscriptionPlan('free')
      return
    }
    navigate(`/payment/${plan.id}?interval=${isYearly ? 'year' : 'month'}`)
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Choose Your Plan</h1>
            <p className="text-sm text-gray-400">Unlock your full potential</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-6">
        {/* Current Plan Badge */}
        {currentPlanId !== 'free' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Crown size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Plan</p>
                <p className="font-bold text-emerald-400 capitalize">{currentPlanId}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{subscription.status === 'active' ? 'Active' : subscription.status}</p>
              {subscription.endDate && (
                <p className="text-xs text-gray-500">
                  {new Date(subscription.endDate) > new Date()
                    ? `Renews ${new Date(subscription.endDate).toLocaleDateString()}`
                    : `Expired ${new Date(subscription.endDate).toLocaleDateString()}`}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4"
        >
          <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              isYearly ? 'bg-emerald-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                isYearly ? 'translate-x-7.5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-gray-500'}`}>
            Yearly
          </span>
          {isYearly && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold"
            >
              Save 33%
            </motion.span>
          )}
        </motion.div>

        {/* Plan Cards */}
        <div className="space-y-4">
          {subscriptionPlans.map((plan, index) => {
            const IconComponent = planIcons[plan.icon] || Star
            const isCurrent = plan.id === currentPlanId
            const price = isYearly && plan.yearlyPrice > 0 ? plan.yearlyPrice / 12 : plan.price
            const period = isYearly && plan.yearlyPrice > 0 ? '/mo (billed yearly)' : plan.intervalLabel
            const isExpanded = expandedPlan === plan.id

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                    plan.popular
                      ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/10'
                      : isCurrent
                      ? 'ring-1 ring-emerald-500/50'
                      : 'border border-white/5'
                  } ${isCurrent ? 'bg-emerald-500/5' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
                >
                  {/* Popular Badge */}
                  {plan.badge && (
                    <div className={`absolute top-0 right-0 ${plan.popular ? 'bg-emerald-500' : 'bg-amber-500'} text-white text-xs font-bold px-3 py-1 rounded-bl-xl`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-5">
                    {/* Plan Header */}
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shrink-0`}>
                        <IconComponent size={22} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{plan.name}</h3>
                          {isCurrent && (
                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">{plan.description}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-end gap-1">
                      <span className="text-3xl font-bold">
                        {price === 0 ? 'Free' : formatCurrency(price)}
                      </span>
                      {price > 0 && (
                        <span className="text-gray-400 text-sm mb-1">{period}</span>
                      )}
                    </div>

                    {isYearly && plan.yearlySavings > 0 && (
                      <p className="text-xs text-emerald-400 mt-1">
                        Save {formatCurrency(plan.yearlySavings)}/year
                      </p>
                    )}

                    {/* Trial Badge */}
                    {plan.trialDays && !isCurrent && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                        <Sparkles size={12} />
                        <span>{plan.trialDays}-day free trial included</span>
                      </div>
                    )}

                    {/* Expand/Collapse Features */}
                    <button
                      onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                      className="mt-3 flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <span>{isExpanded ? 'Hide' : 'View'} features</span>
                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {/* Features List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                            {plan.features.map((feature, i) => (
                              <div key={i} className="flex items-start gap-2">
                                {feature.isHeader ? (
                                  <span className="text-xs font-bold text-gray-300">{feature.text}</span>
                                ) : feature.included ? (
                                  <>
                                    <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                                    <span className="text-sm text-gray-300">{feature.text}</span>
                                  </>
                                ) : (
                                  <>
                                    <X size={14} className="text-gray-600 mt-0.5 shrink-0" />
                                    <span className="text-sm text-gray-600 line-through">{feature.text}</span>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent}
                      className={`mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isCurrent
                          ? 'bg-white/5 text-gray-500 cursor-default'
                          : plan.popular
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : plan.id === 'free' ? 'Downgrade to Free' : plan.cta}
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-gray-400 text-center uppercase tracking-wider">
            Trusted & Secure
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <Shield size={20} className="text-emerald-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">SSL Encrypted</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <Zap size={20} className="text-amber-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Instant Access</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <Crown size={20} className="text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Cancel Anytime</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 mb-8">
          <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
          <FAQSection />
        </div>
      </div>
    </div>
  )
}

const FAQSection = () => {
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    {
      q: 'Can I switch plans later?',
      a: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you will get immediate access to all new features. When downgrading, the change takes effect at the end of your current billing period.',
    },
    {
      q: 'What happens after my free trial?',
      a: 'After your free trial ends, you will be automatically charged the subscription price unless you cancel before the trial period ends. You will not be charged if you cancel during the trial.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. You can cancel your subscription at any time from your profile settings. You will continue to have access to premium features until the end of your current billing period. No questions asked.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through Stripe.',
    },
    {
      q: 'Is there a refund policy?',
      a: 'We offer a 30-day money-back guarantee on all paid plans. If you are not satisfied, contact our support team within 30 days of purchase for a full refund.',
    },
    {
      q: 'Do you offer student or military discounts?',
      a: 'Yes! We offer a 20% discount for verified students and active military personnel. Contact support with your verification to receive your discount code.',
    },
  ]

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-sm font-medium">{faq.q}</span>
            <ChevronRight
              size={16}
              className={`text-gray-500 transition-transform duration-200 shrink-0 ml-2 ${openFaq === i ? 'rotate-90' : ''}`}
            />
          </button>
          <AnimatePresence>
            {openFaq === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="px-4 pb-4 text-sm text-gray-400">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default SubscriptionPage
