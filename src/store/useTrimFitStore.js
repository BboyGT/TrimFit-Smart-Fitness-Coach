import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTrimFitStore = create(
  persist(
    (set, get) => ({
      // User
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
        authProvider: null, // 'email', 'google', 'facebook', 'apple', 'x', 'phone'
        socialAvatar: null,
      },

      // Subscription
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

      // Onboarding
      onboardingComplete: false,
      isLoggedIn: false,

      // Measurements
      measurements: [],

      // Workouts
      currentWorkout: null,
      workoutHistory: [],

      // Nutrition
      meals: [],
      waterIntake: 0,
      dailyCalorieGoal: 2000,

      // Achievements
      achievements: [],

      // Streaks
      streaks: {
        current: 0,
        longest: 0,
        lastWorkoutDate: null,
      },

      // Before/After Photos
      progressPhotos: [],

      // UI
      showTour: false,
      tourStep: 0,
      notifications: [],

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
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Check stored credentials (in real app, this would be server-side)
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

      logout: () => set({ isLoggedIn: false }),

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
          billingHistory: [record, ...state.subscription.billingHistory],
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
          workoutHistory: [record, ...state.workoutHistory],
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
        }],
      })),

      // Nutrition actions
      addMeal: (meal) => set((state) => ({
        meals: [...state.meals, {
          ...meal,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        }],
      })),

      setWaterIntake: (amount) => set({ waterIntake: amount }),

      // Achievement actions
      unlockAchievement: (achievement) => set((state) => ({
        achievements: [...state.achievements, {
          ...achievement,
          unlockedAt: new Date().toISOString(),
        }],
      })),

      // Photo actions
      addProgressPhoto: (photo) => set((state) => ({
        progressPhotos: [...state.progressPhotos, {
          ...photo,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        }],
      })),

      // UI actions
      setShowTour: (show) => set({ showTour: show }),
      setTourStep: (step) => set({ tourStep: step }),

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
    }
  )
)

export default useTrimFitStore
export { useTrimFitStore }
