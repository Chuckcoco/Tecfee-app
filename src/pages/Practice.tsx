import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button, Card } from '../components/ui'
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '../types'
import type { Category } from '../types'
import { clsx } from 'clsx'

const CATEGORIES: Category[] = ['grammaire', 'orthographe', 'syntaxe', 'ponctuation', 'vocabulaire', 'accords', 'comprehension', 'redaction']

export default function Practice() {
  const navigate = useNavigate()
  const startExam = useStore(s => s.startExam)
  const getUserStats = useStore(s => s.getUserStats)
  const stats = getUserStats()

  const [selected, setSelected] = useState<Category | null>(null)

  // Trier par taux le plus bas pour suggérer les catégories à améliorer
  const categoryStats = stats.categoryStats.sort((a, b) => a.percentage - b.percentage)
  const weakCats = categoryStats.filter(c => c.totalQuestions > 0).slice(0, 3)

  const handleStart = (cat: Category) => {
    startExam('category', cat, 15)
    navigate('/exam')
  }

  const handleRandom = () => {
    startExam('practice', undefined, 10)
    navigate('/exam')
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">⚡ Pratique rapide</h1>
        <p className="text-gray-500 mt-1">Entraîne-toi par catégorie ou avec un quiz aléatoire</p>
      </div>

      {/* Suggestions */}
      {weakCats.length > 0 && (
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <h2 className="font-bold text-orange-800 mb-3">🎯 Catégories à améliorer en priorité</h2>
          <div className="flex flex-col gap-2">
            {weakCats.map(c => (
              <button key={c.category} onClick={() => handleStart(c.category)}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-100 hover:border-orange-300 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{CATEGORY_ICONS[c.category]}</span>
                  <span className="font-medium text-gray-800">{CATEGORY_LABELS[c.category]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx('text-sm font-bold', c.percentage < 50 ? 'text-red-600' : 'text-yellow-600')}>
                    {c.percentage}%
                  </span>
                  <span className="text-orange-500">→</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Quick quiz */}
      <button onClick={handleRandom}
        className="flex items-center gap-4 p-5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl text-white text-left hover:shadow-lg hover:shadow-primary-200 transition-all active:scale-98">
        <div className="text-4xl">🎲</div>
        <div>
          <h3 className="font-bold text-lg">Quiz aléatoire</h3>
          <p className="text-primary-200 text-sm">10 questions · Toutes catégories · ~10 min</p>
        </div>
        <div className="ml-auto text-2xl opacity-80">→</div>
      </button>

      {/* Toutes les catégories */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3">📚 Toutes les catégories</h2>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(cat => {
            const catStat = stats.categoryStats.find(c => c.category === cat)
            const pct = catStat?.totalQuestions ? catStat.percentage : null

            return (
              <button key={cat} onClick={() => handleStart(cat)}
                className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all text-left active:scale-95">
                <div className="flex items-center justify-between">
                  <span className={clsx('badge text-xs', CATEGORY_COLORS[cat])}>
                    {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                  </span>
                  {pct !== null && (
                    <span className={clsx('text-xs font-bold', pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600')}>
                      {pct}%
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {catStat?.totalQuestions ? `${catStat.totalQuestions} questions pratiquées` : 'Pas encore pratiqué'}
                </div>
                {pct !== null && (
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={clsx('h-full rounded-full transition-all', pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${pct}%` }} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mode révision */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🔁</div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900">Mode révision</h3>
            <p className="text-sm text-blue-700">Révise les questions que tu as manquées lors de tes examens précédents</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/review')} className="flex-shrink-0">
            Réviser →
          </Button>
        </div>
      </Card>
    </div>
  )
}
