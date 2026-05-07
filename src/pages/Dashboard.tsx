import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button, Card, StatCard, ProgressBar, EmptyState, LevelBadge } from '../components/ui'
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '../types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useStore(s => s.user)
  const getUserStats = useStore(s => s.getUserStats)
  const sessions = useStore(s => s.sessions)
  const stats = getUserStats()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  const recentSessions = sessions
    .filter(s => s.status === 'completed' && s.userId === user?.id)
    .slice(-5)
    .reverse()

  const chartData = stats.recentScores.map(s => ({
    date: format(new Date(s.date), 'd MMM', { locale: fr }),
    score: s.score,
  }))

  const weakCategories = stats.categoryStats
    .filter(c => c.totalQuestions > 0)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3)

  const strongCategories = stats.categoryStats
    .filter(c => c.totalQuestions > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{greeting()}, {user?.name?.split(' ')[0]} ! 👋</h1>
          <div className="flex items-center gap-3 mt-2">
            <LevelBadge level={user?.level || 1} />
            {user?.streak ? (
              <span className="inline-flex items-center gap-1 text-sm text-orange-600 font-medium">
                🔥 {user.streak} jour{user.streak > 1 ? 's' : ''} consécutif{user.streak > 1 ? 's' : ''}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex gap-3">
          <Button size="md" onClick={() => navigate('/exam')} className="flex-1 sm:flex-none">
            📝 Nouvel examen
          </Button>
          <Button variant="secondary" size="md" onClick={() => navigate('/practice')} className="flex-1 sm:flex-none">
            ⚡ Pratique rapide
          </Button>
        </div>
      </div>

      {/* XP Progress */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">⭐ Progression XP</span>
          <span className="text-sm text-gray-500">{user?.xp || 0} / {((user?.level || 1)) * 100} XP</span>
        </div>
        <ProgressBar value={(user?.xp || 0) % 100} max={100} />
        <p className="text-xs text-gray-400 mt-1.5">Niveau {user?.level || 1} → {(user?.level || 1) + 1} : encore {100 - ((user?.xp || 0) % 100)} XP</p>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Examens complétés" value={stats.totalExams} icon="📝" color="primary" />
        <StatCard label="Score moyen" value={`${stats.averageScore}%`} icon="🎯" color={stats.averageScore >= 70 ? 'success' : 'warning'} />
        <StatCard label="Meilleur score" value={`${stats.bestScore}%`} icon="🏆" color="warning" />
        <StatCard label="Chance de réussite" value={`${stats.estimatedPassRate}%`} icon="🎓"
          color={stats.estimatedPassRate >= 70 ? 'success' : stats.estimatedPassRate >= 40 ? 'warning' : 'danger'}
          sub="TECFÉE estimé" />
      </div>

      {/* Chart + Quick stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart */}
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">📈 Évolution des scores</h2>
          {chartData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v: number) => [`${v}%`, 'Score']} />
                <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon="📈" title="Pas encore de données" description="Complète quelques examens pour voir ta progression ici." />
          )}
        </Card>

        {/* Catégories */}
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">🎯 Points à améliorer</h2>
          {weakCategories.length > 0 ? (
            <div className="flex flex-col gap-3">
              {weakCategories.map(c => (
                <div key={c.category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{CATEGORY_ICONS[c.category]}</span>
                      <span className="text-sm font-medium text-gray-700">{CATEGORY_LABELS[c.category]}</span>
                    </div>
                    <span className={`text-sm font-bold ${c.percentage < 50 ? 'text-red-600' : 'text-yellow-600'}`}>{c.percentage}%</span>
                  </div>
                  <ProgressBar value={c.percentage} color={c.percentage < 50 ? 'danger' : 'warning'} />
                </div>
              ))}
              <button onClick={() => navigate('/practice')} className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-2 text-left">
                → S'entraîner sur ces catégories
              </button>
            </div>
          ) : (
            <EmptyState icon="🎯" title="Commencez par un examen" description="Vos catégories faibles apparaîtront ici." />
          )}
        </Card>
      </div>

      {/* Recent exams */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">📋 Examens récents</h2>
          {recentSessions.length > 0 && (
            <button onClick={() => navigate('/review')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">Voir tout →</button>
          )}
        </div>
        {recentSessions.length === 0 ? (
          <EmptyState icon="📋" title="Aucun examen complété" description="Commence ta préparation avec un premier examen simulé !"
            action={<Button onClick={() => navigate('/exam')}>Commencer un examen</Button>} />
        ) : (
          <div className="flex flex-col gap-3">
            {recentSessions.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/results/${s.id}`)}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${s.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {s.score}%
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {s.examType === 'full' ? 'Examen complet' : s.examType === 'practice' ? 'Pratique rapide' : `Catégorie: ${s.category}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.questions.length} questions · {Math.round(s.timeSpentSeconds / 60)} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {s.passed ? '✓ Réussi' : '✗ Échoué'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Category overview */}
      {strongCategories.length > 0 && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">💪 Tes points forts</h2>
          <div className="grid grid-cols-3 gap-3">
            {strongCategories.map(c => (
              <div key={c.category} className={`flex flex-col items-center gap-1 p-3 rounded-xl text-center ${CATEGORY_COLORS[c.category]}`}>
                <span className="text-2xl">{CATEGORY_ICONS[c.category]}</span>
                <span className="text-xs font-semibold">{CATEGORY_LABELS[c.category]}</span>
                <span className="text-sm font-black">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Badges */}
      {user?.badges && user.badges.length > 0 && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">🏅 Badges obtenus</h2>
          <div className="flex flex-wrap gap-3">
            {user.badges.map(b => (
              <div key={b.id} className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl px-3 py-2">
                <span className="text-xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-800">{b.name}</p>
                  <p className="text-xs text-gray-500">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
