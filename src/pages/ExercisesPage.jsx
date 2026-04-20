import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Clock, Dumbbell, ChevronRight, Filter, Search } from 'lucide-react'
import { exercises, categories, difficulties } from '../data/exercises'
import useSubscription from '../hooks/useSubscription'
import { getDifficultyColor } from '../utils/formatting'

const ExercisesPage = () => {
  const navigate = useNavigate()
  const { canAccess } = useSubscription()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = exercises.filter((ex) => {
    if (selectedCategory !== 'all' && ex.category !== selectedCategory) return false
    if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false
    if (searchQuery && !ex.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <h1 className="text-xl font-bold mb-3">Exercise Library</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="px-4 mt-3 space-y-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'
            }`}
          >
            All ({exercises.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'
              }`}
            >
              {cat.icon} {cat.name} ({exercises.filter(e => e.category === cat.id).length})
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedDifficulty('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedDifficulty === 'all' ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-500'
            }`}
          >
            All Levels
          </button>
          {difficulties.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDifficulty(d.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedDifficulty === d.id ? 'text-white' : 'bg-white/5 text-gray-500'
              }`}
              style={selectedDifficulty === d.id ? { backgroundColor: d.color } : {}}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-500">{filtered.length} exercises found</p>

        {/* Exercise List */}
        <div className="space-y-2">
          {filtered.map((ex, i) => (
            <motion.button
              key={ex.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => navigate(`/exercise/${ex.id}`)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-center gap-3 hover:bg-white/[0.04] transition-colors text-left"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: categories.find(c => c.id === ex.category)?.color + '15' }}
              >
                <span className="text-lg">{categories.find(c => c.id === ex.category)?.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{ex.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: getDifficultyColor(ex.difficulty) + '20', color: getDifficultyColor(ex.difficulty) }}>
                    {ex.difficulty}
                  </span>
                  <span className="text-[10px] text-gray-500">{ex.sets}x{ex.reps}</span>
                  <span className="text-[10px] text-gray-500">{ex.equipment}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-600 shrink-0" />
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell size={48} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No exercises found</p>
            <p className="text-xs text-gray-600">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExercisesPage
