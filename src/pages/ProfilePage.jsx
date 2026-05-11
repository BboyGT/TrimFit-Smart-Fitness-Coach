import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, User, Mail, Phone, Calendar, Target, Crown,
  ChevronRight, Camera, LogOut, Shield, CreditCard, Clock,
  Edit3, Check, X, Bell, Star, TrendingUp, Flame, Zap,
  Award, Dumbbell, UtensilsCrossed, Ruler, Heart
} from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'
import { formatCurrency, calculateBMI, getBMICategory } from '../utils/formatting'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, streaks, workoutHistory, meals, achievements, logout } = useTrimFitStore()
  const { subscription, currentPlan, daysRemaining, cancelSubscription, reactivateSubscription } = useSubscription()

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  })
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const bmi = calculateBMI(user.weight, user.height)
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  const totalWorkouts = workoutHistory.length
  const thisMonthWorkouts = workoutHistory.filter(w => {
    const d = new Date(w.completedAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const handleSaveProfile = () => {
    useTrimFitStore.getState().updateUser(editData)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditData({ name: user.name, email: user.email, phone: user.phone })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { icon: Bell, label: 'Notifications', path: '/notifications', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Target, label: 'Goals', path: '/goals', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Award, label: 'Achievements', path: '/achievements', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Flame, label: 'Streaks', path: '/streaks', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { icon: TrendingUp, label: 'Progress', path: '/progress', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Ruler, label: 'Measurements', path: '/measurements', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: UtensilsCrossed, label: 'Nutrition', path: '/nutrition', color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { icon: Dumbbell, label: 'Challenges', path: '/challenges', color: 'text-red-400', bg: 'bg-red-500/10' },
    { icon: Heart, label: 'Community', path: '/community', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ]

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Profile</h1>
          <button
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10"
          >
            {isEditing ? <Check size={20} className="text-primary" /> : <Edit3 size={20} />}
          </button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

          <div className="relative z-10">
            {/* Avatar */}
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-3xl font-bold mx-auto">
                {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Camera size={14} className="text-white" />
              </button>
            </div>

            {/* Name */}
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 space-y-2"
                >
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full max-w-xs mx-auto bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-center focus:outline-none focus:border-primary"
                  />
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    placeholder="Email"
                    className="w-full max-w-xs mx-auto bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-center focus:outline-none focus:border-primary"
                  />
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="Phone"
                    className="w-full max-w-xs mx-auto bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-center focus:outline-none focus:border-primary"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3"
                >
                  <h2 className="text-xl font-bold">{user.name || 'Set your name'}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{user.email || user.phone}</p>
                  {user.goal && (
                    <span className="inline-block mt-2 text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300 capitalize">
                      Goal: {user.goal}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plan Badge */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 inline-flex items-center gap-2"
            >
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold bg-gradient-to-r ${currentPlan.gradient} text-white flex items-center gap-1.5`}>
                <Crown size={12} />
                {currentPlan.name} Plan
              </span>
              {subscription.plan !== 'free' && daysRemaining() !== null && daysRemaining() > 0 && (
                <span className="text-xs text-gray-400">{daysRemaining()}d remaining</span>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center"
          >
            <Flame size={18} className="text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-bold">{totalWorkouts}</p>
            <p className="text-[10px] text-gray-500">Total Workouts</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center"
          >
            <Zap size={18} className="text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold">{thisMonthWorkouts}</p>
            <p className="text-[10px] text-gray-500">This Month</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 text-center"
          >
            <Star size={18} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-bold">{achievements.length}</p>
            <p className="text-[10px] text-gray-500">Achievements</p>
          </motion.div>
        </div>

        {/* Body Stats */}
        {(user.height || user.weight || bmi) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
          >
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Body Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              {user.height && (
                <div className="text-center">
                  <p className="text-lg font-bold">{user.height}</p>
                  <p className="text-[10px] text-gray-500">Height (cm)</p>
                </div>
              )}
              {user.weight && (
                <div className="text-center">
                  <p className="text-lg font-bold">{user.weight}</p>
                  <p className="text-[10px] text-gray-500">Weight (kg)</p>
                </div>
              )}
              {bmi && (
                <div className="text-center">
                  <p className="text-lg font-bold">{bmi}</p>
                  <p className="text-[10px]" style={{ color: bmiCategory?.color }}>{bmiCategory?.label}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Subscription Management */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">Subscription</h3>
            <button onClick={() => navigate('/subscription')} className="text-xs text-primary hover:underline">Manage</button>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentPlan.gradient} flex items-center justify-center`}>
              <Crown size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium capitalize">{currentPlan.name} Plan</p>
              <p className="text-xs text-gray-400">
                {subscription.status === 'active'
                  ? currentPlan.price === 0
                    ? 'Free forever'
                    : `${formatCurrency(currentPlan.price)}/month`
                  : 'Cancelled'}
              </p>
            </div>
          </div>

          {subscription.plan !== 'free' && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              {subscription.status === 'active' && subscription.endDate && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1"><Clock size={12} />Next billing</span>
                  <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
                </div>
              )}
              {subscription.paymentMethod && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1"><CreditCard size={12} />Payment</span>
                  <span>{subscription.paymentMethod.brand}{subscription.paymentMethod.last4 ? ` ••${subscription.paymentMethod.last4}` : ''}</span>
                </div>
              )}
              <div className="pt-1">
                {subscription.status === 'active' ? (
                  <button
                    onClick={cancelSubscription}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                ) : (
                  <button
                    onClick={reactivateSubscription}
                    className="text-xs text-primary hover:text-primary-light transition-colors font-medium"
                  >
                    Reactivate Subscription
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
        >
          {menuItems.map((item, i) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors text-left ${i < menuItems.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                  <Icon size={16} className={item.color} />
                </div>
                <span className="flex-1 text-sm text-gray-200">{item.label}</span>
                <ChevronRight size={14} className="text-gray-600" />
              </button>
            )
          })}
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-500/10 flex items-center justify-center">
              <Shield size={16} className="text-gray-400" />
            </div>
            <span className="flex-1 text-sm text-gray-200">Settings</span>
            <ChevronRight size={14} className="text-gray-600" />
          </button>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-3.5 rounded-2xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/5 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Log Out
        </motion.button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative w-full max-w-xs bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
              <LogOut size={20} className="text-red-400" />
            </div>
            <h3 className="font-bold mb-1">Log Out?</h3>
            <p className="text-sm text-gray-400 mb-5">Are you sure you want to log out?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-sm hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button onClick={handleLogout} className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors">
                Log Out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ProfilePage
