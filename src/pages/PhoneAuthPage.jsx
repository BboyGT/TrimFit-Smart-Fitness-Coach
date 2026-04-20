import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Smartphone, Loader2, CheckCircle, Shield, Phone, RefreshCw } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
  { code: '+233', country: 'GH', flag: '🇬🇭' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
]

const PhoneAuthPage = () => {
  const navigate = useNavigate()
  const { phoneLogin, phoneRegister } = useTrimFitStore()
  const [step, setStep] = useState('enter') // enter, verify, success
  const [mode, setMode] = useState('login') // login or register
  const [countryCode, setCountryCode] = useState(countryCodes[0])
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [searchCountry, setSearchCountry] = useState('')

  const inputRefs = useRef([])

  // Simulated OTP for demo
  const generatedOtp = useRef('123456')

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  const filteredCountries = countryCodes.filter(c =>
    c.country.toLowerCase().includes(searchCountry.toLowerCase()) ||
    c.code.includes(searchCountry)
  )

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 7) { setError('Please enter a valid phone number'); return }

    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setStep('verify')
    setResendTimer(60)
    // Focus first OTP input
    setTimeout(() => inputRefs.current[0]?.focus(), 100)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => { newOtp[i] = char })
    setOtp(newOtp)
    const nextEmpty = pasted.length < 6 ? pasted.length : 5
    inputRefs.current[nextEmpty]?.focus()
  }

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('')
    if (enteredOtp.length !== 6) { setError('Please enter the complete 6-digit code'); return }

    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)

    if (enteredOtp === generatedOtp.current) {
      setStep('success')
      const fullPhone = `${countryCode.code}${phone.replace(/\D/g, '')}`
      if (mode === 'register') {
        phoneRegister(fullPhone)
        setTimeout(() => navigate('/onboarding'), 1500)
      } else {
        phoneLogin(fullPhone)
        setTimeout(() => navigate('/dashboard'), 1500)
      }
    } else {
      setError('Invalid verification code. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setResendTimer(60)
    setError('')
    // Regenerate OTP
    generatedOtp.current = String(Math.floor(100000 + Math.random() * 900000))
  }

  return (
    <div className="min-h-screen flex flex-col px-5 py-6">
      {/* Back Button */}
      <button onClick={() => step === 'verify' || step === 'success' ? setStep('enter') : navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 self-start mb-4">
        <ArrowLeft size={20} />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col max-w-sm mx-auto w-full"
      >
        {/* Step: Enter Phone */}
        {step === 'enter' && (
          <div className="flex-1 flex flex-col">
            <div className="text-center space-y-3 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                <Smartphone size={28} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Phone Sign {mode === 'login' ? 'In' : 'Up'}</h1>
              <p className="text-gray-400 text-sm">We'll send a verification code to your phone number</p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'login' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'register' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Country Code + Phone */}
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                {/* Country Picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowCountryPicker(!showCountryPicker)}
                    className="flex items-center gap-1.5 h-[50px] px-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <span className="text-lg">{countryCode.flag}</span>
                    <span className="text-sm font-medium">{countryCode.code}</span>
                  </button>

                  {showCountryPicker && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="p-2 border-b border-white/5">
                        <input
                          type="text"
                          value={searchCountry}
                          onChange={e => setSearchCountry(e.target.value)}
                          placeholder="Search country..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredCountries.map(c => (
                          <button
                            key={c.code}
                            onClick={() => { setCountryCode(c); setShowCountryPicker(false); setSearchCountry('') }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-white/5 transition-colors ${countryCode.code === c.code ? 'bg-primary/10' : ''}`}
                          >
                            <span className="text-lg">{c.flag}</span>
                            <span className="flex-1 text-left">{c.country}</span>
                            <span className="text-gray-500">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <div className="flex-1 relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 text-center mb-4">{error}</div>
            )}

            {/* Send OTP Button */}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>
                Send Verification Code <ArrowLeft size={16} className="rotate-180" />
              </>}
            </button>

            {/* Info */}
            <div className="flex items-start gap-2 mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <Shield size={16} className="text-gray-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-gray-500 leading-relaxed">
                By continuing, you agree to receive a one-time SMS verification code. Standard messaging rates may apply. Your phone number is encrypted and never shared with third parties.
              </p>
            </div>
          </div>
        )}

        {/* Step: Verify OTP */}
        {step === 'verify' && (
          <div className="flex-1 flex flex-col">
            <div className="text-center space-y-3 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                <Shield size={28} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Verify Your Number</h1>
              <p className="text-gray-400 text-sm">
                Enter the 6-digit code sent to<br />
                <span className="text-white font-medium">{countryCode.code} {phone}</span>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 text-center mb-4">{error}</div>
            )}

            {/* OTP Input */}
            <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-xl font-bold bg-white/5 border rounded-xl focus:outline-none transition-all ${
                    digit
                      ? 'border-primary ring-1 ring-primary/20'
                      : 'border-white/10 focus:border-primary'
                  }`}
                />
              ))}
            </div>

            {/* Demo hint */}
            <div className="text-center mb-6">
              <p className="text-xs text-gray-600">
                Demo code: <span className="text-primary font-mono font-bold">123456</span>
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length !== 6}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify'}
            </button>

            {/* Resend */}
            <div className="text-center mt-4 space-y-2">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in <span className="text-primary font-mono font-bold">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-primary font-medium flex items-center justify-center gap-1.5 hover:underline disabled:opacity-50"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  Resend verification code
                </button>
              )}
              <button onClick={() => { setStep('enter'); setOtp(['', '', '', '', '', '']) }} className="block text-xs text-gray-500 hover:text-gray-300 mx-auto">
                Change phone number
              </button>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold">Verified!</h2>
              <p className="text-gray-400 text-sm">
                Your phone number has been verified successfully.<br />Redirecting you...
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
export default PhoneAuthPage
