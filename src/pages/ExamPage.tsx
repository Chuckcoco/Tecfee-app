import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button, Card, ProgressBar, Modal } from '../components/ui'
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS } from '../types'
import type { Category } from '../types'
import { clsx } from 'clsx'

const EXAM_TYPES = [
  { id: 'full', icon: '📝', title: 'Examen complet', desc: 'Simulation complète TECFÉE · 30-40 questions · Toutes catégories', duration: '~40 min', color: 'border-primary-200 hover:border-primary-400' },
  { id: 'practice', icon: '⚡', title: 'Pratique rapide', desc: '10 questions aléatoires · Toutes catégories', duration: '~10 min', color: 'border-green-200 hover:border-green-400' },
  { id: 'category', icon: '🎯', title: 'Par catégorie', desc: 'Cibler une catégorie spécifique · 15 questions', duration: '~15 min', color: 'border-orange-200 hover:border-orange-400' },
]

const CATEGORIES: Category[] = ['grammaire', 'orthographe', 'syntaxe', 'ponctuation', 'vocabulaire', 'accords', 'comprehension', 'redaction']

function ExamSetup() {
  const navigate = useNavigate()
  const startExam = useStore(s => s.startExam)
  const [type, setType] = useState<'full' | 'practice' | 'category' | null>(null)
  const [category, setCategory] = useState<Category | null>(null)

  const handleStart = () => {
    if (!type) return
    if (type === 'category' && !category) return
    startExam(type, category || undefined, type === 'full' ? 35 : type === 'practice' ? 10 : 15)
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900">📝 Choisir un examen</h1>
        <p className="text-gray-500 mt-1">Sélectionne le type d'entraînement que tu souhaites faire</p>
      </div>

      <div className="flex flex-col gap-4">
        {EXAM_TYPES.map(et => (
          <button key={et.id} onClick={() => { setType(et.id as typeof type); setCategory(null) }}
            className={clsx('flex items-center gap-4 p-5 bg-white rounded-2xl border-2 transition-all text-left',
              type === et.id ? 'border-primary-500 bg-primary-50 shadow-md' : et.color)}>
            <div className="text-4xl flex-shrink-0">{et.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900">{et.title}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{et.duration}</span>
              </div>
              <p className="text-sm text-gray-500">{et.desc}</p>
            </div>
            <div className={clsx('w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all', type === et.id ? 'border-primary-500 bg-primary-500' : 'border-gray-200')}>
              {type === et.id && <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>}
            </div>
          </button>
        ))}
      </div>

      {type === 'category' && (
        <div className="animate-fade-in">
          <h3 className="font-semibold text-gray-800 mb-3">Choisir une catégorie :</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={clsx('flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
                  category === cat ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white')}>
                <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                <span className="text-xs font-semibold text-gray-700 text-center">{CATEGORY_LABELS[cat]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Button size="lg" fullWidth onClick={handleStart} disabled={!type || (type === 'category' && !category)} className="mt-2">
        🚀 Commencer l'examen
      </Button>
    </div>
  )
}

function Timer({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  const isLow = seconds < 120
  return (
    <span className={clsx('font-mono font-bold tabular-nums', isLow ? 'text-red-600' : 'text-gray-700')}>
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  )
}

function ExamRunner() {
  const navigate = useNavigate()
  const session = useStore(s => s.currentSession)
  const idx = useStore(s => s.currentQuestionIndex)
  const answerQuestion = useStore(s => s.answerQuestion)
  const nextQuestion = useStore(s => s.nextQuestion)
  const finishExam = useStore(s => s.finishExam)
  const abandonExam = useStore(s => s.abandonExam)

  const [selected, setSelected] = useState<string>('')
  const [elapsed, setElapsed] = useState(0)
  const [questionStart, setQuestionStart] = useState(Date.now())
  const [showAbandon, setShowAbandon] = useState(false)
  const [answered, setAnswered] = useState(false)

  const question = session?.questions[idx]?.question

  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setSelected('')
    setAnswered(false)
    setQuestionStart(Date.now())
  }, [idx])

  const handleAnswer = useCallback((ans: string) => {
    if (answered) return
    setSelected(ans)
    setAnswered(true)
    const timeSpent = Math.round((Date.now() - questionStart) / 1000)
    answerQuestion(ans, timeSpent)
  }, [answered, answerQuestion, questionStart])

  const handleNext = () => {
    if (!session) return
    if (idx + 1 >= session.questions.length) {
      const finished = finishExam()
      navigate(`/results/${finished.id}`)
    } else {
      nextQuestion()
    }
  }

  const handleAbandon = () => { abandonExam(); navigate('/dashboard') }

  if (!session || !question) return null

  const progress = idx / session.questions.length
  const isLast = idx + 1 >= session.questions.length
  const isCorrect = selected === question.correctAnswer

  return (
    <div className="flex flex-col gap-4 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAbandon(true)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">✕</button>
          <span className="text-sm font-semibold text-gray-600">
            Question {idx + 1} / {session.questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
          <span className="text-sm">⏱</span>
          <Timer seconds={elapsed} />
        </div>
      </div>

      {/* Progress */}
      <ProgressBar value={idx} max={session.questions.length} />

      {/* Category badge */}
      <div className="flex items-center gap-2">
        <span className={clsx('badge text-xs', CATEGORY_COLORS[question.category])}>
          {CATEGORY_ICONS[question.category]} {CATEGORY_LABELS[question.category]}
        </span>
        <span className={clsx('badge text-xs', question.difficulty === 'facile' ? 'bg-green-100 text-green-700' : question.difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}>
          {question.difficulty}
        </span>
        <span className="badge badge-gray text-xs">{question.points} pt{question.points > 1 ? 's' : ''}</span>
      </div>

      {/* Context */}
      {question.context && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Texte de référence</p>
          <p className="text-sm text-gray-800 leading-relaxed">{question.context}</p>
        </div>
      )}

      {/* Question */}
      <Card className="border-0 shadow-md">
        <p className="text-base md:text-lg font-semibold text-gray-900 leading-relaxed">{question.question}</p>
      </Card>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options?.map((opt, i) => {
          const letter = ['A', 'B', 'C', 'D'][i]
          const isSelected = selected === opt
          const isCorrectOpt = opt === question.correctAnswer

          let cls = 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50'
          if (answered) {
            if (isCorrectOpt) cls = 'border-green-400 bg-green-50'
            else if (isSelected && !isCorrectOpt) cls = 'border-red-400 bg-red-50'
            else cls = 'border-gray-100 bg-gray-50 opacity-60'
          } else if (isSelected) {
            cls = 'border-primary-400 bg-primary-50'
          }

          return (
            <button key={opt} onClick={() => handleAnswer(opt)} disabled={answered}
              className={clsx('flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150 w-full', cls, !answered && 'active:scale-98')}>
              <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
                answered && isCorrectOpt ? 'bg-green-500 text-white' :
                answered && isSelected && !isCorrectOpt ? 'bg-red-500 text-white' :
                'bg-gray-100 text-gray-600')}>
                {answered && isCorrectOpt ? '✓' : answered && isSelected ? '✗' : letter}
              </div>
              <span className="text-sm text-gray-800 font-medium leading-snug">{opt}</span>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className={clsx('rounded-2xl p-4 border animate-slide-up', isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{isCorrect ? '🎉' : '📚'}</span>
            <span className={clsx('font-bold', isCorrect ? 'text-green-700' : 'text-red-700')}>
              {isCorrect ? 'Bonne réponse !' : `Réponse : ${question.correctAnswer}`}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{question.explanation}</p>
          {question.rule && (
            <div className="bg-white/70 rounded-xl p-3 mt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">📖 Règle</p>
              <p className="text-xs text-gray-700">{question.rule}</p>
            </div>
          )}
        </div>
      )}

      {/* Next */}
      {answered && (
        <Button size="lg" fullWidth onClick={handleNext} className="animate-slide-up">
          {isLast ? '✅ Voir mes résultats' : '→ Question suivante'}
        </Button>
      )}

      {/* Abandon modal */}
      <Modal open={showAbandon} onClose={() => setShowAbandon(false)} title="Abandonner l'examen ?">
        <p className="text-gray-600 mb-6">Ta progression dans cet examen sera perdue. Es-tu sûre de vouloir arrêter ?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setShowAbandon(false)}>Continuer l'examen</Button>
          <Button variant="danger" fullWidth onClick={handleAbandon}>Abandonner</Button>
        </div>
      </Modal>
    </div>
  )
}

export default function ExamPage() {
  const session = useStore(s => s.currentSession)
  return session ? <ExamRunner /> : <ExamSetup />
}
