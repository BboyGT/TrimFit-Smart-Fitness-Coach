import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Droplets, Flame, UtensilsCrossed, ChevronRight, Target, Coffee, Sun, Moon } from 'lucide-react'
import useTrimFitStore from '../store/useTrimFitStore'
import useSubscription from '../hooks/useSubscription'
import { formatCurrency } from '../utils/formatting'

const mealTemplates = [
  { name: 'Breakfast', icon: Coffee, color: 'from-amber-500 to-amber-700', items: ['Oatmeal with berries', 'Eggs & toast', 'Smoothie bowl'] },
  { name: 'Lunch', icon: Sun, color: 'from-emerald-500 to-emerald-700', items: ['Grilled chicken salad', 'Quinoa bowl', 'Turkey wrap'] },
  { name: 'Dinner', icon: Moon, color: 'from-blue-500 to-blue-700', items: ['Salmon with veggies', 'Lean steak & rice', 'Pasta primavera'] },
  { name: 'Snack', icon: UtensilsCrossed, color: 'from-purple-500 to-purple-700', items: ['Protein bar', 'Greek yogurt', 'Mixed nuts'] },
]

const NutritionPage = () => {
  const navigate = useNavigate()
  const { meals, waterIntake, setWaterIntake, dailyCalorieGoal, addMeal } = useTrimFitStore()
  const { canAccess } = useSubscription()
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })

  const todayMeals = meals.filter(m => new Date(m.date).toDateString() === new Date().toDateString())
  const totalCalories = todayMeals.reduce((s, m) => s + (m.calories || 0), 0)
  const totalProtein = todayMeals.reduce((s, m) => s + (m.protein || 0), 0)
  const totalCarbs = todayMeals.reduce((s, m) => s + (m.carbs || 0), 0)
  const totalFat = todayMeals.reduce((s, m) => s + (m.fat || 0), 0)

  const handleAddMeal = () => {
    addMeal({ ...mealForm, calories: parseInt(mealForm.calories) || 0, protein: parseInt(mealForm.protein) || 0, carbs: parseInt(mealForm.carbs) || 0, fat: parseInt(mealForm.fat) || 0 })
    setMealForm({ name: '', calories: '', protein: '', carbs: '', fat: '' })
    setShowAddMeal(false)
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 glass px-4 py-4">
        <h1 className="text-xl font-bold">Nutrition</h1>
        <p className="text-sm text-gray-400">Track your meals and macros</p>
      </div>
      <div className="px-4 mt-4 space-y-4">
        {/* Calorie Ring */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-center">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(totalCalories / (dailyCalorieGoal || 2000)) * 264} 264`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{totalCalories}</span>
              <span className="text-xs text-gray-400">/ {dailyCalorieGoal || 2000} cal</span>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2">
          {[{ label: 'Protein', value: totalProtein, unit: 'g', color: '#3b82f6' }, { label: 'Carbs', value: totalCarbs, unit: 'g', color: '#10b981' }, { label: 'Fat', value: totalFat, unit: 'g', color: '#f59e0b' }].map(m => (
            <div key={m.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">{m.label}</p>
              <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}{m.unit}</p>
            </div>
          ))}
        </div>

        {/* Water Tracker */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Droplets size={16} className="text-blue-400" /><h3 className="font-bold">Water</h3></div>
            <span className="text-sm text-gray-400">{waterIntake} / 8 glasses</span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <button key={i} onClick={() => setWaterIntake(i + 1)} className={`flex-1 h-8 rounded-lg transition-colors ${i < waterIntake ? 'bg-blue-500/30 border border-blue-500/50' : 'bg-white/5 border border-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Add Meal */}
        {!showAddMeal ? (
          <button onClick={() => setShowAddMeal(true)} className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark rounded-xl font-semibold flex items-center justify-center gap-2"><Plus size={18} /> Log Meal</button>
        ) : (
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
            <input type="text" value={mealForm.name} onChange={e => setMealForm({...mealForm, name: e.target.value})} placeholder="Meal name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
            <div className="grid grid-cols-4 gap-2">
              <input type="number" value={mealForm.calories} onChange={e => setMealForm({...mealForm, calories: e.target.value})} placeholder="Cal" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              <input type="number" value={mealForm.protein} onChange={e => setMealForm({...mealForm, protein: e.target.value})} placeholder="Protein" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              <input type="number" value={mealForm.carbs} onChange={e => setMealForm({...mealForm, carbs: e.target.value})} placeholder="Carbs" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
              <input type="number" value={mealForm.fat} onChange={e => setMealForm({...mealForm, fat: e.target.value})} placeholder="Fat" className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddMeal(false)} className="flex-1 py-2.5 bg-white/5 rounded-xl text-sm">Cancel</button>
              <button onClick={handleAddMeal} className="flex-1 py-2.5 bg-primary rounded-xl text-sm font-bold">Add</button>
            </div>
          </div>
        )}

        {/* Smart Meal Plans upsell */}
        {!canAccess('mealPlans') && (
          <button onClick={() => navigate('/subscription')} className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Target size={20} className="text-amber-400" />
            <div className="flex-1 text-left"><p className="text-sm font-bold text-amber-300">Unlock Smart Meal Plans</p><p className="text-xs text-gray-400">Get AI-personalized meal plans</p></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        )}

        {/* Today's Meals */}
        {todayMeals.length > 0 && (
          <div>
            <h3 className="font-bold mb-2">Today's Meals</h3>
            <div className="space-y-2">
              {todayMeals.map(m => (
                <div key={m.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                  <div><p className="text-sm font-medium">{m.name || 'Meal'}</p><p className="text-xs text-gray-500">P:{m.protein}g C:{m.carbs}g F:{m.fat}g</p></div>
                  <span className="text-sm font-bold">{m.calories} cal</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default NutritionPage
