import { motion } from 'framer-motion'
import { Lightbulb, Dumbbell, UtensilsCrossed, Moon, Heart, TrendingUp, Activity } from 'lucide-react'
import { PageHeader, Card, Badge } from '../components/UI'

const tips = [
  { icon: Dumbbell, title: 'Progressive Overload', content: 'Gradually increase weight, reps, or sets to keep challenging your muscles. This is the key principle for building strength and muscle.', category: 'Training', color: 'emerald' },
  { icon: UtensilsCrossed, title: 'Protein Timing', content: 'Aim for 20-30g of protein within 2 hours post-workout for optimal recovery. Spread protein intake across all meals for best absorption.', category: 'Nutrition', color: 'blue' },
  { icon: Moon, title: 'Sleep for Recovery', content: 'Getting 7-9 hours of quality sleep is crucial for muscle recovery, hormone regulation, and overall performance. Never skip sleep.', category: 'Recovery', color: 'purple' },
  { icon: Heart, title: 'Stay Hydrated', content: 'Drink at least 8 glasses of water daily. Dehydration can reduce performance by up to 25% and impair recovery.', category: 'Wellness', color: 'cyan' },
  { icon: TrendingUp, title: 'Consistency Over Intensity', content: 'Small consistent efforts beat sporadic intense workouts. Aim for 3-4 sessions per week rather than one marathon session.', category: 'Mindset', color: 'amber' },
  { icon: Activity, title: 'Warm Up Properly', content: 'Spend 5-10 minutes warming up before each workout to prevent injury and improve performance. Dynamic stretches work best.', category: 'Prevention', color: 'rose' },
]

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
}

const TipsPage = () => {
  return (
    <div className="min-h-screen pb-24">
      <PageHeader 
        title="Smart Tips" 
        subtitle="Expert advice for better results"
      />
      <div className="px-4 mt-4 space-y-3">
        {tips.map((t, i) => {
          const colors = colorMap[t.color]
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className={`bg-white/[0.03] border ${colors.border} rounded-2xl p-4 hover:bg-white/[0.05] transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                  <t.icon size={22} className={colors.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-base">{t.title}</p>
                  </div>
                  <Badge variant={t.color}>{t.category}</Badge>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">{t.content}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
export default TipsPage