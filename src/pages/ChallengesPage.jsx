import { motion } from 'framer-motion'
import { Trophy, Clock, Target, Check, ChevronRight } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'

const challenges = [
  { id: 1, name: '30-Day Push Up Challenge', desc: 'Do 100 push ups every day for 30 days', duration: '30 days', participants: 12400, difficulty: 'intermediate', reward: 'Badge + 500 XP' },
  { id: 2, name: '5K Running Challenge', desc: 'Run 5K in under 30 minutes', duration: '4 weeks', participants: 8900, difficulty: 'intermediate', reward: 'Badge + 300 XP' },
  { id: 3, name: 'Plank Master', desc: 'Hold a plank for 5 minutes', duration: '2 weeks', participants: 5600, difficulty: 'advanced', reward: 'Badge + 400 XP' },
  { id: 4, name: 'No Sugar Week', desc: 'Cut all added sugar for 7 days', duration: '7 days', participants: 15800, difficulty: 'beginner', reward: 'Badge + 200 XP' },
]

const difficultyColors = {
  beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  intermediate: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  advanced: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
}

const ChallengesPage = () => {
  const { joinedChallenges, toggleChallenge } = useTrimFitStore()

  const handleJoinChallenge = (id) => {
    toggleChallenge(id)
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <h1 className="text-xl font-bold">Challenges</h1>
        <p className="text-sm text-gray-400">Push your limits</p>
      </div>
      <div className="px-4 mt-4 space-y-3">
        {/* My Challenges */}
        {joinedChallenges.length > 0 && (
          <div className="mb-2">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Target size={16} className="text-primary" />
              My Challenges ({joinedChallenges.length})
            </h3>
            <div className="space-y-2">
              {challenges.filter(c => joinedChallenges.includes(c.id)).map(c => (
                <motion.div
                  key={`joined-${c.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Check size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.duration} · {c.reward}</p>
                  </div>
                  <button
                    onClick={() => handleJoinChallenge(c.id)}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1"
                  >
                    Leave
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Challenges */}
        <h3 className="font-bold text-gray-400">Available Challenges</h3>
        {challenges.map((c, i) => {
          const colors = difficultyColors[c.difficulty]
          const isJoined = joinedChallenges.includes(c.id)
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white/[0.03] border rounded-2xl p-4 ${isJoined ? 'border-primary/20' : 'border-white/5'}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center shrink-0">
                  <Trophy size={20} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">{c.name}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text} capitalize`}>
                      {c.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={10} />{c.duration}</span>
                    <span className="flex items-center gap-1"><Target size={10} />{c.participants.toLocaleString()} joined</span>
                    <span className="flex items-center gap-1"><Trophy size={10} />{c.reward}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleJoinChallenge(c.id)}
                className={`mt-3 w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isJoined
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {isJoined ? (
                  <><Check size={14} /> Joined</>
                ) : (
                  <><ChevronRight size={14} /> Join Challenge</>
                )}
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
export default ChallengesPage
