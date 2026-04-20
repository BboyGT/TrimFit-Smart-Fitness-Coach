import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CreditCard, Wallet, Smartphone, Globe, Building, Lock,
  Shield, ChevronDown, Check, AlertCircle, Eye, EyeOff, Info,
  Calendar, Receipt, Sparkles, ChevronRight, Loader2
} from 'lucide-react'
import { subscriptionPlans, paymentMethods } from '../data/plans'
import { formatCurrency } from '../utils/formatting'
import useTrimFitStore from '../store/useTrimFitStore'

const PaymentPage = () => {
  const navigate = useNavigate()
  const { planId } = useParams()
  const [searchParams] = useSearchParams()
  const interval = searchParams.get('interval') || 'month'
  const { subscription, setSubscriptionPlan, updatePaymentMethod, addBillingRecord } = useTrimFitStore()

  const [selectedMethod, setSelectedMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1) // 1 = method select, 2 = payment form, 3 = confirm
  const [showCardForm, setShowCardForm] = useState(false)

  // Form state
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    zip: '',
  })
  const [showCvc, setShowCvc] = useState(false)
  const [cardErrors, setCardErrors] = useState({})
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [enableAutoRenew, setEnableAutoRenew] = useState(true)

  // PayPal state
  const [paypalEmail, setPaypalEmail] = useState('')
  const [paypalPassword, setPaypalPassword] = useState('')

  // Bank transfer state
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')

  const plan = subscriptionPlans.find((p) => p.id === planId)
  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Plan Not Found</h2>
          <button onClick={() => navigate('/subscription')} className="text-primary hover:underline">
            Back to Plans
          </button>
        </div>
      </div>
    )
  }

  const isYearly = interval === 'year'
  const price = isYearly && plan.yearlyPrice > 0 ? plan.yearlyPrice : plan.price
  const monthlyPrice = isYearly && plan.yearlyPrice > 0 ? (plan.yearlyPrice / 12).toFixed(2) : plan.price
  const trialDays = plan.trialDays || 0
  const totalToday = trialDays > 0 ? 0 : price
  const billingDate = trialDays > 0
    ? new Date(Date.now() + trialDays * 86400000)
    : new Date(Date.now() + (isYearly ? 365 : 30) * 86400000)

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16)
    return v.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 4)
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2)
    return v
  }

  const detectCardType = (number) => {
    const n = number.replace(/\s/g, '')
    if (/^4/.test(n)) return { brand: 'Visa', color: '#1a1f71' }
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return { brand: 'Mastercard', color: '#eb001b' }
    if (/^3[47]/.test(n)) return { brand: 'Amex', color: '#006fcf' }
    if (/^6(?:011|5)/.test(n)) return { brand: 'Discover', color: '#ff6000' }
    return null
  }

  const validateCardForm = () => {
    const errors = {}
    const num = cardData.number.replace(/\s/g, '')
    if (num.length < 15) errors.number = 'Invalid card number'
    if (!cardData.name.trim()) errors.name = 'Name is required'
    if (cardData.expiry.length < 5) errors.expiry = 'MM/YY required'
    else {
      const [mm] = cardData.expiry.split('/')
      if (parseInt(mm) < 1 || parseInt(mm) > 12) errors.expiry = 'Invalid month'
    }
    if (cardData.cvc.length < 3) errors.cvc = 'CVC required'
    if (!cardData.zip.trim()) errors.zip = 'ZIP code required'
    setCardErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePaypal = () => {
    return paypalEmail.includes('@') && paypalPassword.length >= 6
  }

  const validateBank = () => {
    return bankName.trim() && accountNumber.length >= 8 && routingNumber.length >= 9
  }

  const handlePayment = async () => {
    if (!agreeTerms) return

    setIsProcessing(true)

    // Simulate payment processing (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update store
    const payMethod = paymentMethods.find((m) => m.id === selectedMethod)
    const last4 = selectedMethod === 'card'
      ? cardData.number.replace(/\s/g, '').slice(-4)
      : null

    const paymentMethodInfo = {
      type: selectedMethod,
      name: payMethod.name,
      last4: last4,
      brand: selectedMethod === 'card' ? (detectCardType(cardData.number)?.brand || 'Card') : payMethod.name,
      icon: payMethod.icon,
    }

    updatePaymentMethod(paymentMethodInfo)

    const billingRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: totalToday,
      currency: 'USD',
      status: 'succeeded',
      plan: plan.name,
      interval,
      method: payMethod.name,
      last4,
      invoiceUrl: '#',
    }

    addBillingRecord(billingRecord)
    setSubscriptionPlan(planId, interval)

    setIsProcessing(false)
    navigate('/payment-success', {
      state: {
        plan,
        paymentMethod: paymentMethodInfo,
        amount: totalToday,
        billingDate,
        trialDays,
        interval,
        recordId: billingRecord.id,
      },
    })
  }

  const canProceed = () => {
    if (!agreeTerms) return false
    if (selectedMethod === 'card') return validateCardForm() === true || Object.keys(cardErrors).length === 0
    if (selectedMethod === 'paypal') return validatePaypal()
    if (selectedMethod === 'bank_transfer') return validateBank()
    if (selectedMethod === 'apple_pay' || selectedMethod === 'google_pay') return true
    return false
  }

  const methodIcons = { CreditCard, Wallet, Smartphone, Chrome, Building }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/subscription')} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Checkout</h1>
            <p className="text-sm text-gray-400">
              {step === 1 && 'Select payment method'}
              {step === 2 && 'Payment details'}
              {step === 3 && 'Confirm & pay'}
            </p>
          </div>
          {/* Progress */}
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-8 h-1.5 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-5">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Order Summary</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
              {plan.id === 'pro' ? <Sparkles size={20} /> : <Check size={20} />}
            </div>
            <div>
              <h4 className="font-bold">{plan.name} Plan</h4>
              <p className="text-sm text-gray-400">{isYearly ? 'Yearly subscription' : 'Monthly subscription'}</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Plan price</span>
              <span>{formatCurrency(price)}</span>
            </div>
            {isYearly && plan.yearlySavings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Yearly discount</span>
                <span className="text-emerald-400">-{formatCurrency(plan.yearlySavings)}</span>
              </div>
            )}
            {trialDays > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Free trial ({trialDays} days)</span>
                <span className="text-emerald-400">-{formatCurrency(price)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Due today</span>
              <span className="font-bold text-lg">{formatCurrency(totalToday)}</span>
            </div>
            {trialDays > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                After {trialDays}-day free trial, {formatCurrency(price)} will be charged on{' '}
                {billingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
        </motion.div>

        {/* Step 1: Payment Method Selection */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold">Select Payment Method</h3>

              {/* Express Checkout */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Express Checkout</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setSelectedMethod('apple_pay'); setStep(3) }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      selectedMethod === 'apple_pay'
                        ? 'border-primary bg-primary/5'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Pay</span>
                    </div>
                    <span className="font-medium text-sm">Apple Pay</span>
                  </button>
                  <button
                    onClick={() => { setSelectedMethod('google_pay'); setStep(3) }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      selectedMethod === 'google_pay'
                        ? 'border-primary bg-primary/5'
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <Globe size={18} className="text-[#4285f4]" />
                    </div>
                    <span className="font-medium text-sm">Google Pay</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500">or pay with</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Full Payment Methods */}
              <div className="space-y-2">
                {paymentMethods
                  .filter((m) => !['apple_pay', 'google_pay'].includes(m.id))
                  .map((method) => {
                    const Icon = methodIcons[method.icon] || CreditCard
                    return (
                      <button
                        key={method.id}
                        onClick={() => { setSelectedMethod(method.id); setStep(2) }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          selectedMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <Icon size={20} className="text-gray-300" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-gray-500">{method.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {method.brands.slice(0, 3).map((brand) => (
                            <span
                              key={brand.name}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400"
                            >
                              {brand.name}
                            </span>
                          ))}
                        </div>
                        <ChevronRight size={16} className="text-gray-600" />
                      </button>
                    )
                  })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold">Payment Details</h3>

              {/* Credit/Debit Card Form */}
              {selectedMethod === 'card' && (
                <div className="space-y-3">
                  {/* Card Preview */}
                  <div className="relative h-48 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] rounded-2xl p-5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">Credit / Debit Card</span>
                        {detectCardType(cardData.number) && (
                          <span className="text-sm font-bold" style={{ color: detectCardType(cardData.number).color }}>
                            {detectCardType(cardData.number).brand}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-lg tracking-[0.25em] font-mono mb-4">
                          {cardData.number || '0000 0000 0000 0000'}
                        </p>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Card Holder</p>
                            <p className="text-sm">{cardData.name || 'YOUR NAME'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase">Expires</p>
                            <p className="text-sm">{cardData.expiry || 'MM/YY'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => {
                          setCardData({ ...cardData, number: formatCardNumber(e.target.value) })
                          if (cardErrors.number) setCardErrors({ ...cardErrors, number: '' })
                        }}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full bg-white/5 border ${cardErrors.number ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors`}
                        maxLength={19}
                      />
                      <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    {cardErrors.number && <p className="text-xs text-red-400 mt-1">{cardErrors.number}</p>}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => {
                        setCardData({ ...cardData, name: e.target.value.toUpperCase() })
                        if (cardErrors.name) setCardErrors({ ...cardErrors, name: '' })
                      }}
                      placeholder="JOHN DOE"
                      className={`w-full bg-white/5 border ${cardErrors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors`}
                    />
                    {cardErrors.name && <p className="text-xs text-red-400 mt-1">{cardErrors.name}</p>}
                  </div>

                  {/* Expiry, CVC, ZIP */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Expiry</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => {
                          setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })
                          if (cardErrors.expiry) setCardErrors({ ...cardErrors, expiry: '' })
                        }}
                        placeholder="MM/YY"
                        className={`w-full bg-white/5 border ${cardErrors.expiry ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors`}
                        maxLength={5}
                      />
                      {cardErrors.expiry && <p className="text-xs text-red-400 mt-1">{cardErrors.expiry}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">CVC</label>
                      <div className="relative">
                        <input
                          type={showCvc ? 'text' : 'password'}
                          value={cardData.cvc}
                          onChange={(e) => {
                            setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })
                            if (cardErrors.cvc) setCardErrors({ ...cardErrors, cvc: '' })
                          }}
                          placeholder="123"
                          className={`w-full bg-white/5 border ${cardErrors.cvc ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-primary transition-colors`}
                          maxLength={4}
                        />
                        <button
                          onClick={() => setShowCvc(!showCvc)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showCvc ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {cardErrors.cvc && <p className="text-xs text-red-400 mt-1">{cardErrors.cvc}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">ZIP</label>
                      <input
                        type="text"
                        value={cardData.zip}
                        onChange={(e) => {
                          setCardData({ ...cardData, zip: e.target.value.replace(/\D/g, '').slice(0, 5) })
                          if (cardErrors.zip) setCardErrors({ ...cardErrors, zip: '' })
                        }}
                        placeholder="10001"
                        className={`w-full bg-white/5 border ${cardErrors.zip ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors`}
                        maxLength={5}
                      />
                      {cardErrors.zip && <p className="text-xs text-red-400 mt-1">{cardErrors.zip}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Form */}
              {selectedMethod === 'paypal' && (
                <div className="space-y-3">
                  <div className="bg-[#003087]/10 border border-[#003087]/20 rounded-xl p-4 text-center">
                    <span className="text-2xl font-bold text-[#003087]">Pay</span>
                    <span className="text-2xl font-bold text-[#009cde] ml-1">Pal</span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">PayPal Email</label>
                    <input
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Password</label>
                    <input
                      type="password"
                      value={paypalPassword}
                      onChange={(e) => setPaypalPassword(e.target.value)}
                      placeholder="PayPal password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">You will be redirected to PayPal to confirm</p>
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              {selectedMethod === 'bank_transfer' && (
                <div className="space-y-3">
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                    <p className="text-sm text-gray-300">
                      Bank transfers take 2-3 business days to process. Your premium access will be activated once payment is confirmed.
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="First National Bank"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234567890"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Routing Number</label>
                    <input
                      type="text"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="021000021"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-sm">
                    <p className="text-gray-400 font-medium mb-2">Transfer Details:</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p><span className="text-gray-400">Beneficiary:</span> TrimFit Inc.</p>
                      <p><span className="text-gray-400">Bank:</span> Silicon Valley Bank</p>
                      <p><span className="text-gray-400">Routing:</span> 121000248</p>
                      <p><span className="text-gray-400">Account:</span> 4532-XXXX-7891</p>
                      <p><span className="text-gray-400">Reference:</span> TF-{planId.toUpperCase()}-{Date.now().toString().slice(-6)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={() => {
                  if (selectedMethod === 'card') validateCardForm()
                  if (canProceed()) setStep(3)
                }}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark rounded-xl font-semibold text-sm"
              >
                Continue to Review
              </button>
            </motion.div>
          )}

          {/* Step 3: Confirm & Pay */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold">Review & Pay</h3>

              {/* Selected Method */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Payment Method</p>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = methodIcons[paymentMethods.find(m => m.id === selectedMethod)?.icon] || CreditCard
                    return <Icon size={20} className="text-primary" />
                  })()}
                  <div>
                    <p className="font-medium text-sm">
                      {paymentMethods.find(m => m.id === selectedMethod)?.name}
                    </p>
                    {selectedMethod === 'card' && cardData.number && (
                      <p className="text-xs text-gray-500">
                        •••• {cardData.number.replace(/\s/g, '').slice(-4)} ({detectCardType(cardData.number)?.brand})
                      </p>
                    )}
                    {selectedMethod === 'paypal' && paypalEmail && (
                      <p className="text-xs text-gray-500">{paypalEmail}</p>
                    )}
                    {selectedMethod === 'bank_transfer' && bankName && (
                      <p className="text-xs text-gray-500">{bankName} •••{accountNumber.slice(-4)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="ml-auto text-xs text-primary hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Auto-Renew Toggle */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Auto-Renew</p>
                    <p className="text-xs text-gray-500">
                      Automatically renew at {formatCurrency(isYearly ? plan.yearlyPrice : plan.price)}/{isYearly ? 'year' : 'month'}
                    </p>
                  </div>
                  <button
                    onClick={() => setEnableAutoRenew(!enableAutoRenew)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${enableAutoRenew ? 'bg-primary' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${enableAutoRenew ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Coupon Code */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Coupon Code (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                  />
                  <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{plan.name} Plan ({isYearly ? 'Yearly' : 'Monthly'})</span>
                  <span>{formatCurrency(price)}</span>
                </div>
                {isYearly && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Effective monthly</span>
                    <span className="text-emerald-400">{formatCurrency(monthlyPrice)}/mo</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-gray-400">Calculated at checkout</span>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between">
                  <span className="font-bold">Total Due Today</span>
                  <span className="font-bold text-lg">{formatCurrency(totalToday)}</span>
                </div>
                {totalToday === 0 && (
                  <p className="text-xs text-emerald-400 text-center">
                    You will not be charged during your free trial
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-gray-400">
                    I agree to the{' '}
                    <button onClick={() => navigate('/terms')} className="text-primary hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button onClick={() => navigate('/privacy')} className="text-primary hover:underline">Privacy Policy</button>.
                    I understand that {enableAutoRenew ? 'my subscription will auto-renew' : 'my subscription will not auto-renew'}
                    {totalToday === 0 && ' and I will be charged after the free trial ends'}.
                  </span>
                </label>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={!agreeTerms || isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                  agreeTerms && !isProcessing
                    ? 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : totalToday === 0 ? (
                  <>
                    <Sparkles size={20} />
                    Start Free Trial
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Pay {formatCurrency(totalToday)}
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield size={14} />
                <span>Secured by 256-bit SSL encryption. Payments processed by Stripe.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PaymentPage
