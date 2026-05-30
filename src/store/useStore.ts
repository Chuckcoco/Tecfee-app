import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, ExamSession, Question, SessionQuestion, UserStats, CategoryStats, Category } from '../types'
import { ALL_BADGES } from '../types'
import { QUESTIONS } from '../data/questions'

const GUEST_USER: User = {
  id: 'guest',
  email: 'invitee@tecfee.ca',
  name: 'Katheryne',
  isAdmin: false,
  createdAt: new Date().toISOString(),
  level: 1,
  xp: 0,
  streak: 0,
  badges: [],
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function getLevel(xp: number): number {
  return Math.floor(xp / 100) + 1
}

function checkAndAwardBadges(user: User, sessions: ExamSession[], newSession?: ExamSession): User {
  const badgeIds = user.badges.map(b => b.id)
  const newBadges = [...user.badges]
  const addBadge = (id: string) => {
    if (!badgeIds.includes(id)) {
      const badge = ALL_BADGES.find(b => b.id === id)
      if (badge) newBadges.push({ ...badge, unlockedAt: new Date().toISOString() })
    }
  }
  const completed = sessions.filter(s => s.status === 'completed')
  if (completed.length >= 1) addBadge('first_exam')
  if (completed.some(s => s.score === 100)) addBadge('perfect_score')
  if (user.streak >= 7) addBadge('streak_7')
  if (user.streak >= 30) addBadge('streak_30')
  const totalQ = completed.reduce((acc, s) => acc + s.questions.length, 0)
  if (totalQ >= 100) addBadge('hundred_questions')
  if (newSession && newSession.score >= 70) addBadge('passed_tecfee')
  if (newSession && newSession.timeSpentSeconds < 1200 && newSession.examType === 'full') addBadge('speed_demon')
  return { ...user, badges: newBadges }
}

interface AppState {
  user: User
  currentSession: ExamSession | null
  currentQuestionIndex: number
  sessions: ExamSession[]
  questions: Question[]
  updateProfile: (data: Partial<User>) => void
  startExam: (type: 'full' | 'practice' | 'category', category?: Category, count?: number) => ExamSession
  answerQuestion: (answer: string, timeSpent: number) => void
  nextQuestion: () => void
  finishExam: () => ExamSession
  abandonExam: () => void
  addQuestion: (q: Omit<Question, 'id'>) => void
  updateQuestion: (id: string, q: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  importQuestions: (questions: Omit<Question, 'id'>[]) => void
  getUserStats: () => UserStats
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: GUEST_USER,
      currentSession: null,
      currentQuestionIndex: 0,
      sessions: [],
      questions: QUESTIONS,

      updateProfile: (data) => {
        set(s => ({ user: { ...s.user, ...data } }))
      },

      startExam: (type, category, count = 30) => {
        const { user, questions } = get()
        let pool = [...questions]
        if (type === 'category' && category) pool = pool.filter(q => q.category === category)
        if (type === 'full') count = Math.min(40, pool.length)
        const selected = shuffle(pool).slice(0, count)
        const session: ExamSession = {
          id: generateId(),
          userId: user.id,
          examType: type,
          category,
          startedAt: new Date().toISOString(),
          timeSpentSeconds: 0,
          questions: selected.map(q => ({ questionId: q.id, question: q, userAnswer: '', isCorrect: false, timeSpentSeconds: 0 })),
          score: 0,
          passed: false,
          status: 'in_progress',
        }
        set({ currentSession: session, currentQuestionIndex: 0 })
        return session
      },

      answerQuestion: (answer, timeSpent) => {
        const { currentSession, currentQuestionIndex } = get()
        if (!currentSession) return
        const updated = { ...currentSession }
        const sq = updated.questions[currentQuestionIndex]
        sq.userAnswer = answer
        sq.isCorrect = answer.trim().toLowerCase() === sq.question.correctAnswer.trim().toLowerCase()
        sq.timeSpentSeconds = timeSpent
        updated.timeSpentSeconds += timeSpent
        set({ currentSession: updated })
      },

      nextQuestion: () => {
        set(s => ({ currentQuestionIndex: s.currentQuestionIndex + 1 }))
      },

      finishExam: () => {
        const { currentSession, sessions, user } = get()
        if (!currentSession) throw new Error('Pas de session')
        const totalPoints = currentSession.questions.reduce((acc, sq) => acc + sq.question.points, 0)
        const earnedPoints = currentSession.questions.filter(sq => sq.isCorrect).reduce((acc, sq) => acc + sq.question.points, 0)
        const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
        const finished: ExamSession = { ...currentSession, completedAt: new Date().toISOString(), score, passed: score >= 70, status: 'completed' }
        const xpGained = Math.round(score / 10) + (finished.passed ? 20 : 0)
        const today = new Date().toDateString()
        const lastActive = user.lastActiveDate
        const newStreak = lastActive === new Date(Date.now() - 86400000).toDateString() ? user.streak + 1 : (lastActive === today ? user.streak : 1)
        const newXp = user.xp + xpGained
        const updatedUser = checkAndAwardBadges({ ...user, xp: newXp, level: getLevel(newXp), streak: newStreak, lastActiveDate: today }, [...sessions, finished], finished)
        set({ sessions: [...sessions, finished], currentSession: null, currentQuestionIndex: 0, user: updatedUser })
        return finished
      },

      abandonExam: () => set({ currentSession: null, currentQuestionIndex: 0 }),

      addQuestion: (q) => set(s => ({ questions: [...s.questions, { ...q, id: generateId() }] })),
      updateQuestion: (id, data) => set(s => ({ questions: s.questions.map(q => q.id === id ? { ...q, ...data } : q) })),
      deleteQuestion: (id) => set(s => ({ questions: s.questions.filter(q => q.id !== id) })),
      importQuestions: (imported) => set(s => ({ questions: [...s.questions, ...imported.map(q => ({ ...q, id: generateId() }))] })),

      getUserStats: (): UserStats => {
        const { sessions, user } = get()
        const completed = sessions.filter(s => s.status === 'completed' && s.userId === user.id)
        const allQuestions = completed.flatMap(s => s.questions)
        const correct = allQuestions.filter(q => q.isCorrect)
        const totalTime = allQuestions.reduce((acc, q) => acc + q.timeSpentSeconds, 0)
        const categories: Category[] = ['grammaire', 'orthographe', 'syntaxe', 'ponctuation', 'vocabulaire', 'accords', 'comprehension', 'redaction']
        const categoryStats: CategoryStats[] = categories.map(cat => {
          const catQ = allQuestions.filter(q => q.question.category === cat)
          const catCorrect = catQ.filter(q => q.isCorrect)
          const pct = catQ.length > 0 ? Math.round((catCorrect.length / catQ.length) * 100) : 0
          return { category: cat, totalQuestions: catQ.length, correctAnswers: catCorrect.length, percentage: pct, trend: 'stable' }
        })
        const recentScores = completed.slice(-10).map(s => ({ date: s.completedAt || s.startedAt, score: s.score }))
        const scores = completed.map(s => s.score)
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
        const estimatedPass = avgScore >= 80 ? 90 : avgScore >= 70 ? 70 : avgScore >= 60 ? 45 : avgScore >= 50 ? 25 : 10
        return {
          totalExams: completed.length, totalQuestions: allQuestions.length, correctAnswers: correct.length,
          averageScore: avgScore, bestScore: scores.length > 0 ? Math.max(...scores) : 0,
          averageTimePerQuestion: allQuestions.length > 0 ? Math.round(totalTime / allQuestions.length) : 0,
          estimatedPassRate: estimatedPass, categoryStats, recentScores,
          currentStreak: user.streak, longestStreak: user.streak,
        }
      },
    }),
    { name: 'tecfee-storage', partialize: (s) => ({ user: s.user, sessions: s.sessions, questions: s.questions }) }
  )
)