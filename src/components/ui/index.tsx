// ──────────────────────────────────────────────────────────────
// COMPOSANTS UI RÉUTILISABLES
// ──────────────────────────────────────────────────────────────
import { clsx } from 'clsx'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

// ── BUTTON ────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, fullWidth, children, className, disabled, ...props }: ButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    ghost: 'btn bg-transparent text-gray-600 hover:bg-gray-100',
  }
  const sizes = { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', xl: 'btn-xl' }

  return (
    <button
      className={clsx(variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

// ── CARD ──────────────────────────────────────────────────────
export function Card({ children, className, hover, onClick }: { children: ReactNode; className?: string; hover?: boolean; onClick?: () => void }) {
  return (
    <div className={clsx(hover ? 'card-hover' : 'card', className)} onClick={onClick}>
      {children}
    </div>
  )
}

// ── BADGE ─────────────────────────────────────────────────────
type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'gray'
export function Badge({ children, variant = 'gray', className }: { children: ReactNode; variant?: BadgeVariant; className?: string }) {
  return <span className={clsx(`badge-${variant}`, className)}>{children}</span>
}

// ── PROGRESS BAR ─────────────────────────────────────────────
export function ProgressBar({ value, max = 100, className, color = 'primary' }: { value: number; max?: number; className?: string; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const colors: Record<string, string> = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  }
  return (
    <div className={clsx('progress-bar', className)}>
      <div className={clsx('progress-fill', colors[color] || colors.primary)} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ── INPUT ─────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}
export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input className={clsx('input', icon && 'pl-10', error && 'border-red-300 focus:ring-red-400', className)} {...props} />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── STAT CARD ─────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = 'primary', sub }: { label: string; value: string | number; icon: string; color?: string; sub?: string }) {
  const colors: Record<string, string> = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-orange-500',
    danger: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  }
  return (
    <div className="card flex items-center gap-4">
      <div className={clsx('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl flex-shrink-0', colors[color] || colors.primary)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── MODAL ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">✕</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── AVATAR ────────────────────────────────────────────────────
export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }
  return (
    <div className={clsx('rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0', sizes[size])}>
      {initials}
    </div>
  )
}

// ── SCORE RING ────────────────────────────────────────────────
export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = 45
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444'

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
        className="rotate-90" style={{ transform: 'rotate(90deg) translate(0, -100px)', fontSize: '20px', fontWeight: 'bold', fill: color, transformOrigin: '50px 50px' }}>
      </text>
    </svg>
  )
}

// ── EMPTY STATE ───────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: { icon: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-6">{description}</p>
      {action}
    </div>
  )
}

// ── LOADING SPINNER ───────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return <div className={clsx('w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin', className)} />
}

// ── LEVEL BADGE ───────────────────────────────────────────────
export function LevelBadge({ level }: { level: number }) {
  const colors = ['', 'from-gray-400 to-gray-500', 'from-green-400 to-green-500', 'from-blue-400 to-blue-500', 'from-purple-400 to-purple-500', 'from-yellow-400 to-orange-500']
  const names = ['', 'Débutant', 'Apprenti', 'Intermédiaire', 'Avancé', 'Expert']
  const idx = Math.min(level, colors.length - 1)
  return (
    <span className={clsx('inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r', colors[idx] || colors[colors.length - 1])}>
      ⭐ Niv. {level} · {names[idx] || 'Maître'}
    </span>
  )
}
