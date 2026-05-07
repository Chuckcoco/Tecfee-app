import { useStore } from '../store/useStore'
import { Card, StatCard, LevelBadge, ProgressBar } from '../components/ui'
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
            <div className="h-full bg-yellow-400 rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-indigo-500">
          {([['🔥', `${user.streak}j`, 'Streak'], ['📝', stats.totalExams, 'Examens'], ['💯', `${stats.averageScore}%`, 'Moy.']] as const).map(([icon, val, label]) => (
            <div key={label} className="text-center">
              <div>{icon}</div>
              <div className="font-black text-lg">{val}</div>
              <div className="text-xs text-indigo-300">{label}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Score moyen" value={`${stats.averageScore}%`} icon="🎯" color={stats.averageScore >= 70 ? 'success' : 'warning'} />
        <StatCard label="Meilleur score" value={`${stats.bestScore}%`} icon="🏆" color="warning" />
        <StatCard label="Questions répondues" value={stats.totalQuestions} icon="💬" color="primary" />
        <StatCard label="Chance TECFÉE" value={`${stats.estimatedPassRate}%`} icon="🎓" color={stats.estimatedPassRate >= 70 ? 'success' : 'warning'} />
      </div>

      {radarData.length >= 3 && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">🕸 Compétences par catégorie</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />