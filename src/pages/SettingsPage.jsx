import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Globe, Moon, ChevronRight, Info, FileText } from 'lucide-react'

const settings = [
  { label: 'Edit Profile', icon: User, path: '/profile' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Privacy Policy', icon: Shield, path: '/privacy' },
  { label: 'Terms of Service', icon: FileText, path: '/terms' },
]

const SettingsPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4"><h1 className="text-xl font-bold">Settings</h1></div>
      <div className="px-4 mt-4 space-y-2">
        {settings.map(s => (
          <button key={s.label} onClick={() => navigate(s.path)} className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-center gap-3 hover:bg-white/[0.04]">
            <s.icon size={18} className="text-gray-400" />
            <span className="flex-1 text-left text-sm font-medium">{s.label}</span>
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        ))}
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mt-4">
          <p className="text-xs text-gray-500 text-center">TrimFit v2.0.0 · Smart Fitness Coach</p>
        </div>
      </div>
    </div>
  )
}
export default SettingsPage
