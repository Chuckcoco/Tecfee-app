import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button, Card, Avatar, LevelBadge, ProgressBar, StatCard } from '../components/ui'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { CATEGORY_LABELS, ALL_BADGES } from '../types'

export default function Profile() {
  const navigate = useNavigate()
  const user = useStore(s => s.user)
  const logout = useStore(s => s.logout)
  const getUserStats = useStore(s => s.getUserStats)
  const [showLogout, setShowLogout] = useState(false)

  const stats = getUserStats()

  const radarData = stats.categoryStats
    .filter(c => c.totalQuestions > 0)
    .map(c => ({ category: CATEGORY_LABELS[c.category].substring(0, 6), score: c.percentage }))

  const xpForNextLevel = ((user?.level || 1)) * 100
  const xpProgress = (user?.xp || 0) % 100

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Profile header */}
      <Card className="bg-gradient-to-br from-primary-600 to-indigo-700 border-0 text-white">
        <div className="flex items-start gap-4">
          <Avatar name={user?.name || 'U'} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black truncate">{user?.name}</h1>
            <p className="text-primary-200 text-sm truncate">{user?.email}</p>
            <div className="mt-2">
              <LevelBadge level={user?.level || 1} />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-primary-200 mb-1">
            <span>Niveau {user?.level} → {(user?.level || 1) + 1}</span>
            <span>{xpProgress}/100 XP</span>
          </div>
          <div className="h-2 bg-primary-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-primary-500">
          {[
            ['🔥', `${user?.streak || 0}j`, 'Streak'],
            ['📝', stats.totalExams, 'Examens'],
            ['💯', `${stats.averageScore}%`, 'Moy.'],
          ].map(([icon, val, label]) => (
            <div key={String(label)} className="text-center">
              <div className="text-base">{icon}</div>
              <div className="font-black text-lg">{val}</div>
              <div className="text-xs text-primary-300">{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Score moyen" value={`${stats.averageScore}%`} icon="🎯" color={stats.averageScore >= 70 ? 'success' : 'warning'} />
        <StatCard label="Meilleur score" value={`${stats.bestScore}%`} icon="🏆" color="warning" />
        <StatCard label="Questions répondues" value={stats.totalQuestions} icon="💬" color="primary" />
        <StatCard label="Chance TECFÉE" value={`${stats.estimatedPassRate}%`} icon="🎓"
          color={stats.estimatedPassRate >= 70 ? 'success' : 'warning'} />
      </div>

      {/* Radar chart */}
      {radarData.length >= 3 && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">🕸 Compétences par catégorie</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <Radar name="Score" dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Badges */}
      <Card>
        <h2 className="font-bold text-gray-900 mb-4">🏅 Badges</h2>
        <div className="grid grid-cols-2 gap-3">
          {ALL_BADGES.map(badge => {
            const earned = user?.badges.find(b => b.id === badge.id)
            return (
              <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${earned ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100 bg-gray-50 opacity-50 grayscale'}`}>
                <span className="text-2xl">{badge.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{badge.name}</p>
                  <p className="text-xs text-gray-500 truncate">{badge.description}</p>
                  {earned && <p className="text-xs text-yellow-600 font-medium mt-0.5">✓ Obtenu</p>}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Actions */}
      <Card>
        <h2 className="font-bold text-gray-900 mb-4">⚙️ Compte</h2>
        <div className="flex flex-col gap-3">
          {user?.isAdmin && (
            <Button variant="secondary" fullWidth onClick={() => navigate('/admin')}>
              ⚙️ Panneau administrateur
            </Button>
          )}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-700">Compte connecté</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <span className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-700">Données sauvegardées</p>
              <p className="text-xs text-gray-500">Localement sur cet appareil</p>
            </div>
            <span className="text-green-600 text-sm">✓</span>
          </div>
          {!showLogout ? (
            <Button variant="danger" fullWidth onClick={() => setShowLogout(true)}>Se déconnecter</Button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700 mb-3 font-medium">Confirmer la déconnexion ?</p>
              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => setShowLogout(false)}>Annuler</Button>
                <Button variant="danger" fullWidth onClick={handleLogout}>Déconnecter</Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
