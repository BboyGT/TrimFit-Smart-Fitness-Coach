import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Crown, ChevronRight, LogOut, Edit, Target, Calendar, Award } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'
import { formatCurrency, formatDate } from '../utils/formatting'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, subscription, logout } = useTrimFitStore()
  const { currentPlan, isPremium } = useSubscription()

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-2xl font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.name || 'User'}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Crown size={12} className={isPremium ? 'text-amber-400' : 'text-gray-500'} />
              <span className={`text-xs capitalize ${isPremium ? 'text-amber-400' : 'text-gray-500'}`}>{currentPlan.name} Plan</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-3">
        {[
          { label: 'Personal Info', icon: User, path: '/settings' },
          { label: 'My Goals', icon: Target, path: '/goals' },
          { label: 'Achievements', icon: Award, path: '/achievements' },
          { label: 'Streaks', icon: Calendar, path: '/streaks' },
          { label: 'Manage Subscription', icon: Crown, path: '/subscription' },
        ].map(item => (
          <button key={item.label} onClick={() => navigate(item.path)} className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-center gap-3 hover:bg-white/[0.04] transition-colors">
            <item.icon size={18} className="text-gray-400" />
            <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        ))}
        <button onClick={() => { logout(); navigate('/login') }} className="w-full bg-red-500/5 border border-red-500/10 rounded-xl p-3.5 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors mt-6">
          <LogOut size={18} /><span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  )
}
export default ProfilePage
