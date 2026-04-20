import React, { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import BottomNav from './components/BottomNav.jsx'
import AppTour from './components/AppTour.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import useTrimFitStore from './store/useTrimFitStore.js'

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'))
const PhoneAuthPage = lazy(() => import('./pages/PhoneAuthPage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const WorkoutPage = lazy(() => import('./pages/WorkoutPage.jsx'))
const WorkoutDetailPage = lazy(() => import('./pages/WorkoutDetailPage.jsx'))
const ExercisesPage = lazy(() => import('./pages/ExercisesPage.jsx'))
const ExerciseDetailPage = lazy(() => import('./pages/ExerciseDetailPage.jsx'))
const MeasurementsPage = lazy(() => import('./pages/MeasurementsPage.jsx'))
const NutritionPage = lazy(() => import('./pages/NutritionPage.jsx'))
const ProgressPage = lazy(() => import('./pages/ProgressPage.jsx'))
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage.jsx'))
const PaymentPage = lazy(() => import('./pages/PaymentPage.jsx'))
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage.jsx'))
const ChallengesPage = lazy(() => import('./pages/ChallengesPage.jsx'))
const CommunityPage = lazy(() => import('./pages/CommunityPage.jsx'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage.jsx'))
const GoalsPage = lazy(() => import('./pages/GoalsPage.jsx'))
const StreaksPage = lazy(() => import('./pages/StreaksPage.jsx'))
const TipsPage = lazy(() => import('./pages/TipsPage.jsx'))
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'))

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    </div>
  )
}

function AuthRoute({ children }) {
  const isLoggedIn = useTrimFitStore((state) => state.isLoggedIn)
  const onboardingComplete = useTrimFitStore((state) => state.onboardingComplete)
  
  if (isLoggedIn) {
    if (!onboardingComplete) {
      return <Navigate to="/onboarding" replace />
    }
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function AppContent() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e] text-white">
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
              <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/phone-auth" element={<PhoneAuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/workout" element={<WorkoutPage />} />
              <Route path="/workout/:id" element={<WorkoutDetailPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
              <Route path="/measurements" element={<MeasurementsPage />} />
              <Route path="/nutrition" element={<NutritionPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/payment/:planId" element={<PaymentPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/streaks" element={<StreaksPage />} />
              <Route path="/tips" element={<TipsPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
        <BottomNav />
        <AppTour />
      </div>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}