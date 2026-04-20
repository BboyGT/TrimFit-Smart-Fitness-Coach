import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Clock, Dumbbell, ChevronRight } from 'lucide-react'
import { exercises, categories } from '../data/exercises'
import { getDifficultyColor, getMuscleColorByMuscle } from '../utils/formatting'

const ExerciseDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const exercise = exercises.find((e) => e.id === parseInt(id))

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Dumbbell size={48} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Exercise not found</p>
          <button onClick={() => navigate('/exercises')} className="text-primary hover:underline mt-2 text-sm">Back to exercises</button>
        </div>
      </div>
    )
  }

  const category = categories.find(c => c.id === exercise.category)

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold truncate">{exercise.name}</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Video Thumbnail */}
        {exercise.youtubeId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border border-white/5"
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${exercise.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                title={exercise.name}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                frameBorder="0"
              />
            </div>
          </motion.div>
        )}

        {/* Info Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: getDifficultyColor(exercise.difficulty) + '20', color: getDifficultyColor(exercise.difficulty) }}>
            {exercise.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: (category?.color || '#666') + '20', color: category?.color }}>
            {category?.icon} {category?.name}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-gray-400">
            {exercise.equipment}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-gray-400">
            {exercise.sets} x {exercise.reps}
          </span>
        </div>

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <h3 className="font-bold mb-2">Muscle Target</h3>
          <p className="text-sm text-gray-300" style={{ color: getMuscleColorByMuscle(exercise.muscle) }}>{exercise.muscle}</p>
          <p className="text-sm text-gray-400 mt-2">{exercise.description}</p>
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <h3 className="font-bold mb-3">Instructions</h3>
          <div className="space-y-2">
            {exercise.instructions.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 font-bold">{i + 1}</div>
                <p className="text-sm text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tips */}
        {exercise.tips && exercise.tips.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
            <h3 className="font-bold mb-3">Pro Tips</h3>
            <div className="space-y-2">
              {exercise.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 shrink-0">💡</span>
                  <p className="text-sm text-gray-300">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Calories */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-400">🔥</span>
            <span className="text-sm text-gray-400">Estimated Burn</span>
          </div>
          <span className="font-bold">{exercise.caloriesPerMin} cal/min</span>
        </div>
      </div>
    </div>
  )
}

export default ExerciseDetailPage
