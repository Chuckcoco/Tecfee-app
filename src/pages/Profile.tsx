import { useStore } from '../store/useStore'
import { Card, StatCard, LevelBadge } from '../components/ui'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { CATEGORY_LABELS, ALL_BADGES } from '../types'

export default function Profile() {
  const user = useStore(s => s.user)
  const getUserStats = useStore(s => s.getUserStats)
  const stats = getUserStats()

  const radarData = stats.categoryStats
    .filter(c => c.totalQuestions > 0)
    .map(c => ({ category: CATEGORY_LABELS[c.category].substring(0, 6), score: c.percentage }))

  const xpProgress = user.xp % 100

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 border-0 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black">
            {user.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black">{user.name}</h1>
            <div className="mt-1"><LevelBadge level={user.level} /></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-indigo-200 mb-1">
            <span>Niveau {user.level} → {user.level + 1}</span>
            <span>{xpProgress}/100 XP</span>
          </div>
          <div className="h-2 bg-indigo-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-indigo-500 text-center">
          <div>
            <div>🔥</div>
            <div className="font-black text-lg">{user.streak}j</div>
            <div className="text-xs text-indigo-300">Streak</div>
          </div>
          <div>
            <div>📝</div>
            <div className="font-black text-lg">{stats.totalExams}</div>
            <div className="text-xs text-indigo-300">Examens</div>
          </div>
          <div>
            <div>💯</div>
            <div className="font-black text-lg">{stats.averageScore}%</div>
            <div className="text-xs text-indigo-300">Moy.</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Score moyen" value={`${stats.averageScore}%`} icon="🎯" color={stats.averageScore >= 70 ? 'success' : 'warning'} />
        <StatCard label="Meilleur score" value={`${stats.bestScore}%`} icon="🏆" color="warning" />
        <StatCard label="Questions" value={stats.totalQuestions} icon="💬" color="primary" />
        <StatCard label="Chance TECFÉE" value={`${stats.estimatedPassRate}%`} icon="🎓" color={stats.estimatedPassRate >= 70 ? 'success' : 'warning'} />
      </div>

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

      <Card>
        <h2 className="font-bold text-gray-900 mb-4">🏅 Badges</h2>
        <div className="grid grid-cols-2 gap-3">
          {ALL_BADGES.map(badge => {
            const earned = user.badges.find(b => b.id === badge.id)
            return (
              <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-2xl border-2 ${earned ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100 bg-gray-50 opacity-50 grayscale'}`}>
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">{badge.name}</p>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                  {earned && <p className="text-xs text-yellow-600 font-medium mt-0.5">✓ Obtenu</p>}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}