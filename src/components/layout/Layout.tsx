import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { Avatar } from '../ui'
import { clsx } from 'clsx'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Accueil' },
  { to: '/exam', icon: '📝', label: 'Examen' },
  { to: '/practice', icon: '⚡', label: 'Pratique' },
  { to: '/review', icon: '🔍', label: 'Révision' },
  { to: '/profile', icon: '👤', label: 'Profil' },
]

export default function Layout() {
  const user = useStore(s => s.user)
  const logout = useStore(s => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">
      {/* Header desktop */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-lg font-black">T</div>
          <span className="font-bold text-gray-900 text-lg">TECFÉE Pratique</span>
        </div>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          {user?.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => clsx('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all', isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-100')}>
              <span>⚙️</span><span>Admin</span>
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-1.5">
            <span className="text-orange-500">🔥</span>
            <span className="text-sm font-bold text-orange-600">{user?.streak || 0}</span>
          </div>
          <div className="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-1.5">
            <span className="text-primary-500">⭐</span>
            <span className="text-sm font-bold text-primary-600">{user?.xp || 0} XP</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all">
            <Avatar name={user?.name || 'U'} size="sm" />
            <span className="hidden lg:block">{user?.name}</span>
          </button>
        </div>
      </header>

      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-black">T</div>
          <span className="font-bold text-gray-900">TECFÉE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-orange-50 rounded-xl px-2.5 py-1">
            <span className="text-orange-500 text-sm">🔥</span>
            <span className="text-xs font-bold text-orange-600">{user?.streak || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-50 rounded-xl px-2.5 py-1">
            <span className="text-primary-500 text-sm">⭐</span>
            <span className="text-xs font-bold text-primary-600">{user?.xp || 0}</span>
          </div>
          <Avatar name={user?.name || 'U'} size="sm" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 py-6 page-enter">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 safe-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => clsx(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[52px]',
                isActive ? 'text-primary-600' : 'text-gray-400'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
