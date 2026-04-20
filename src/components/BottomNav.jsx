import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Dumbbell, UtensilsCrossed, User, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'workout', label: 'Workout', icon: Dumbbell, path: '/workout' },
  { id: 'nutrition', label: 'Nutrition', icon: UtensilsCrossed, path: '/nutrition' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
]

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const activeTab = tabs.find((t) => location.pathname.startsWith(t.path)) || tabs[0]

  const shouldShowNav = tabs.some(tab => 
    location.pathname === tab.path || 
    (tab.path !== '/dashboard' && location.pathname.startsWith(tab.path))
  )

  if (!shouldShowNav) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass border-t border-white/5 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path ||
              (tab.path !== '/dashboard' && location.pathname.startsWith(tab.path))
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-2 w-8 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BottomNav