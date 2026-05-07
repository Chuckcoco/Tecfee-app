// ──────────────────────────────────────────────────────────────
// TYPES PRINCIPAUX DE L'APPLICATION TECFÉE
// ──────────────────────────────────────────────────────────────

export type Category =
  | 'grammaire'
  | 'orthographe'
  | 'syntaxe'
  | 'ponctuation'
  | 'vocabulaire'
  | 'accords'
  | 'comprehension'
  | 'redaction'

export type Difficulty = 'facile' | 'moyen' | 'difficile'

export type QuestionType =
  | 'multiple_choice'   // QCM classique
  | 'true_false'        // Vrai/Faux
  | 'fill_blank'        // Compléter le texte
  | 'error_correction'  // Identifier/corriger l'erreur
  | 'sentence_rewrite'  // Réécrire la phrase

// ──────────────────────────────────────────────────────────────
// QUESTION
// ──────────────────────────────────────────────────────────────
export interface Question {
  id: string
  category: Category
  difficulty: Difficulty
  type: QuestionType
  question: string           // Texte de la question
  context?: string           // Texte de contexte (passage à lire)
  options?: string[]         // Choix pour QCM
  correctAnswer: string      // La bonne réponse
  explanation: string        // Explication détaillée
  rule?: string              // Règle grammaticale applicable
  tags?: string[]            // Tags supplémentaires
  points: number             // Points accordés (1-3)
}

// ──────────────────────────────────────────────────────────────
// UTILISATEUR
// ──────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isAdmin: boolean
  createdAt: string
  level: number              // Niveau 1-10
  xp: number                 // Points d'expérience
  streak: number             // Jours consécutifs
  lastActiveDate?: string
  badges: Badge[]
}

// ──────────────────────────────────────────────────────────────
// SESSION D'EXAMEN
// ──────────────────────────────────────────────────────────────
export interface ExamSession {
  id: string
  userId: string
  examType: 'full' | 'practice' | 'category'
  category?: Category        // Si entraînement ciblé
  startedAt: string
  completedAt?: string
  timeSpentSeconds: number
  questions: SessionQuestion[]
  score: number              // Pourcentage 0-100
  passed: boolean            // >= 70%
  status: 'in_progress' | 'completed' | 'abandoned'
}

export interface SessionQuestion {
  questionId: string
  question: Question         // Copie de la question
  userAnswer: string
  isCorrect: boolean
  timeSpentSeconds: number
}

// ──────────────────────────────────────────────────────────────
// STATISTIQUES
// ──────────────────────────────────────────────────────────────
export interface CategoryStats {
  category: Category
  totalQuestions: number
  correctAnswers: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

export interface UserStats {
  totalExams: number
  totalQuestions: number
  correctAnswers: number
  averageScore: number
  bestScore: number
  averageTimePerQuestion: number  // en secondes
  estimatedPassRate: number       // % de chance de réussir le vrai TECFÉE
  categoryStats: CategoryStats[]
  recentScores: { date: string; score: number }[]
  currentStreak: number
  longestStreak: number
}

// ──────────────────────────────────────────────────────────────
// BADGES
// ──────────────────────────────────────────────────────────────
export interface Badge {
  id: string
  name: string
  description: string
  icon: string               // emoji
  unlockedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const ALL_BADGES: Omit<Badge, 'unlockedAt'>[] = [
  { id: 'first_exam', name: 'Premier Pas', description: 'Compléter votre premier examen', icon: '🎯', rarity: 'common' },
  { id: 'perfect_score', name: 'Perfection', description: 'Obtenir 100% à un examen', icon: '⭐', rarity: 'legendary' },
  { id: 'streak_7', name: 'Semaine Parfaite', description: '7 jours consécutifs de pratique', icon: '🔥', rarity: 'rare' },
  { id: 'streak_30', name: 'Mois Champion', description: '30 jours consécutifs de pratique', icon: '🏆', rarity: 'epic' },
  { id: 'hundred_questions', name: 'Centurion', description: 'Répondre à 100 questions', icon: '💯', rarity: 'common' },
  { id: 'grammar_master', name: 'Maître Grammaire', description: '90%+ en grammaire', icon: '📚', rarity: 'rare' },
  { id: 'passed_tecfee', name: 'Succès TECFÉE', description: 'Score simulé ≥ 70%', icon: '🎓', rarity: 'epic' },
  { id: 'speed_demon', name: 'Éclair', description: 'Terminer un examen en moins de 20 min', icon: '⚡', rarity: 'rare' },
]

// ──────────────────────────────────────────────────────────────
// LABELS
// ──────────────────────────────────────────────────────────────
export const CATEGORY_LABELS: Record<Category, string> = {
  grammaire: 'Grammaire',
  orthographe: 'Orthographe',
  syntaxe: 'Syntaxe',
  ponctuation: 'Ponctuation',
  vocabulaire: 'Vocabulaire',
  accords: 'Accords',
  comprehension: 'Compréhension',
  redaction: 'Rédaction',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  grammaire: 'bg-blue-100 text-blue-700',
  orthographe: 'bg-purple-100 text-purple-700',
  syntaxe: 'bg-indigo-100 text-indigo-700',
  ponctuation: 'bg-yellow-100 text-yellow-700',
  vocabulaire: 'bg-green-100 text-green-700',
  accords: 'bg-pink-100 text-pink-700',
  comprehension: 'bg-orange-100 text-orange-700',
  redaction: 'bg-teal-100 text-teal-700',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  grammaire: '📖',
  orthographe: '✍️',
  syntaxe: '🔗',
  ponctuation: '❓',
  vocabulaire: '💬',
  accords: '🤝',
  comprehension: '🔍',
  redaction: '📝',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facile: 'Facile',
  moyen: 'Moyen',
  difficile: 'Difficile',
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  facile: 'bg-green-100 text-green-700',
  moyen: 'bg-yellow-100 text-yellow-700',
  difficile: 'bg-red-100 text-red-700',
}
