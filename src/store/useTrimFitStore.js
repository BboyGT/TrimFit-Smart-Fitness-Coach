import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  user: {
    name: '',
    email: '',
    password: '',
    phone: '',
    avatar: '',
    age: null,
    gender: '',
    height: null,
    weight: null,
    goal: '',
    activityLevel: 'moderate',
    workoutDifficulty: 'intermediate',
    createdAt: null,
    authProvider: null,
    socialAvatar: null,
  },
  subscription: {
    plan: 'free',
    status: 'active',
    startDate: null,
    endDate: null,
    trialEndDate: null,
    paymentMethod: null,
    billingHistory: [],
    nextBillingDate: null,
    autoRenew: true,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  },
  onboardingComplete: false,
  isLoggedIn: false,
  measurements: [],
  currentWorkout: null,
  workoutHistory: [],
  meals: [],
  waterIntake: 0,
  waterIntakeDate: null,
  dailyCalorieGoal: 2000,
  achievements: [],
  streaks: {
    current: 0,
    longest: 0,
    lastWorkoutDate: null,
  },
  progressPhotos: [],
  // Challenges
  joinedChallenges: [],
  // Goals
  goals: [],
  // Community
  likedPosts: [],
  showTour: false,
  tourStep: 0,
  notifications: [],
  // Persistent settings
  settings: {
    pushNotifications: true,
    emailNotifications: true,
    workoutReminders: true,
    darkMode: true,
    hapticFeedback: true,
    soundEffects: false,
    autoPlayVideos: true,
    metricUnits: true,
  },
}

const useTrimFitStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // User actions
      setUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),

      completeOnboarding: (userData) => set({
        user: {
          ...get().user,
          ...userData,
          createdAt: new Date().toISOString(),
        },
        onboardingComplete: true,
        isLoggedIn: true,
      }),

      login: async (email, password) => {
        const state = get()

        if (!email || !password) {
          return { success: false, error: 'Email and password are required' }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return { success: false, error: 'Please enter a valid email address' }
        }

        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters' }
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        if (state.user.email === email && state.user.password === password) {
          set({ isLoggedIn: true, user: { ...state.user, authProvider: 'email' } })
          return { success: true }
        }

        return { success: false, error: 'Invalid email or password' }
      },

      register: async (userData) => {
        const { email, password, name } = userData

        if (!email || !password || !name) {
          return { success: false, error: 'All fields are required' }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return { success: false, error: 'Please enter a valid email address' }
        }

        if (password.length < 8) {
          return { success: false, error: 'Password must be at least 8 characters' }
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        set({
          user: {
            ...userData,
            phone: '',
            createdAt: new Date().toISOString(),
            workoutDifficulty: userData.workoutDifficulty || 'intermediate',
            authProvider: 'email',
          },
          onboardingComplete: false,
          isLoggedIn: true,
        })

        return { success: true }
      },

      // Social Login
      socialLogin: async (provider) => {
        const socialProfiles = {
          google: { name: 'Google User', email: 'user@gmail.com', avatar: null },
          facebook: { name: 'Facebook User', email: 'user@facebook.com', avatar: null },
          apple: { name: 'Apple User', email: 'user@icloud.com', avatar: null },
          x: { name: 'X User', email: 'user@x.com', avatar: null },
        }
        const profile = socialProfiles[provider]
        if (!profile) return { success: false, error: 'Invalid provider' }

        await new Promise(resolve => setTimeout(resolve, 800))

        const state = get()
        const needsOnboarding = !state.onboardingComplete && !state.user.name

        set({
          isLoggedIn: true,
          user: {
            ...state.user,
            name: state.user.name || profile.name,
            email: state.user.email || profile.email,
            authProvider: provider,
            socialAvatar: profile.avatar,
          },
          onboardingComplete: state.onboardingComplete || false,
        })
        return { success: true, needsOnboarding }
      },

      // Social Register
      socialRegister: async (provider) => {
        const socialProfiles = {
          google: { name: 'Google User', email: 'user@gmail.com', avatar: null },
          facebook: { name: 'Facebook User', email: 'user@facebook.com', avatar: null },
          apple: { name: 'Apple User', email: 'user@icloud.com', avatar: null },
          x: { name: 'X User', email: 'user@x.com', avatar: null },
        }
        const profile = socialProfiles[provider]
        if (!profile) return { success: false, error: 'Invalid provider' }

        await new Promise(resolve => setTimeout(resolve, 800))

        set({
          isLoggedIn: true,
          user: {
            ...get().user,
            name: profile.name,
            email: profile.email,
            authProvider: provider,
            socialAvatar: profile.avatar,
            phone: '',
            createdAt: new Date().toISOString(),
            workoutDifficulty: 'intermediate',
          },
          onboardingComplete: false,
        })
        return { success: true }
      },

      // Phone Login
      phoneLogin: async (phone) => {
        if (!phone || phone.length < 10) {
          return { success: false, error: 'Please enter a valid phone number' }
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        const state = get()
        const needsOnboarding = !state.onboardingComplete

        set({
          isLoggedIn: true,
          user: {
            ...state.user,
            phone,
            authProvider: 'phone',
          },
          onboardingComplete: state.onboardingComplete || false,
        })
        return { success: true, needsOnboarding }
      },

      // Phone Register
      phoneRegister: async (phone) => {
        if (!phone || phone.length < 10) {
          return { success: false, error: 'Please enter a valid phone number' }
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        set({
          isLoggedIn: true,
          user: {
            ...get().user,
            phone,
            email: '',
            name: '',
            authProvider: 'phone',
            createdAt: new Date().toISOString(),
            workoutDifficulty: 'intermediate',
          },
          onboardingComplete: false,
        })
        return { success: true }
      },

      // Logout - clears session but keeps user data for re-login
      logout: () => set({
        isLoggedIn: false,
        currentWorkout: null,
        showTour: false,
        tourStep: 0,
      }),

      // Delete account - clears everything
      deleteAccount: () => {
        try {
          localStorage.removeItem('trimfit-store')
        } catch {}
        set({ ...initialState })
      },

      // Subscription actions
      setSubscriptionPlan: (planId, interval = 'month') => {
        const now = new Date()
        const startDate = now.toISOString()
        let endDate, nextBilling

        if (planId === 'free') {
          endDate = null
          nextBilling = null
        } else if (interval === 'year') {
          endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString()
          nextBilling = endDate
        } else {
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString()
          nextBilling = endDate
        }

        set((state) => ({
          subscription: {
            ...state.subscription,
            plan: planId,
            status: 'active',
            startDate,
            endDate,
            nextBillingDate: nextBilling,
            interval,
          }
        }))
      },

      cancelSubscription: () => set((state) => ({
        subscription: {
          ...state.subscription,
          status: 'cancelled',
          autoRenew: false,
          endDate: new Date().toISOString(),
        }
      })),

      reactivateSubscription: () => set((state) => ({
        subscription: {
          ...state.subscription,
          status: 'active',
          autoRenew: true,
          endDate: null,
        }
      })),

      updatePaymentMethod: (method) => set((state) => ({
        subscription: {
          ...state.subscription,
          paymentMethod: method,
        }
      })),

      addBillingRecord: (record) => set((state) => ({
        subscription: {
          ...state.subscription,
          billingHistory: [record, ...state.subscription.billingHistory].slice(0, 50),
        }
      })),

      setAutoRenew: (value) => set((state) => ({
        subscription: {
          ...state.subscription,
          autoRenew: value,
          status: value ? 'active' : 'cancelled',
        }
      })),

      // Workout actions
      setCurrentWorkout: (workout) => set({ currentWorkout: workout }),

      completeWorkout: (workout) => {
        const record = {
          ...workout,
          id: Date.now().toString(),
          completedAt: new Date().toISOString(),
        }
        set((state) => ({
          currentWorkout: null,
          workoutHistory: [record, ...state.workoutHistory].slice(0, 500),
          streaks: {
            current: state.streaks.lastWorkoutDate
              ? (Date.now() - new Date(state.streaks.lastWorkoutDate).getTime()) < 86400000 * 2
                ? state.streaks.current + 1
                : 1
              : 1,
            longest: Math.max(state.streaks.longest,
              state.streaks.lastWorkoutDate
                ? (Date.now() - new Date(state.streaks.lastWorkoutDate).getTime()) < 86400000 * 2
                  ? state.streaks.current + 1
                  : 1
                : 1
            ),
            lastWorkoutDate: new Date().toISOString(),
          },
        }))
      },

      // Measurement actions
      addMeasurement: (measurement) => set((state) => ({
        measurements: [...state.measurements, {
          ...measurement,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        }].slice(0, 200),
      })),

      // Nutrition actions
      addMeal: (meal) => set((state) => ({
        meals: [...state.meals, {
          ...meal,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        }].slice(0, 500),
      })),

      setWaterIntake: (amount) => {
        const today = new Date().toDateString()
        const state = get()
        // Reset water intake if it's a new day
        if (state.waterIntakeDate !== today) {
          set({ waterIntake: amount, waterIntakeDate: today })
        } else {
          set({ waterIntake: amount })
        }
      },

      // Achievement actions
      unlockAchievement: (achievement) => set((state) => {
        const exists = state.achievements.some(a => a.id === achievement.id)
        if (exists) return state
        return {
          achievements: [...state.achievements, {
            ...achievement,
            unlockedAt: new Date().toISOString(),
          }],
        }
      }),

      // Photo actions
      addProgressPhoto: (photo) => set((state) => ({
        progressPhotos: [...state.progressPhotos, {
          ...photo,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        }],
      })),

      // Goal actions
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Date.now().toString() }].slice(0, 20),
      })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, ...updates } : g),
  })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id),
      })),

      // Challenge actions
      toggleChallenge: (challengeId) => set((state) => {
        const joined = state.joinedChallenges.includes(challengeId)
        return {
          joinedChallenges: joined
            ? state.joinedChallenges.filter(id => id !== challengeId)
            : [...state.joinedChallenges, challengeId],
        }
      }),

      // Community actions
      togglePostLike: (postId) => set((state) => {
        const liked = state.likedPosts.includes(postId)
        return {
          likedPosts: liked
            ? state.likedPosts.filter(id => id !== postId)
            : [...state.likedPosts, postId],
        }
      }),

      // UI actions
      setShowTour: (show) => set({ showTour: show }),
      setTourStep: (step) => set({ tourStep: step }),

      // Settings actions
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      addNotification: (notification) => set((state) => ({
        notifications: [{
          ...notification,
          id: Date.now().toString(),
          read: false,
          createdAt: new Date().toISOString(),
        }, ...state.notifications].slice(0, 50),
      })),

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'trimfit-store',
      // Exclude password from persistence for security
      partialize: (state) => {
        const { password, ...safeUser } = state.user
        return {
          ...state,
          user: safeUser,
          // Don't persist transient UI state
          currentWorkout: null,
          showTour: false,
          tourStep: 0,
        }
      },
    }
  )
)

export default useTrimFitStore
export { useTrimFitStore }
