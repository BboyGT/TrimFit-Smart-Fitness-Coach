import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Droplets, Flame, UtensilsCrossed, ChevronRight, Target, Coffee, Sun, Moon, Sparkles, Crown, ArrowLeft } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'
import PremiumPaywall from '../components/PremiumPaywall'

const mealTemplates = [
  { name: 'Breakfast', icon: Coffee, color: 'from-amber-500 to-amber-700', items: ['Oatmeal with berries', 'Eggs & toast', 'Smoothie bowl', 'Avocado toast', 'Protein pancakes'] },
  { name: 'Lunch', icon: Sun, color: 'from-emerald-500 to-emerald-700', items: ['Grilled chicken salad', 'Quinoa bowl', 'Turkey wrap', 'Tuna sandwich', 'Buddha bowl'] },
  { name: 'Dinner', icon: Moon, color: 'from-blue-500 to-blue-700', items: ['Salmon with veggies', 'Lean steak & rice', 'Pasta primavera', 'Grilled fish tacos', 'Stir-fry chicken'] },
  { name: 'Snack', icon: UtensilsCrossed, color: 'from-purple-500 to-purple-700', items: ['Protein bar', 'Greek yogurt', 'Mixed nuts', 'Apple & peanut butter', 'Protein shake'] },
]

