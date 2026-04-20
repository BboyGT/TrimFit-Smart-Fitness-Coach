import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Clock, Target, ChevronRight } from 'lucide-react'

const challenges = [
  { id: 1, name: '30-Day Push Up Challenge', desc: 'Do 100 push ups every day for 30 days', duration: '30 days', participants: 12400, difficulty: 'intermediate', reward: 'Badge + 500 XP' },
  { id: 2, name: '5K Running Challenge', desc: 'Run 5K in under 30 minutes', duration: '4 weeks', participants: 8900, difficulty: 'intermediate', reward: 'Badge + 300 XP' },
  { id: 3, name: 'Plank Master', desc: 'Hold a plank for 5 minutes', duration: '2 weeks', participants: 5600, difficulty: 'advanced', reward: 'Badge + 400 XP' },
  { id: 4, name: 'No Sugar Week', desc: 'Cut all added sugar for 7 days', duration: '7 days', participants: 15800, difficulty: 'beginner', reward: 'Badge + 200 XP' },
]

const ChallengesPage = () => {
  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4"><h1 className="text-xl font-bold">Challenges</h1><p className="text-sm text-gray-400">Push your limits</p></div>
      <div className="px-4 mt-4 space-y-3">
        {challenges.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center"><Trophy size={20} className="text-amber-400" /></div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{c.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={10} />{c.duration}</span>
                  <span className="flex items-center gap-1"><Target size={10} />{c.participants.toLocaleString()} joined</span>
                </div>
              </div>
            </div>
            <button className="mt-3 w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">Join Challenge</button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
export default ChallengesPage
