import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const PrivacyPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-bold">Privacy Policy</h1>
      </div>
      <div className="px-4 mt-4 space-y-4">
        {['1. Information We Collect', '2. How We Use Your Information', '3. Information Sharing', '4. Data Security', '5. Cookies & Tracking', '6. Your Rights', '7. Children\'s Privacy', '8. International Transfers', '9. Changes to Policy', '10. Contact Us'].map((section, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-2">{section}</h3>
            <p className="text-sm text-gray-400">Your privacy is important to us. This section explains how TrimFit collects, uses, and protects your personal information. We are committed to ensuring your data is handled securely and in accordance with applicable privacy laws and regulations.</p>
          </div>
        ))}
        <p className="text-xs text-gray-600 text-center">Last updated: April 15, 2026</p>
      </div>
    </div>
  )
}
export default PrivacyPage
