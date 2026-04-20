import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Plus, Edit, Trash2, Flame, Dumbbell } from 'lucide-react'

const GoalsPage = () => {
  const [goals] = useState([
    { id: 1, type: 'weight', target: '75 kg', current: '80 kg', progress: 60, unit: 'kg', label: 'Lose Weight' },
    { id: 2, type: 'workout', target: '5 days/week', current: '3 days/week', progress: 60, unit: '', label: 'Workout Frequency' },
    { id: 3, type: 'strength', target: '100 kg bench', current: '80 kg', progress: 80, unit: 'kg', label: 'Bench Press Goal' },
  ])
  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4"><h1 className="text-xl font-bold">My Goals</h1><p className="text-sm text-gray-400">Set and track your fitness goals</p></div>
      <div className="px-4 mt-4 space-y-3">
        {goals.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2"><h3 className="font-bold text-sm">{g.label}</h3><span className="text-xs text-gray-500">{g.current} → {g.target}</span></div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${g.progress}%` }} /></div>
            <p className="text-xs text-gray-500 mt-1">{g.progress}% complete</p>
          </motion.div>
        ))}
        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-sm flex items-center justify-center gap-2"><Plus size={16} /> Add New Goal</button>
      </div>
    </div>
  )
}
export default GoalsPage
