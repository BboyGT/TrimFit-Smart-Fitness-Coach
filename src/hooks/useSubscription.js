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
    const allowedPlans = planFeatureGating.free
    for (let i = planLevel; i >= 0; i--) {
      const planId = Object.keys(planLevels).find((k) => planLevels[k] === i)
      const features = planFeatureGating[planId]
      if (features && features.includes(feature)) return true
    }
    return false
  }

  const getUpsellPlan = () => {
    if (planLevel === 0) return subscriptionPlans[1]
    if (planLevel === 1) return subscriptionPlans[2]
    return null
  }

  return {
    subscription,
    currentPlan,
    planLevel,
    isActive,
    isPremium,
    isProOrHigher,
    canAccess,
    getUpsellPlan,
    cancelSubscription,
    reactivateSubscription,
    updatePaymentMethod,
    addBillingRecord,
    setAutoRenew,
  }
}

export default useSubscription
