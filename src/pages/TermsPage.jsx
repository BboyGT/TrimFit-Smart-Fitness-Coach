import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const TermsPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-bold">Terms of Service</h1>
      </div>
      <div className="px-4 mt-4 space-y-4">
        {['1. Acceptance of Terms', '2. Description of Service', '3. User Accounts', '4. Subscription & Payments', '5. Refund Policy', '6. Intellectual Property', '7. User Content', '8. Privacy', '9. Limitation of Liability', '10. Termination', '11. Changes to Terms', '12. Contact Information'].map((section, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-2">{section}</h3>
            <p className="text-sm text-gray-400">By using TrimFit, you agree to these terms. This section outlines the specific rules and guidelines governing your use of the TrimFit smart fitness coaching platform. Please read each section carefully to understand your rights and responsibilities as a user of our service.</p>
          </div>
        ))}
        <p className="text-xs text-gray-600 text-center">Last updated: April 15, 2026</p>
      </div>
    </div>
  )
}
export default TermsPage
