import { motion } from 'framer-motion'
import { Flame, Calendar, Award, Zap } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'

const StreaksPage = () => {
  const { streaks } = useTrimFitStore()
  const today = new Date()
  const days = Array.from({ length: 30 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() - (29 - i)); return d })
  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4"><h1 className="text-xl font-bold">Streaks</h1><p className="text-sm text-gray-400">Stay consistent, see results</p></div>
      <div className="px-4 mt-4 space-y-4">
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 text-center">
          <Flame size={48} className="text-orange-400 mx-auto mb-2" />
          <p className="text-4xl font-bold">{streaks.current}</p>
          <p className="text-sm text-gray-400">Day Streak</p>
          <p className="text-xs text-gray-500 mt-1">Longest: {streaks.longest} days</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <h3 className="font-bold mb-3">Last 30 Days</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d, i) => (
              <div key={i} className="aspect-square rounded-lg bg-white/5 flex items-center justify-center text-[9px] text-gray-600">{d.getDate()}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default StreaksPage
