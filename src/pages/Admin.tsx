import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button, Card, Badge, Input, Modal } from '../components/ui'
import { CATEGORY_LABELS, CATEGORY_COLORS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../types'
import type { Question, Category, Difficulty, QuestionType } from '../types'
import { clsx } from 'clsx'

const EMPTY_Q: Omit<Question, 'id'> = {
  category: 'grammaire',
  difficulty: 'moyen',
  type: 'multiple_choice',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
  rule: '',
  points: 1,
}

export default function Admin() {
  const navigate = useNavigate()
  const questions = useStore(s => s.questions)
  const sessions = useStore(s => s.sessions)
  const users = useStore(s => s.users)
  const addQuestion = useStore(s => s.addQuestion)
  const updateQuestion = useStore(s => s.updateQuestion)
  const deleteQuestion = useStore(s => s.deleteQuestion)
  const importQuestions = useStore(s => s.importQuestions)

  const [tab, setTab] = useState<'questions' | 'stats' | 'users'>('questions')
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all')
  const [editing, setEditing] = useState<Question | null>(null)
  const [creating, setCreating] = useState(false)
  const [newQ, setNewQ] = useState<Omit<Question, 'id'>>(EMPTY_Q)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [importText, setImportText] = useState('')
  const [importError, setImportError] = useState('')

  const filtered = questions.filter(q => {
    const matchCat = filterCat === 'all' || q.category === filterCat
    const matchSearch = !search || q.question.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleSave = () => {
    if (!newQ.question || !newQ.correctAnswer || !newQ.explanation) return
    if (editing) {
      updateQuestion(editing.id, newQ)
      setEditing(null)
    } else {
      addQuestion(newQ)
      setCreating(false)
    }
    setNewQ(EMPTY_Q)
  }

  const handleEdit = (q: Question) => {
    setEditing(q)
    setNewQ({ ...q })
    setCreating(true)
  }

  const handleDelete = (id: string) => {
    deleteQuestion(id)
    setDeleteConfirm(null)
  }

  const handleImport = () => {
    setImportError('')
    try {
      const data = JSON.parse(importText)
      const arr = Array.isArray(data) ? data : [data]
      importQuestions(arr)
      setImportText('')
    } catch {
      setImportError('JSON invalide. Vérifiez le format.')
    }
  }

  const totalSessions = sessions.filter(s => s.status === 'completed').length
  const avgScore = totalSessions > 0
    ? Math.round(sessions.filter(s => s.status === 'completed').reduce((a, s) => a + s.score, 0) / totalSessions)
    : 0

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600">←</button>
          <div>
            <h1 className="text-lg font-black text-gray-900">⚙️ Admin Panel</h1>
            <p className="text-xs text-gray-500">{questions.length} questions · {totalSessions} examens · {users.length} utilisateurs</p>
          </div>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setNewQ(EMPTY_Q); setCreating(true) }}>+ Ajouter</Button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6">
          {(['questions', 'stats', 'users'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={clsx('flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all', tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
              {t === 'questions' ? `📝 Questions (${questions.length})` : t === 'stats' ? '📊 Statistiques' : `👥 Utilisateurs (${users.length})`}
            </button>
          ))}
        </div>

        {/* QUESTIONS TAB */}
        {tab === 'questions' && (
          <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input className="input flex-1" placeholder="🔍 Rechercher une question..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="input sm:w-48" value={filterCat} onChange={e => setFilterCat(e.target.value as Category | 'all')}>
                <option value="all">Toutes les catégories</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>

            {/* Import */}
            <Card>
              <h3 className="font-bold text-gray-900 mb-3">📤 Importer des questions (JSON)</h3>
              <textarea className="input h-24 font-mono text-xs" placeholder='[{"category":"grammaire","difficulty":"moyen","type":"multiple_choice","question":"...","options":["A","B","C","D"],"correctAnswer":"A","explanation":"...","rule":"...","points":1}]'
                value={importText} onChange={e => setImportText(e.target.value)} />
              {importError && <p className="text-red-500 text-xs mt-1">{importError}</p>}
              <Button variant="secondary" size="sm" className="mt-2" onClick={handleImport} disabled={!importText}>Importer</Button>
            </Card>

            {/* List */}
            <div className="flex flex-col gap-3">
              {filtered.map(q => (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={clsx('badge text-xs', CATEGORY_COLORS[q.category])}>{CATEGORY_LABELS[q.category]}</span>
                      <span className={clsx('badge text-xs', DIFFICULTY_COLORS[q.difficulty])}>{DIFFICULTY_LABELS[q.difficulty]}</span>
                      <span className="badge badge-gray text-xs">{q.points} pt{q.points > 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2">{q.question}</p>
                    <p className="text-xs text-green-700 mt-1 font-medium">✓ {q.correctAnswer}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(q)}>✏️</Button>
                    <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(q.id)}>🗑</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {tab === 'stats' && (
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ['📝', questions.length, 'Questions dans la banque'],
              ['🎯', `${avgScore}%`, 'Score moyen global'],
              ['✅', totalSessions, 'Examens complétés'],
              ['👥', users.length, 'Utilisateurs inscrits'],
            ].map(([icon, val, label]) => (
              <Card key={String(label)} className="flex items-center gap-4">
                <span className="text-4xl">{icon}</span>
                <div>
                  <div className="text-3xl font-black text-gray-900">{val}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div className="flex flex-col gap-3">
            {[{ id: 'demo', email: 'demo@tecfee.ca', name: 'Démo', isAdmin: false }, ...users].map(u => (
              <Card key={u.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                {u.isAdmin && <Badge variant="primary">Admin</Badge>}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={creating} onClose={() => { setCreating(false); setEditing(null) }} title={editing ? 'Modifier la question' : 'Nouvelle question'}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Catégorie</label>
              <select className="input text-sm" value={newQ.category} onChange={e => setNewQ({ ...newQ, category: e.target.value as Category })}>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Difficulté</label>
              <select className="input text-sm" value={newQ.difficulty} onChange={e => setNewQ({ ...newQ, difficulty: e.target.value as Difficulty })}>
                {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Question *</label>
            <textarea className="input h-20 text-sm" value={newQ.question} onChange={e => setNewQ({ ...newQ, question: e.target.value })} placeholder="Texte de la question..." />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Options (une par ligne)</label>
            {(newQ.options || ['', '', '', '']).map((opt, i) => (
              <input key={i} className="input text-sm mb-2" placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt}
                onChange={e => { const opts = [...(newQ.options || [])]; opts[i] = e.target.value; setNewQ({ ...newQ, options: opts }) }} />
            ))}
          </div>

          <Input label="Bonne réponse *" value={newQ.correctAnswer} onChange={e => setNewQ({ ...newQ, correctAnswer: e.target.value })} placeholder="Doit correspondre exactement à une option" />

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Explication *</label>
            <textarea className="input h-20 text-sm" value={newQ.explanation} onChange={e => setNewQ({ ...newQ, explanation: e.target.value })} />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Règle grammaticale</label>
            <textarea className="input h-16 text-sm" value={newQ.rule || ''} onChange={e => setNewQ({ ...newQ, rule: e.target.value })} />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Points (1-3)</label>
            <select className="input text-sm" value={newQ.points} onChange={e => setNewQ({ ...newQ, points: Number(e.target.value) })}>
              <option value={1}>1 point (facile)</option>
              <option value={2}>2 points (moyen)</option>
              <option value={3}>3 points (difficile)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => { setCreating(false); setEditing(null) }}>Annuler</Button>
            <Button fullWidth onClick={handleSave} disabled={!newQ.question || !newQ.correctAnswer}>
              {editing ? 'Enregistrer' : 'Créer la question'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Supprimer la question ?">
        <p className="text-gray-600 mb-6">Cette action est irréversible.</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setDeleteConfirm(null)}>Annuler</Button>
          <Button variant="danger" fullWidth onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Supprimer</Button>
        </div>
      </Modal>
    </div>
  )
}
