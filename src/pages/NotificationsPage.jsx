import { motion } from 'framer-motion'
import { Bell, CheckCircle, Info, Award, Clock, Trash2 } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import { formatDateTime } from '../utils/formatting'

const NotificationsPage = () => {
  const { notifications, clearNotifications, markNotificationRead } = useTrimFitStore()
  const sampleNotifs = notifications.length > 0 ? notifications : [
    { id: '1', title: 'Welcome to TrimFit!', message: 'Start your fitness journey today by completing your profile.', type: 'info', createdAt: new Date().toISOString(), read: false },
    { id: '2', title: 'Daily Reminder', message: 'Time for your workout! Consistency is key to results.', type: 'reminder', createdAt: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: '3', title: 'Smart Tip', message: 'Try adding 10 minutes of stretching after each workout for better recovery.', type: 'tip', createdAt: new Date(Date.now() - 86400000).toISOString(), read: true },
  ]
  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4 flex items-center justify-between">
        <div><h1 className="text-xl font-bold">Notifications</h1><p className="text-sm text-gray-400">{sampleNotifs.filter(n => !n.read).length} unread</p></div>
        <button onClick={clearNotifications} className="p-2 rounded-xl bg-white/5 hover:bg-white/10"><Trash2 size={16} className="text-gray-500" /></button>
      </div>
      <div className="px-4 mt-4 space-y-2">
        {sampleNotifs.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} onClick={() => markNotificationRead(n.id)} className={`bg-white/[0.02] border rounded-xl p-3.5 ${n.read ? 'border-white/5' : 'border-primary/20 bg-primary/[0.02]'}`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><Bell size={14} className="text-primary" /></div>
              <div className="flex-1"><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-gray-400 mt-0.5">{n.message}</p><p className="text-[10px] text-gray-600 mt-1">{formatDateTime(n.createdAt)}</p></div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
            </div>
          </motion.div>
        ))}
        {sampleNotifs.length === 0 && <div className="text-center py-12"><Bell size={48} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No notifications</p></div>}
      </div>
    </div>
  )
}
export default NotificationsPage
