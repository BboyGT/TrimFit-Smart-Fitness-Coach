import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Plus, Trash2, X } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'

const goalTemplates = [
  { type: 'weight', label: 'Lose Weight', icon: '🔥' },
  { type: 'workout', label: 'Workout Frequency', icon: '🏋️' },
  { type: 'strength', label: 'Strength Goal', icon: '💪' },
  { type: 'cardio', label: 'Cardio Endurance', icon: '🏃' },
  { type: 'flexibility', label: 'Flexibility', icon: '🧘' },
  { type: 'nutrition', label: 'Nutrition Goal', icon: '🥗' },
]

const defaultGoals = [
  { id: 'default-1', type: 'weight', target: '75 kg', current: '80 kg', progress: 60, unit: 'kg', label: 'Lose Weight' },
  { id: 'default-2', type: 'workout', target: '5 days/week', current: '3 days/week', progress: 60, unit: '', label: 'Workout Frequency' },
  { id: 'default-3', type: 'strength', target: '100 kg bench', current: '80 kg', progress: 80, unit: 'kg', label: 'Bench Press Goal' },
]

const GoalsPage = () => {
  const { goals: storeGoals, addGoal, deleteGoal, updateGoal } = useTrimFitStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newGoal, setNewGoal] = useState({ label: '', target: '', progress: 0 })

  // Use store goals, fall back to defaults if store is empty
  const goals = storeGoals.length > 0 ? storeGoals : defaultGoals

  const handleAddGoal = () => {
    if (!newGoal.label.trim() || !newGoal.target.trim()) return
    addGoal({
      type: 'custom',
      label: newGoal.label,
      target: newGoal.target,
      current: '0%',
      progress: newGoal.progress,
      unit: '',
    })
    setNewGoal({ label: '', target: '', progress: 0 })
    setShowAddModal(false)
  }

  const handleDeleteGoal = (id) => {
    deleteGoal(id)
  }

  const handleUseTemplate = (template) => {
    setNewGoal({ label: template.label, target: '', progress: 0 })
    setShowAddModal(true)
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <h1 className="text-xl font-bold">My Goals</h1>
        <p className="text-sm text-gray-400">Set and track your fitness goals</p>
      </div>
      <div className="px-4 mt-4 space-y-3">
        {goals.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm">{g.label}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{g.current} → {g.target}</span>
                <button
                  onClick={() => handleDeleteGoal(g.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${g.progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{g.progress}% complete</p>
          </motion.div>
        ))}

        {/* Goal Templates */}
        {goals.length < 6 && (
          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-2">Quick Add:</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {goalTemplates.map(t => (
                <button
                  key={t.type}
                  onClick={() => handleUseTemplate(t)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Goal Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
        >
          <Plus size={16} /> Add New Goal
        </button>
      </div>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-[#1a1a2e] border border-white/10 rounded-t-3xl p-6 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Add New Goal</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.label}
                  onChange={e => setNewGoal({ ...newGoal, label: e.target.value })}
                  placeholder="e.g., Run a marathon"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Target</label>
                <input
                  type="text"
                  value={newGoal.target}
                  onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="e.g., Under 4 hours"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-white/5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoal.label.trim() || !newGoal.target.trim()}
                  className="flex-1 py-3 bg-primary rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Goal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default GoalsPage
