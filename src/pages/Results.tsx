import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button, Card, ProgressBar } from '../components/ui'
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '../types'
import { clsx } from 'clsx'

export default function Results() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const sessions = useStore(s => s.sessions)
  const session = sessions.find(s => s.id === sessionId)

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Résultats introuvables.</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">Retour au tableau de bord</Button>
      </div>
    )
  }

  const correct = session.questions.filter(q => q.isCorrect)
  const incorrect = session.questions.filter(q => !q.isCorrect)
  const totalTime = Math.round(session.timeSpentSeconds / 60)
  const avgTime = session.questions.length > 0 ? Math.round(session.timeSpentSeconds / session.questions.length) : 0

  // Stats par catégorie
  const byCategory = session.questions.reduce<Record<string, { total: number; correct: number }>>((acc, sq) => {
    const cat = sq.question.category
    if (!acc[cat]) acc[cat] = { total: 0, correct: 0 }
    acc[cat].total++
    if (sq.isCorrect) acc[cat].correct++
    return acc
  }, {})

  const scoreColor = session.score >= 70 ? 'text-green-600' : session.score >= 50 ? 'text-yellow-600' : 'text-red-600'
  const scoreBg = session.score >= 70 ? 'from-green-400 to-green-600' : session.score >= 50 ? 'from-yellow-400 to-orange-500' : 'from-red-400 to-red-600'

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl mx-auto">
      {/* Score hero */}
      <Card className="text-center bg-gradient-to-br from-gray-900 to-gray-800 border-0">
        <div className={clsx('text-7xl font-black mb-2 bg-gradient-to-br bg-clip-text text-transparent', scoreBg)}>
          {session.score}%
        </div>
        <div className={clsx('text-2xl font-bold mb-1', session.passed ? 'text-green-400' : 'text-red-400')}>
          {session.passed ? '🎉 Félicitations !' : '📚 Continue à t\'entraîner'}
        </div>
        <p className="text-gray-400 text-sm mb-6">
          {session.passed
            ? 'Tu as atteint le seuil de réussite de 70%. Excellent travail !'
            : `Il te manque ${70 - session.score} points pour atteindre le seuil de réussite.`}
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            ['✅', `${correct.length}/${session.questions.length}`, 'Bonnes réponses'],
            ['⏱', `${totalTime} min`, 'Temps total'],
            ['⚡', `${avgTime}s`, 'Par question'],
          ].map(([icon, val, label]) => (
            <div key={label} className="bg-white/10 rounded-2xl p-3">
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-lg font-black text-white">{val}</div>
              <div className="text-xs text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">Score obtenu</span>
          <span className={clsx('font-bold', scoreColor)}>{session.score}% {session.passed ? '≥ 70% ✓' : '< 70%'}</span>
        </div>
        <div className="relative">
          <ProgressBar value={session.score} color={session.score >= 70 ? 'success' : session.score >= 50 ? 'warning' : 'danger'} className="h-4" />
          <div className="absolute top-0 left-[70%] h-full w-0.5 bg-gray-800 opacity-50" />
        </div>
        <p className="text-xs text-gray-400 mt-1">Seuil TECFÉE : 70%</p>
      </div>

      {/* Par catégorie */}
      <Card>
        <h2 className="font-bold text-gray-900 mb-4">📊 Résultats par catégorie</h2>
        <div className="flex flex-col gap-3">
          {Object.entries(byCategory).map(([cat, data]) => {
            const pct = Math.round((data.correct / data.total) * 100)
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={clsx('badge text-xs', CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS])}>
                      {CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]} {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                    </span>
                  </div>
                  <span className={clsx('text-sm font-bold', pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600')}>
                    {data.correct}/{data.total} ({pct}%)
                  </span>
                </div>
                <ProgressBar value={pct} color={pct >= 70 ? 'success' : pct >= 50 ? 'warning' : 'danger'} />
              </div>
            )
          })}
        </div>
      </Card>

      {/* Questions incorrectes */}
      {incorrect.length > 0 && (
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">❌ Questions manquées ({incorrect.length})</h2>
          <div className="flex flex-col gap-4">
            {incorrect.slice(0, 5).map((sq, i) => (
              <div key={sq.questionId} className="border border-red-100 bg-red-50 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 mb-2">{sq.question.question}</p>
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-semibold">Ta réponse :</span>
                        <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-lg">{sq.userAnswer || 'Sans réponse'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-semibold">Bonne réponse :</span>
                        <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-lg">{sq.question.correctAnswer}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{sq.question.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
            {incorrect.length > 5 && (
              <button onClick={() => navigate('/review')} className="text-sm text-primary-600 font-medium text-center">
                Voir toutes les erreurs dans Révision →
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary" onClick={() => navigate('/exam')}>📝 Nouvel examen</Button>
        <Button onClick={() => navigate('/dashboard')}>🏠 Tableau de bord</Button>
      </div>
      <Button variant="ghost" fullWidth onClick={() => navigate('/review')}>🔍 Réviser mes erreurs</Button>
    </div>
  )
}
