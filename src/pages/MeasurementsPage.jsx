import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Ruler, ChevronRight, TrendingUp } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'
import { formatDate } from '../utils/formatting'

const bodyParts = [
  { id: 'weight', name: 'Weight', unit: 'kg', icon: '⚖️' },
  { id: 'chest', name: 'Chest', unit: 'cm', icon: '💪' },
  { id: 'waist', name: 'Waist', unit: 'cm', icon: '📏' },
  { id: 'hips', name: 'Hips', unit: 'cm', icon: '🦵' },
  { id: 'biceps', name: 'Biceps', unit: 'cm', icon: '💪' },
  { id: 'thighs', name: 'Thighs', unit: 'cm', icon: '🦵' },
  { id: 'neck', name: 'Neck', unit: 'cm', icon: '📐' },
  { id: 'shoulders', name: 'Shoulders', unit: 'cm', icon: '🏋️' },
]

const MeasurementsPage = () => {
  const navigate = useNavigate()
  const { measurements, addMeasurement } = useTrimFitStore()
  const { canAccess } = useSubscription()
  const [selectedPart, setSelectedPart] = useState('weight')
  const [value, setValue] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleAdd = () => {
    if (!value) return
    addMeasurement({ part: selectedPart, value: parseFloat(value), unit: bodyParts.find(b => b.id === selectedPart)?.unit })
    setValue('')
  }

  const sorted = [...measurements].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <h1 className="text-xl font-bold">Body Measurements</h1>
        <p className="text-sm text-gray-400">Track your body changes over time</p>
      </div>
      <div className="px-4 mt-4 space-y-4">
        {!canAccess('measurements') && (
          <button onClick={() => navigate('/subscription')} className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Ruler size={20} className="text-amber-400" />
            <div className="flex-1 text-left"><p className="text-sm font-bold text-amber-300">Upgrade to track measurements</p><p className="text-xs text-gray-400">Body tracking available on Basic+</p></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        )}

        {/* Add measurement */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {bodyParts.map(bp => (
              <button key={bp.id} onClick={() => setSelectedPart(bp.id)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${selectedPart === bp.id ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>
                {bp.icon} {bp.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder={`Enter ${selectedPart} (${bodyParts.find(b => b.id === selectedPart)?.unit})`} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
            <button onClick={handleAdd} className="px-4 py-2.5 bg-primary rounded-xl font-bold text-sm"><Plus size={18} /></button>
          </div>
        </div>

        {/* History */}
        <div>
          <h3 className="font-bold mb-2">History</h3>
          {sorted.length === 0 ? (
            <div className="text-center py-8"><Ruler size={48} className="text-gray-600 mx-auto mb-3" /><p className="text-gray-400 text-sm">No measurements yet</p></div>
          ) : (
            <div className="space-y-2">
              {sorted.slice(0, 20).map(m => (
                <div key={m.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{bodyParts.find(b => b.id === m.part)?.icon}</span>
                    <div><p className="text-sm font-medium capitalize">{m.part}</p><p className="text-xs text-gray-500">{formatDate(m.date)}</p></div>
                  </div>
                  <span className="font-bold">{m.value} {m.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default MeasurementsPage
