import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button, Card } from '../components/ui'
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '../types'
import type { Category } from '../types'
import { clsx } from 'clsx'

const CATEGORIES: Category[] = ['grammaire', 'orthographe', 'syntaxe', 'ponctuation', 'vocabulaire', 'accords', 'comprehension', 'redaction']

const TECFEE_SECTIONS = [
  {
    id: 'A',
    label: 'Orthographe grammaticale et morphologie',
    icon: '📝',
    categories: ['accords', 'orthographe', 'grammaire'] as Category[],
    maxScore: 26,
    tip: 'Accords du participe passé, adjectifs, tout/même/quelque, verbes irréguliers',
    score1: Math.round(19/26*100),
    score2: Math.round(15/26*100),
  },
  {
    id: 'B',
    label: 'Syntaxe et ponctuation',
    icon: '🔗',
    categories: ['syntaxe', 'ponctuation'] as Category[],
    maxScore: 13,
    tip: 'Construction des phrases, pronoms relatifs, connecteurs, virgule',
    score1: Math.round(8/13*100),
    score2: Math.round(8/13*100),
  },
  {
    id: 'C',
    label: 'Orthographe lexicale',
    icon: '🔤',
    categories: ['orthographe', 'vocabulaire'] as Category[],
    maxScore: 4,
    tip: 'Orthographe des mots, homophones, anglicismes à corriger',
    score1: Math.round(3/4*100),
    score2: Math.round(4/4*100),
  },
  {
    id: 'D',
    label: 'Vocabulaire',
    icon: '💬',
    categories: ['vocabulaire', 'redaction'] as Category[],
    maxScore: 17,
    tip: 'Paronymes, synonymes, registres de langue, figures de style',
    score1: Math.round(10/17*100),
    score2: Math.round(11/17*100),
  },
]

