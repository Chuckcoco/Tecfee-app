import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Button, Card, EmptyState } from '../components/ui'
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from '../types'
import type { Category } from '../types'
import type { SessionQuestion } from '../types'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'

const CATEGORIES: Category[] = ['grammaire', 'orthographe', 'syntaxe', 'ponctuation', 'vocabulaire', 'accords', 'comprehension', 'redaction']

export default function Review() {
  const navigate = useNavigate()
  const user = useStore(s => s.user)
  const sessions = useStore(s => s.sessions)
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all')
  const [showCorrect, setShowCorrect] = useState(false)

  const completed = sessions.filter(s => s.status === 'completed' && s.userId === user?.id)
  const allQuestions = completed.flatMap(s => s.questions)

  const filtered = allQuestions.filter(sq => {
    if (!showCorrect && sq.isCorrect) return false
    if (filterCat !== 'all' && sq.question.category !== filterCat) return false
    return true
  })

  const incorrectCount = allQuestions.filter(q => !q.isCorrect).length

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">🔍 Révision des erreurs</h1>
        <p className="text-gray-500 mt-1">{incorrectCount} erreur{incorrectCount !== 1 ? 's' : ''} sur {allQuestions.length} questions au total</p>
      </div>

      {allQuestions.length === 0 ? (
        <EmptyState icon="📋" title="Aucune question à réviser" description="Complète quelques examens pour accéder à la révision."
          action={<Button onClick={() => navigate('/exam')}>Commencer un examen</Button>} />
      ) : (
        <>
          {/* Filtres */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowCorrect(false)}
                className={clsx('px-4 py-2 rounded-xl text-sm font-semibold transition-all', !showCorrect ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
                ❌ Erreurs seulement ({incorrectCount})
              </button>
              <button onClick={() => setShowCorrect(true)}
                className={clsx('px-4 py-2 rounded-xl text-sm font-semibold transition-all', showCorrect ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
                ✅ Toutes les questions ({allQuestions.length})
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <button onClick={() => setFilterCat('all')}
                className={clsx('flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all', filterCat === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                Toutes
              </button>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className={clsx('flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all', filterCat === cat ? 'bg-gray-800 text-white' : `${CATEGORY_COLORS[cat]} hover:opacity-80`)}>
                  {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          {filtered.length === 0 ? (
            <EmptyState icon="🎉" title="Aucune erreur dans cette catégorie !" description="Super ! Essaie une autre catégorie ou continue à t'entraîner." />
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((sq, i) => <QuestionCard key={`${sq.questionId}-${i}`} sq={sq} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function QuestionCard({ sq }: { sq: SessionQuestion }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={clsx('rounded-2xl border-2 overflow-hidden transition-all', sq.isCorrect ? 'border-green-200' : 'border-red-200')}>
      <button className="w-full flex items-start gap-4 p-4 text-left hover:bg-gray-50 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0', sq.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
          {sq.isCorrect ? '✓' : '✗'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={clsx('badge text-xs', CATEGORY_COLORS[sq.question.category])}>
              {CATEGORY_ICONS[sq.question.category]} {CATEGORY_LABELS[sq.question.category]}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-800 line-clamp-2">{sq.question.question}</p>
        </div>
        <span className="text-gray-400 text-sm flex-shrink-0">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 bg-gray-50 animate-fade-in">
          {sq.question.context && (
            <div className="bg-blue-50 rounded-xl p-3 mb-3 text-xs text-gray-700 leading-relaxed">
              <p className="font-semibold text-blue-700 mb-1">Texte de référence :</p>
              {sq.question.context}
            </div>
          )}

          {sq.question.options && (
            <div className="flex flex-col gap-2 mb-3">
              {sq.question.options.map(opt => (
                <div key={opt} className={clsx('flex items-center gap-2 px-3 py-2 rounded-xl text-sm',
                  opt === sq.question.correctAnswer ? 'bg-green-100 text-green-800 font-semibold' :
                  opt === sq.userAnswer && !sq.isCorrect ? 'bg-red-100 text-red-700 line-through' :
                  'bg-white text-gray-600')}>
                  <span>{opt === sq.question.correctAnswer ? '✓' : opt === sq.userAnswer ? '✗' : '·'}</span>
                  {opt}
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">📖 Explication</p>
            <p className="text-xs text-gray-700 leading-relaxed">{sq.question.explanation}</p>
            {sq.question.rule && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-primary-600 mb-1">⚡ Règle à retenir</p>
                <p className="text-xs text-gray-700">{sq.question.rule}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
