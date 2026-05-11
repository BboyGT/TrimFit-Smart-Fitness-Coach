import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, User, Bell, Shield, Lock, Globe, CreditCard,
  Moon, Volume2, LogOut, Trash2, ChevronRight, Heart,
  Smartphone, RefreshCw, HelpCircle, Star, Crown, Clock
} from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'

const SettingSection = ({ title, children }) => (
  <div className="space-y-1">
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">{title}</h3>
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
      {children}
    </div>
  </div>
)

const SettingItem = ({ icon: Icon, iconColor = 'text-gray-400', label, value, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors text-left ${danger ? '' : 'border-b border-white/5 last:border-b-0'}`}
  >
    <Icon size={18} className={danger ? 'text-red-400' : iconColor} />
    <span className={`flex-1 text-sm ${danger ? 'text-red-400' : 'text-gray-200'}`}>{label}</span>
    {value && <span className="text-xs text-gray-500 mr-1">{value}</span>}
    <ChevronRight size={14} className="text-gray-600" />
  </button>
)

const ToggleItem = ({ icon: Icon, label, description, value, onToggle }) => (
  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-b-0">
    <Icon size={18} className="text-gray-400" />
    <div className="flex-1">
      <p className="text-sm text-gray-200">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-white/10'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  </div>
)

const SettingsPage = () => {
  const navigate = useNavigate()
  const { user, logout, settings, updateSettings, deleteAccount } = useTrimFitStore()
  const { subscription, currentPlan, daysRemaining } = useSubscription()

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const updateSetting = (key) => {
    updateSettings({ [key]: !settings[key] })
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    navigate('/')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/profile')}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/[0.05] transition-colors"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-xl font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base truncate">{user.name || 'Set up profile'}</p>
            <p className="text-sm text-gray-400 truncate">{user.email || user.phone || 'Add your details'}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-gradient-to-r ${currentPlan.gradient} text-white`}>
                {currentPlan.name} Plan
              </span>
              {subscription.plan !== 'free' && daysRemaining() !== null && (
                <span className="text-[10px] text-gray-500">{daysRemaining()} days left</span>
              )}
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-600" />
        </motion.div>

        {/* Subscription */}
        <SettingSection title="Subscription & Billing">
          <SettingItem
            icon={Crown}
            iconColor="text-amber-400"
            label="Manage Subscription"
            value={currentPlan.name}
            onClick={() => navigate('/subscription')}
          />
          <SettingItem
            icon={CreditCard}
            iconColor="text-blue-400"
            label="Payment Methods"
            onClick={() => navigate('/subscription')}
          />
          <SettingItem
            icon={Star}
            iconColor="text-purple-400"
            label="Restore Purchases"
            onClick={() => {}}
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <ToggleItem
            icon={Bell}
            label="Push Notifications"
            description="Workout reminders & tips"
            value={settings.pushNotifications}
            onToggle={() => updateSetting('pushNotifications')}
          />
          <ToggleItem
            icon={Globe}
            label="Email Notifications"
            description="Weekly reports & updates"
            value={settings.emailNotifications}
            onToggle={() => updateSetting('emailNotifications')}
          />
          <ToggleItem
            icon={Clock}
            label="Workout Reminders"
            description="Daily reminder at your preferred time"
            value={settings.workoutReminders}
            onToggle={() => updateSetting('workoutReminders')}
          />
        </SettingSection>

        {/* Preferences */}
        <SettingSection title="Preferences">
          <ToggleItem
            icon={Moon}
            label="Dark Mode"
            description="Always use dark theme"
            value={settings.darkMode}
            onToggle={() => updateSetting('darkMode')}
          />
          <ToggleItem
            icon={Smartphone}
            label="Haptic Feedback"
            description="Vibration on actions"
            value={settings.hapticFeedback}
            onToggle={() => updateSetting('hapticFeedback')}
          />
          <ToggleItem
            icon={Volume2}
            label="Sound Effects"
            description="Timer & completion sounds"
            value={settings.soundEffects}
            onToggle={() => updateSetting('soundEffects')}
          />
          <ToggleItem
            icon={RefreshCw}
            label="Auto-play Videos"
            description="Play exercise demos automatically"
            value={settings.autoPlayVideos}
            onToggle={() => updateSetting('autoPlayVideos')}
          />
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Globe size={18} className="text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-200">Units</p>
              <p className="text-xs text-gray-500 mt-0.5">Measurement system</p>
            </div>
            <div className="flex bg-white/5 rounded-lg overflow-hidden">
              <button
                className={`px-3 py-1 text-xs font-medium transition-colors ${settings.metricUnits ? 'bg-primary text-white' : 'text-gray-400'}`}
                onClick={() => updateSettings({ metricUnits: true })}
              >
                Metric
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium transition-colors ${!settings.metricUnits ? 'bg-primary text-white' : 'text-gray-400'}`}
                onClick={() => updateSettings({ metricUnits: false })}
              >
                Imperial
              </button>
            </div>
          </div>
        </SettingSection>

        {/* Support */}
        <SettingSection title="Support & About">
          <SettingItem
            icon={HelpCircle}
            iconColor="text-cyan-400"
            label="Help Center"
            onClick={() => {}}
          />
          <SettingItem
            icon={Heart}
            iconColor="text-rose-400"
            label="Rate TrimFit"
            onClick={() => {}}
          />
          <SettingItem
            icon={Shield}
            iconColor="text-gray-400"
            label="Privacy Policy"
            onClick={() => navigate('/privacy')}
          />
          <SettingItem
            icon={Lock}
            iconColor="text-gray-400"
            label="Terms of Service"
            onClick={() => navigate('/terms')}
          />
        </SettingSection>

        {/* Danger Zone */}
        <SettingSection title="Account">
          <SettingItem
            icon={LogOut}
            label="Log Out"
            onClick={() => setShowLogoutConfirm(true)}
          />
          <SettingItem
            icon={Trash2}
            label="Delete Account"
            danger
            onClick={() => setShowDeleteConfirm(true)}
          />
        </SettingSection>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative w-full max-w-xs bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                <LogOut size={20} className="text-red-400" />
              </div>
              <h3 className="font-bold mb-1">Log Out?</h3>
              <p className="text-sm text-gray-400 mb-5">Are you sure you want to log out of your account?</p>
              <div className="flex gap-2">
                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-sm hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button onClick={handleLogout} className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors">
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Account Modal */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative w-full max-w-xs bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="font-bold mb-1">Delete Account?</h3>
              <p className="text-sm text-gray-400 mb-5">This will permanently delete your account and all data. This action cannot be undone.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-sm hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-600">TrimFit v2.0.0</p>
          <p className="text-[10px] text-gray-700 mt-0.5">Made with love for fitness</p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
