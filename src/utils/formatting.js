export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null
  const heightM = heightCm / 100
  return (weightKg / (heightM * heightM)).toFixed(1)
}

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' }
  if (bmi < 25) return { label: 'Normal', color: '#10b981' }
  if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' }
  return { label: 'Obese', color: '#ef4444' }
}

export const calculateBMR = (weightKg, heightCm, age, gender) => {
  if (!weightKg || !heightCm || !age) return null
  if (gender === 'male') {
    return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age)
  }
  return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age)
}

export const calculateTDEE = (bmr, activityLevel) => {
  if (!bmr) return null
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  }
  return Math.round(bmr * (multipliers[activityLevel] || 1.55))
}

export const calculateCalorieGoal = (tdee, goal) => {
  if (!tdee) return 2000
  switch (goal) {
    case 'lose': return tdee - 500
    case 'gain': return tdee + 300
    default: return tdee
  }
}

export const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: '#10b981',
    intermediate: '#f59e0b',
    advanced: '#ef4444',
  }
  return colors[difficulty] || '#6b7280'
}

export const getMuscleColor = (muscle) => {
  const colors = {
    chest: '#ef4444',
    back: '#3b82f6',
    shoulders: '#f59e0b',
    arms: '#8b5cf6',
    legs: '#10b981',
    core: '#ec4899',
    cardio: '#f97316',
    stretching: '#06b6d4',
  }
  return colors[muscle] || '#6b7280'
}

export const getMuscleColorByMuscle = (muscle) => {
  const map = {
    'Pectoralis Major': '#ef4444',
    'Upper Pectoralis': '#f87171',
    'Lower Pectoralis': '#dc2626',
    'Latissimus Dorsi': '#3b82f6',
    'Erector Spinae': '#1d4ed8',
    'Rhomboids': '#60a5fa',
    'Anterior Deltoid': '#f59e0b',
    'Medial Deltoid': '#fbbf24',
    'Posterior Deltoid': '#d97706',
    'Biceps': '#8b5cf6',
    'Triceps': '#a78bfa',
    'Brachialis': '#7c3aed',
    'Quadriceps': '#10b981',
    'Hamstrings': '#059669',
    'Glutes': '#34d399',
    'Calves': '#047857',
    'Rectus Abdominis': '#ec4899',
    'Obliques': '#f472b6',
  }
  return map[muscle] || '#6b7280'
}

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

export const daysRemaining = (endDate) => {
  if (!endDate) return null
  const end = new Date(endDate)
  const now = new Date()
  const diff = end - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