const NutritionPage = () => {
  const navigate = useNavigate()
  const { meals, waterIntake, setWaterIntake, dailyCalorieGoal, addMeal, user } = useTrimFitStore()
  const { subscription, currentPlan, canAccess } = useSubscription()
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  const [paywallFeature, setPaywallFeature] = useState(null)
  const [expandedMealPlan, setExpandedMealPlan] = useState(null)

  const todayMeals = meals.filter(m => new Date(m.date).toDateString() === new Date().toDateString())
  const totalCalories = todayMeals.reduce((s, m) => s + (m.calories || 0), 0)
  const totalProtein = todayMeals.reduce((s, m) => s + (m.protein || 0), 0)
  const totalCarbs = todayMeals.reduce((s, m) => s + (m.carbs || 0), 0)
  const totalFat = todayMeals.reduce((s, m) => s + (m.fat || 0), 0)
  const goal = dailyCalorieGoal || 2000
  const calorieProgress = Math.min((totalCalories / goal) * 100, 100)
  const remainingCalories = Math.max(goal - totalCalories, 0)

  const proteinGoal = user.weight ? Math.round(user.weight * 2) : 150
  const carbGoal = Math.round((goal * 0.4) / 4)
  const fatGoal = Math.round((goal * 0.25) / 9)

  const handleAddMeal = (quickMeal = null) => {
    const mealData = quickMeal || {
      ...mealForm,
      calories: parseInt(mealForm.calories) || 0,
      protein: parseInt(mealForm.protein) || 0,
      carbs: parseInt(mealForm.carbs) || 0,
      fat: parseInt(mealForm.fat) || 0,
    }
    addMeal(mealData)
    setMealForm({ name: '', calories: '', protein: '', carbs: '', fat: '' })
    setShowAddMeal(false)
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold">Nutrition</h1>
            <p className="text-sm text-gray-400">Track your meals and macros</p>
          </div>
          {canAccess('mealPlans') && (
            <span className="ml-auto text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Crown size={10} /> Pro
            </span>
          )}
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Calorie Ring */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-5">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={calorieProgress > 90 ? '#ef4444' : calorieProgress > 70 ? '#f59e0b' : '#10b981'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${Math.min(calorieProgress / 100 * 264, 264)} 264`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{totalCalories}</span>
                <span className="text-xs text-gray-400">/ {goal} cal</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Protein</span>
                  <span className="text-xs text-gray-400">{totalProtein}/{proteinGoal}g</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(totalProtein / proteinGoal * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Carbs</span>
                  <span className="text-xs text-gray-400">{totalCarbs}/{carbGoal}g</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(totalCarbs / carbGoal * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Fat</span>
                  <span className="text-xs text-gray-400">{totalFat}/{fatGoal}g</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(totalFat / fatGoal * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-400">Remaining</span>
            <span className={`text-sm font-bold ${remainingCalories < 200 ? 'text-red-400' : 'text-emerald-400'}`}>
              {remainingCalories} cal left
            </span>
          </div>
        </motion.div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Protein', value: totalProtein, unit: 'g', color: '#3b82f6', pct: Math.round((totalProtein * 4 / Math.max(totalCalories, 1)) * 100) },
            { label: 'Carbs', value: totalCarbs, unit: 'g', color: '#10b981', pct: Math.round((totalCarbs * 4 / Math.max(totalCalories, 1)) * 100) },
            { label: 'Fat', value: totalFat, unit: 'g', color: '#f59e0b', pct: Math.round((totalFat * 9 / Math.max(totalCalories, 1)) * 100) },
          ].map(m => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center"
            >
              <p className="text-xs text-gray-400">{m.label}</p>
              <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}<span className="text-xs font-normal">{m.unit}</span></p>
              <p className="text-[10px] text-gray-600">{totalCalories > 0 ? m.pct : 0}% of cal</p>
            </motion.div>
          ))}
        </div>

        {/* Water Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] border border-white/5 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplets size={16} className="text-blue-400" />
              <h3 className="font-bold">Water Intake</h3>
            </div>
            <span className="text-sm text-gray-400">{waterIntake} / 8 glasses</span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                onClick={() => setWaterIntake(i + 1)}
                className={`flex-1 h-8 rounded-lg transition-all duration-200 ${
                  i < waterIntake ? 'bg-blue-500/30 border border-blue-500/50' : 'bg-white/5 border border-white/10'
                }`}
              />
            ))}
          </div>
          {waterIntake >= 8 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-blue-400 text-center mt-2"
            >
              Great job! You've hit your daily water goal!
            </motion.p>
          )}
        </motion.div>

        {/* Smart Meal Plans (Pro) */}
        {canAccess('mealPlans') ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-emerald-500/10 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-emerald-400" />
              <h3 className="font-bold text-sm">Smart Meal Plan</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">PRO</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Personalized meal suggestions based on your goals and calorie target.</p>
            <div className="space-y-2">
              {mealTemplates.map((template, i) => {
                const Icon = template.icon
                return (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedMealPlan(expandedMealPlan === i ? null : i)}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                        <Icon size={14} className="text-white" />
                      </div>
                      <span className="text-sm font-medium flex-1">{template.name}</span>
                      <ChevronRight size={14} className={`text-gray-500 transition-transform ${expandedMealPlan === i ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedMealPlan === i && (
                      <div className="px-3 pb-3 space-y-1">
                        {template.items.map((item, j) => (
                          <button
                            key={j}
                            onClick={() => handleAddMeal({
                              name: `${template.name}: ${item}`,
                              calories: Math.round(goal * (template.name === 'Snack' ? 0.1 : 0.3)),
                              protein: Math.round(Math.random() * 30 + 15),
                              carbs: Math.round(Math.random() * 40 + 20),
                              fat: Math.round(Math.random() * 15 + 5),
                            })}
                            className="w-full text-left flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <span className="text-xs text-gray-300">{item}</span>
                            <Plus size={12} className="text-primary" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => setPaywallFeature('mealPlans')}
            className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-amber-500/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Target size={18} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-300">Unlock Smart Meal Plans</p>
              <p className="text-xs text-gray-400">AI-personalized meal plans & macro tracking</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </motion.div>
        )}

        {/* Add Meal */}
        {!showAddMeal ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowAddMeal(true)}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Log Meal
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3"
          >
            <input
              type="text"
              value={mealForm.name}
              onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
              placeholder="Meal name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <div className="grid grid-cols-4 gap-2">
              <input type="number" value={mealForm.calories} onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })} placeholder="Cal" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              <input type="number" value={mealForm.protein} onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })} placeholder="Protein" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              <input type="number" value={mealForm.carbs} onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })} placeholder="Carbs" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              <input type="number" value={mealForm.fat} onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })} placeholder="Fat" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddMeal(false)} className="flex-1 py-2.5 bg-white/5 rounded-xl text-sm hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => handleAddMeal()} className="flex-1 py-2.5 bg-primary rounded-xl text-sm font-bold">Add Meal</button>
            </div>
          </motion.div>
        )}

        {/* Today's Meals */}
        {todayMeals.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">Today's Meals</h3>
            <div className="space-y-2">
              {todayMeals.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{m.name || 'Meal'}</p>
                    <p className="text-xs text-gray-500">P: {m.protein}g · C: {m.carbs}g · F: {m.fat}g</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{m.calories}</span>
                    <span className="text-xs text-gray-500"> cal</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Plan Upsell */}
        {subscription.plan === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
          >
            <Flame size={20} className="text-amber-400" />
            <div className="flex-1">
              <p className="text-sm font-bold">Go Pro for Smart Nutrition</p>
              <p className="text-xs text-gray-400">Personalized meal plans, macro tracking, and calorie coaching</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </motion.div>
        )}
      </div>

      {paywallFeature && (
        <PremiumPaywall
          feature={paywallFeature}
          title="Smart Meal Plans"
          description="Get AI-powered personalized meal plans tailored to your fitness goals, dietary preferences, and calorie targets."
          onClose={() => setPaywallFeature(null)}
        />
      )}
    </div>
  )
}

export default NutritionPage
