import { useTrimFitStore } from '../store/useTrimFitStore'
import { subscriptionPlans, planFeatureGating } from '../data/plans'

const planLevels = { free: 0, basic: 1, pro: 2 }

const useSubscription = () => {
  const subscription = useTrimFitStore((state) => state.subscription)
  const cancelSubscription = useTrimFitStore((state) => state.cancelSubscription)
  const reactivateSubscription = useTrimFitStore((state) => state.reactivateSubscription)
  const updatePaymentMethod = useTrimFitStore((state) => state.updatePaymentMethod)
  const addBillingRecord = useTrimFitStore((state) => state.addBillingRecord)
  const setAutoRenew = useTrimFitStore((state) => state.setAutoRenew)

  const currentPlan = subscriptionPlans.find((p) => p.id === subscription.plan) || subscriptionPlans[0]
  const planLevel = planLevels[subscription.plan] || 0

  const isActive = ['active', 'trialing'].includes(subscription.status)
  const isPremium = planLevel >= 1
  const isProOrHigher = planLevel >= 2

  const canAccess = (feature) => {
    const features = planFeatureGating[subscription.plan]
    if (features && features.includes(feature)) return true
    return false
  }

  const requiresUpgrade = (feature) => {
    if (canAccess(feature)) return false
    if (planFeatureGating.pro?.includes(feature)) return 'pro'
    if (planFeatureGating.basic?.includes(feature)) return 'basic'
    return 'pro'
  }

  const getUpsellPlan = () => {
    if (planLevel === 0) return subscriptionPlans[1]
    if (planLevel === 1) return subscriptionPlans[2]
    return null
  }

  const daysRemaining = () => {
    if (!subscription.endDate) return null
    const end = new Date(subscription.endDate)
    const now = new Date()
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  return {
    subscription,
    currentPlan,
    planLevel,
    isActive,
    isPremium,
    isProOrHigher,
    canAccess,
    requiresUpgrade,
    getUpsellPlan,
    daysRemaining,
    cancelSubscription,
    reactivateSubscription,
    updatePaymentMethod,
    addBillingRecord,
    setAutoRenew,
  }
}

export default useSubscription