export default function Practice() {
  const navigate = useNavigate()
  const startExam = useStore(s => s.startExam)
  const getUserStats = useStore(s => s.getUserStats)
  const stats = getUserStats()
  const [activeTab, setActiveTab] = useState<'tecfee' | 'categories'>('tecfee')

  const handleStartSection = (categories: Category[]) => {
    startExam('category', categories[0], 20)
    navigate('/exam')
  }

  const handleStartCategory = (cat: Category) => {
    startExam('category', cat, 15)
    navigate('/exam')
  }

  const handleRandom = () => {
    startExam('practice', undefined, 30)
    navigate('/exam')
  }

  const sectionsWithAvg = TECFEE_SECTIONS.map(s => ({
    ...s,
    avg: Math.round((s.score1 + s.score2) / 2),
    trend: s.score2 > s.score1 ? '↑' : s.score2 < s.score1 ? '↓' : '→',
  })).sort((a, b) => a.avg - b.avg)

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">⚡ Pratique</h1>
        <p className="text-gray-500 mt-1">Entraîne-toi par section TECFÉE ou par catégorie</p>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        <button onClick={() => setActiveTab('tecfee')}
          className={clsx('flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all',
            activeTab === 'tecfee' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
          🎯 Sections TECFÉE
        </button>
        <button onClick={() => setActiveTab('categories')}
          className={clsx('flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all',
            activeTab === 'categories' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
          📚 Par catégorie
        </button>
      </div>

      {activeTab === 'tecfee' && (
        <>
          {/* Résumé des vrais résultats */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h2 className="font-bold text-indigo-900 mb-1">📊 Tes résultats récents au TECFÉE</h2>
            <p className="text-xs text-indigo-600 mb-3">Seuil de réussite : 70% — basé sur tes 2 derniers examens officiels</p>
            <div className="grid grid-cols-2 gap-2">
              {TECFEE_SECTIONS.map(s => {
                const avg = Math.round((s.score1 + s.score2) / 2)
                const trend = s.score2 > s.score1 ? '↑' : s.score2 < s.score1 ? '↓' : '→'
                return (
                  <div key={s.id} className="bg-white rounded-xl p-3 border border-indigo-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-600">Section {s.id}</span>
                      <span className={clsx('text-xs font-bold', avg >= 70 ? 'text-green-600' : avg >= 60 ? 'text-yellow-600' : 'text-red-600')}>
                        {avg}% <span className="text-gray-400">{trend}</span>
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={clsx('h-full rounded-full', avg >= 70 ? 'bg-green-500' : avg >= 60 ? 'bg-yellow-400' : 'bg-red-500')}
                        style={{ width: `${avg}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Ex.1: {s.score1}%</span>
                      <span>Ex.2: {s.score2}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Sections triées par priorité */}
          <div>
            <h2 className="font-bold text-gray-900 mb-1">🎯 Entraînement ciblé</h2>
            <p className="text-xs text-gray-500 mb-3">Sections classées de la plus faible à la plus forte</p>
            <div className="flex flex-col gap-3">
              {sectionsWithAvg.map((s, i) => {
                const isWeak = s.avg < 70
                const isFirst = i === 0
                return (
                  <div key={s.id} className={clsx('rounded-2xl border p-4',
                    isFirst ? 'bg-red-50 border-red-200' :
                    isWeak ? 'bg-orange-50 border-orange-200' :
                    'bg-green-50 border-green-200')}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={clsx('text-xs font-bold px-1.5 py-0.5 rounded',
                              isFirst ? 'bg-red-100 text-red-700' :
                              isWeak ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700')}>
                              Section {s.id}
                            </span>
                            {isFirst && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">⚠ Priorité 1</span>}
                            {isWeak && !isFirst && <span className="text-xs bg-orange-400 text-white px-1.5 py-0.5 rounded font-bold">À travailler</span>}
                          </div>
                          <p className="font-bold text-gray-900 text-sm mt-0.5">{s.label}</p>
                        </div>
                      </div>
                      <span className={clsx('text-xl font-black',
                        s.avg >= 70 ? 'text-green-600' : s.avg >= 60 ? 'text-yellow-600' : 'text-red-600')}>
                        {s.avg}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 ml-11">{s.tip}</p>
                    <div className="flex gap-2 ml-11">
                      <button onClick={() => handleStartSection(s.categories)}
                        className={clsx('flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all active:scale-95 shadow-sm',
                          isWeak ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-500 hover:bg-gray-600')}>
                        S'entraîner — 20 questions →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Examen simulé complet */}
          <button onClick={handleRandom}
            className="flex items-center gap-4 p-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white text-left hover:shadow-lg transition-all active:scale-98">
            <div className="text-4xl">📋</div>
            <div>
              <h3 className="font-bold text-lg">Examen simulé complet</h3>
              <p className="text-indigo-200 text-sm">30 questions · Toutes sections mélangées</p>
            </div>
            <div className="ml-auto text-2xl opacity-80">→</div>
          </button>
        </>
      )}

      {activeTab === 'categories' && (
        <>
          {stats.categoryStats.filter(c => c.totalQuestions > 0).length > 0 && (
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <h2 className="font-bold text-orange-800 mb-3">🔥 À améliorer selon tes pratiques</h2>
              <div className="flex flex-col gap-2">
                {stats.categoryStats
                  .filter(c => c.totalQuestions > 0)
                  .sort((a, b) => a.percentage - b.percentage)
                  .slice(0, 3)
                  .map(c => (
                    <button key={c.category} onClick={() => handleStartCategory(c.category)}
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

          <div>
            <h2 className="font-bold text-gray-900 mb-3">📚 Toutes les catégories</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => {
                const catStat = stats.categoryStats.find(c => c.category === cat)
                const pct = catStat?.totalQuestions ? catStat.percentage : null
                return (
                  <button key={cat} onClick={() => handleStartCategory(cat)}
                    className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all text-left active:scale-95">
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
                        <div className={clsx('h-full rounded-full', pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500')}
                          style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔁</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900">Mode révision</h3>
                <p className="text-sm text-blue-700">Révise les questions que tu as manquées</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/review')} className="flex-shrink-0">
                Réviser →
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
