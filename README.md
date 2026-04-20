# TrimFit — Your Smart Fitness Coach

<p align="center">
  <strong>205+ Exercises · Smart Coaching · Nutrition Tracking · Progress Analytics</strong><br/>
  <em>The all-in-one fitness companion that adapts to your goals</em>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Authentication System](#authentication-system)
- [Subscription Plans](#subscription-plans)
- [Payment System](#payment-system)
- [Exercise Library](#exercise-library)
- [Pages & Routes](#pages--routes)
- [State Management](#state-management)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**TrimFit** is a comprehensive smart fitness coaching application built with React and modern web technologies. It provides users with a complete fitness ecosystem including personalized workout plans, nutrition tracking, body measurements, progress analytics, achievement systems, and premium subscription features. The app is designed with a sleek dark theme and smooth animations to deliver a premium mobile-first experience.

With over 205 professionally categorized exercises, smart workout generation, and multiple authentication methods, TrimFit is built to scale from a personal project into a full production application ready for the Google Play Store and Apple App Store.

---

## Features

### Authentication & User Management
- **6 Sign-In/Sign-Up Methods:**
  - Email & Password (with strength indicator and validation)
  - Google OAuth
  - Facebook Login
  - Apple Sign In
  - X (Twitter) Login
  - Phone Number with OTP Verification (15+ country codes)
- **Multi-step Onboarding** with personalized fitness profile setup
- **Forgot Password** flow with email reset instructions
- **Persistent Sessions** via Zustand + localStorage
- **Remember Me** toggle for email login
- **Terms of Service & Privacy Policy** agreement during registration

### Smart Workouts
- **205+ exercises** across 7 categories (Abs, Back, Chest, Legs, Shoulders, Arms, Cardio)
- **20+ preset workout plans** tailored to different goals and difficulty levels
- **Smart workout generation** based on user profile and goals
- **Exercise detail pages** with YouTube video demonstrations
- **Active workout tracking** with timer, rep counter, and set management

### Nutrition & Health
- **Meal logging** with calorie and macro tracking
- **Water intake** tracking with daily goals
- **Customizable daily calorie targets**
- **Nutrition analytics** and breakdowns

### Progress & Analytics
- **Body measurement tracking** (weight, waist, chest, arms, thighs, etc.)
- **Progress charts** with weekly and monthly views
- **Before & after photo comparison**
- **Streak tracking** with current and longest streak records
- **Achievement/badge system** for milestones

### Subscription & Payments
- **3 subscription tiers** — Free, Basic ($4.99/mo), Pro ($9.99/mo)
- **Monthly & yearly billing** with savings calculator
- **5 payment methods** — Credit/Debit Card, PayPal, Apple Pay, Google Pay, Bank Transfer
- **3-step checkout flow** — method selection → payment details → confirmation
- **Payment success page** with confetti animation and receipt
- **Subscription management** — upgrade, cancel, reactivate
- **Auto-renewal toggle**
- **7-day and 14-day free trials** for Basic and Pro plans

### Social & Community
- **Community feed** for sharing progress and motivation
- **Fitness challenges** to compete with other users
- **Smart coaching tips** and personalized recommendations
- **Push notifications** for reminders and updates

### UI/UX
- **Dark premium theme** with gradient accents
- **Framer Motion animations** throughout the app
- **Glassmorphism navigation** bar
- **Responsive mobile-first design**
- **App tour** for new users
- **Lazy-loaded routes** for performance
- **Smooth page transitions**

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI library |
| **Vite** | 8.x | Build tool & dev server |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Zustand** | 5.x | State management with persistence |
| **Framer Motion** | 12.x | Animations & transitions |
| **React Router DOM** | 7.x | Client-side routing (HashRouter) |
| **Lucide React** | 1.x | Icon library |
| **Stripe.js** | 9.x | Payment processing SDK |

---

## Project Structure

```
trimfit-project/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── AppTour.jsx              # Interactive onboarding tour
│   │   └── BottomNav.jsx            # Bottom navigation bar
│   ├── data/
│   │   ├── exercises.js             # 205+ exercise definitions
│   │   └── plans.js                 # Subscription plans & payment methods
│   ├── hooks/
│   │   └── useSubscription.js       # Subscription logic hook
│   ├── pages/
│   │   ├── LoginPage.jsx            # Email login + social auth
│   │   ├── RegisterPage.jsx         # Email registration + social auth
│   │   ├── PhoneAuthPage.jsx        # Phone OTP verification
│   │   ├── ForgotPasswordPage.jsx   # Password reset flow
│   │   ├── OnboardingPage.jsx       # New user onboarding (4 steps)
│   │   ├── HomePage.jsx             # Landing page
│   │   ├── DashboardPage.jsx        # Main dashboard
│   │   ├── WorkoutPage.jsx          # Workout list
│   │   ├── WorkoutDetailPage.jsx    # Workout detail & start
│   │   ├── ExercisesPage.jsx        # Exercise browser
│   │   ├── ExerciseDetailPage.jsx   # Exercise detail with video
│   │   ├── NutritionPage.jsx        # Meal & water tracking
│   │   ├── MeasurementsPage.jsx     # Body measurement logging
│   │   ├── ProgressPage.jsx         # Progress charts & photos
│   │   ├── SubscriptionPage.jsx     # Plan comparison & selection
│   │   ├── PaymentPage.jsx          # 3-step checkout flow
│   │   ├── PaymentSuccessPage.jsx   # Payment confirmation
│   │   ├── ProfilePage.jsx          # User profile & settings
│   │   ├── SettingsPage.jsx         # App settings
│   │   ├── AchievementsPage.jsx     # Badge/achievement gallery
│   │   ├── ChallengesPage.jsx       # Fitness challenges
│   │   ├── CommunityPage.jsx        # Social community feed
│   │   ├── NotificationsPage.jsx    # Notification center
│   │   ├── GoalsPage.jsx            # Goal setting & tracking
│   │   ├── StreaksPage.jsx          # Workout streak tracker
│   │   ├── TipsPage.jsx             # Smart coaching tips
│   │   ├── TermsPage.jsx            # Terms of Service
│   │   └── PrivacyPage.jsx          # Privacy Policy
│   ├── store/
│   │   └── useTrimFitStore.js       # Zustand store (all state)
│   ├── utils/
│   │   └── formatting.js            # Currency, date formatters
│   ├── App.jsx                      # Root component with routes
│   └── main.jsx                     # Entry point
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+ or **yarn** 1.22+

### Installation

```bash
# Clone or extract the project
cd trimfit-project

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

The production build outputs to the `dist/` directory.

---

## Authentication System

TrimFit supports **6 authentication methods** with a unified user experience:

### 1. Email & Password
- Full registration with name, email, password, and confirm password
- Real-time password strength indicator (Weak / Fair / Good / Strong)
- Password validation rules: 8+ characters, uppercase, lowercase, number
- "Remember Me" checkbox and "Forgot Password" flow
- Demo mode allows any valid email/password (6+ chars) for testing

### 2. Google OAuth
- One-click sign-in/sign-up with Google account
- Uses OAuth 2.0 flow (production: implement with Google Identity Services)

### 3. Facebook Login
- One-click sign-in/sign-up with Facebook account
- Uses Facebook Login SDK (production: implement with Facebook Graph API)

### 4. Apple Sign In
- One-click sign-in/sign-up with Apple ID
- Uses Sign in with Apple JS SDK (production: implement with Apple Developer)

### 5. X (Twitter) Login
- One-click sign-in/sign-up with X account
- Uses OAuth 2.0 (production: implement with X API v2)

### 6. Phone Number (SMS OTP)
- 15+ country code selection with search
- 6-digit OTP verification with auto-focus
- Paste support for OTP codes
- Countdown timer for resend (60 seconds)
- Demo code: `123456`
- Sign In / Sign Up mode toggle

### Production Integration Notes

For production deployment, each social auth provider needs:
- API keys and secrets from the respective developer console
- Backend OAuth callback endpoints
- Token verification and user data extraction
- Account linking for users with multiple auth methods

---

## Subscription Plans

| Feature | Free | Basic ($4.99/mo) | Pro ($9.99/mo) |
|---|---|---|---|
| Workout tracking | 3 sessions/week | Unlimited | Unlimited |
| Workout plans | 5 presets | 20+ plans | 20+ custom |
| Exercise library | 50 exercises | 205 exercises | 205 exercises |
| Smart recommendations | ❌ | ✅ | ✅ |
| Body measurements | ❌ | ✅ | ✅ |
| Nutrition logging | ❌ | Basic | Advanced + Macros |
| Meal plans | ❌ | ❌ | ✅ Smart AI |
| Achievement system | ❌ | ✅ | ✅ |
| Progress reports | ❌ | Weekly | Monthly |
| Video demos | ❌ | ❌ | ✅ |
| Data export | ❌ | ❌ | ✅ CSV/PDF |
| Free trial | — | 7 days | 14 days |

Yearly plans available with 33% savings (Basic: $39.99/yr, Pro: $79.99/yr).

---

## Payment System

### Supported Payment Methods
1. **Credit/Debit Card** — Visa, Mastercard, Amex, Discover (via Stripe)
2. **PayPal** — Secure PayPal checkout
3. **Apple Pay** — Quick checkout on Apple devices
4. **Google Pay** — Fast checkout with Google account
5. **Bank Transfer** — Direct bank payment (2-3 business days)

### Checkout Flow
1. **Step 1** — Select payment method
2. **Step 2** — Enter payment details (card form, PayPal redirect, etc.)
3. **Step 3** — Review & confirm payment

### Multi-Currency Support
USD, EUR, GBP, CAD, AUD, NGN — with proper symbol and formatting.

---

## Exercise Library

205+ exercises organized into 7 categories:

| Category | Count | Examples |
|---|---|---|
| **Abs** | 30+ | Crunches, Planks, Leg Raises, Russian Twists |
| **Back** | 30+ | Pull-ups, Rows, Deadlifts, Lat Pulldowns |
| **Chest** | 30+ | Push-ups, Bench Press, Flyes, Dips |
| **Legs** | 30+ | Squats, Lunges, Leg Press, Calf Raises |
| **Shoulders** | 30+ | Overhead Press, Lateral Raises, Shrugs |
| **Arms** | 30+ | Bicep Curls, Tricep Dips, Hammer Curls |
| **Cardio** | 25+ | Running, Jump Rope, Burpees, HIIT |

Each exercise includes:
- Name, category, difficulty level, target muscle groups
- Equipment requirements
- Step-by-step instructions
- YouTube video ID for demonstration
- Estimated calories burned per rep
- Sets, reps, and rest time recommendations

---

## Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home / Landing | ❌ |
| `/login` | Sign In | ❌ |
| `/register` | Create Account | ❌ |
| `/phone-auth` | Phone OTP Auth | ❌ |
| `/forgot-password` | Reset Password | ❌ |
| `/onboarding` | New User Setup | ✅ |
| `/dashboard` | Main Dashboard | ✅ |
| `/workout` | Workout List | ✅ |
| `/workout/:id` | Workout Detail | ✅ |
| `/exercises` | Exercise Browser | ✅ |
| `/exercise/:id` | Exercise Detail | ✅ |
| `/nutrition` | Nutrition Tracker | ✅ |
| `/measurements` | Body Measurements | ✅ |
| `/progress` | Progress & Photos | ✅ |
| `/subscription` | Plan Management | ✅ |
| `/payment/:planId` | Checkout | ✅ |
| `/payment-success` | Payment Confirmation | ✅ |
| `/profile` | User Profile | ✅ |
| `/settings` | App Settings | ✅ |
| `/achievements` | Achievements | ✅ |
| `/challenges` | Challenges | ✅ |
| `/community` | Community Feed | ✅ |
| `/notifications` | Notifications | ✅ |
| `/goals` | Goal Setting | ✅ |
| `/streaks` | Streak Tracker | ✅ |
| `/tips` | Coaching Tips | ✅ |
| `/terms` | Terms of Service | ❌ |
| `/privacy` | Privacy Policy | ❌ |

---

## State Management

All application state is managed through **Zustand** with `persist` middleware (localStorage):

- **User state** — profile, auth provider, login status
- **Subscription state** — plan, status, billing history, auto-renewal
- **Workout state** — current workout, history, streaks
- **Nutrition state** — meals, water intake, calorie goals
- **Body state** — measurements, progress photos
- **UI state** — tour progress, notifications

The store is defined in `src/store/useTrimFitStore.js` and exported as both default and named export for maximum flexibility.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is proprietary software. All rights reserved.

---

<p align="center">
  <strong>TrimFit</strong> — Your Smart Fitness Coach<br/>
  Built with React · Vite · Tailwind CSS · Zustand · Framer Motion
</p>
