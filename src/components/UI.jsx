import { memo, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export const Button = memo(forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/20 hover:opacity-90',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger: 'bg-gradient-to-r from-danger to-danger-dark text-white',
  }
  
  const sizes = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-sm',
    lg: 'py-4 px-6 text-base',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        font-medium rounded-xl flex items-center justify-center gap-2 transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}))

export const Card = memo(({ children, className = '', hover = false, onClick, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`
      bg-white/[0.03] border border-white/5 rounded-2xl p-4
      ${hover ? 'hover:bg-white/[0.05] transition-colors cursor-pointer' : ''}
      ${className}
    `}
    onClick={onClick}
    {...props}
  >
    {children}
  </motion.div>
))

export const Input = memo(forwardRef(({ 
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...props 
}, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-xs text-gray-400 font-medium ml-1">{label}</label>}
    <div className="relative">
      {Icon && (
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full bg-white/5 border border-white/10 rounded-xl 
          pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
          transition-colors
          ${error ? 'border-red-500/50 focus:border-red-500' : ''}
          ${Icon ? '' : 'pl-4'}
          ${className}
        `}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
  </div>
)))

export const Badge = memo(({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-white/5 text-gray-400',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-emerald-500/10 text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-400',
    danger: 'bg-red-500/10 text-red-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    rose: 'bg-rose-500/10 text-rose-400',
  }
  
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
})

export const Avatar = memo(({ src, alt, fallback, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  if (src) {
    return <img src={src} alt={alt} className={`rounded-full object-cover ${sizes[size]} ${className}`} />
  }

  return (
    <div className={`rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-bold ${sizes[size]} ${className}`}>
      {fallback}
    </div>
  )
})

export const Divider = memo(({ text, className = '' }) => (
  <div className={`relative flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px bg-white/10" />
    {text && <span className="text-xs text-gray-500 font-medium">{text}</span>}
    <div className="flex-1 h-px bg-white/10" />
  </div>
))

export const SectionHeader = memo(({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-center justify-between ${className}`}>
    <div>
      <h3 className="font-bold text-base">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <button className="text-xs text-primary hover:underline font-medium">{action}</button>}
  </div>
))

export const StatCard = memo(({ icon: Icon, label, value, subtext, trend }) => (
  <Card className="flex items-center gap-3">
    {Icon && (
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-primary" />
      </div>
    )}
    <div className="min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-bold truncate">{value}</p>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </div>
  </Card>
))

export const LoadingSpinner = memo(({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-4 border-primary/30 border-t-primary rounded-full animate-spin`} />
    </div>
  )
})

export const EmptyState = memo(({ icon: Icon, title, message, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && <Icon size={48} className="text-gray-600 mb-4" />}
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-500 mb-4 max-w-xs">{message}</p>
    {action}
  </div>
))

export const ErrorMessage = memo(({ message, onDismiss }) => (
  <motion.div 
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3"
  >
    <p className="text-sm text-red-400 text-center">{message}</p>
  </motion.div>
))

export const PageHeader = memo(({ title, subtitle, children, className = '' }) => (
  <div className={`sticky top-0 z-10 glass px-4 py-4 ${className}`}>
    <h1 className="text-xl font-bold">{title}</h1>
    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    {children}
  </div>
))