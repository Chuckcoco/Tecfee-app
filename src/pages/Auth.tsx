import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button, Input } from '../components/ui'

export default function Auth() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = useStore(s => s.login)
  const register = useStore(s => s.register)
  const user = useStore(s => s.user)

  useEffect(() => {
    if (user) { navigate('/dashboard'); return }
    if (params.get('demo') === '1') {
      setEmail('demo@tecfee.ca')
      setPassword('Demo123!')
    }
  }, [user, params, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))

    if (mode === 'login') {
      const result = login(email, password)
      if (!result.success) setError(result.error || 'Erreur de connexion')
    } else {
      if (!name.trim()) { setError('Veuillez entrer votre prénom.'); setLoading(false); return }
      if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); setLoading(false); return }
      const result = register(email, password, name)
      if (!result.success) setError(result.error || 'Erreur lors de la création du compte')
    }
    setLoading(false)
  }

  const fillDemo = () => {
    setEmail('demo@tecfee.ca')
    setPassword('Demo123!')
    setMode('login')
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-indigo-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg shadow-primary-200">T</div>
          <h1 className="text-2xl font-black text-gray-900">TECFÉE Pratique</h1>
          <p className="text-gray-500 text-sm mt-1">Prépare ta certification en français écrit</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === m ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {m === 'login' ? '🔑 Se connecter' : '✨ Créer un compte'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <Input label="Prénom" type="text" placeholder="Marie" value={name} onChange={e => setName(e.target.value)} required icon="👤" />
            )}
            <Input label="Adresse courriel" type="email" placeholder="marie@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required icon="✉️" />
            <Input label="Mot de passe" type="password" placeholder={mode === 'register' ? 'Minimum 6 caractères' : '••••••••'}
              value={password} onChange={e => setPassword(e.target.value)} required icon="🔒" />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
              {mode === 'login' ? '🚀 Se connecter' : '✨ Créer mon compte'}
            </Button>
          </form>

          {/* Demo */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3">Ou essaie avec le compte démo</p>
            <button onClick={fillDemo} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-600 hover:border-primary-300 hover:text-primary-700 transition-all">
              <span>👀</span> Utiliser le compte démo
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">demo@tecfee.ca · Demo123!</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Application privée · Données stockées localement sur cet appareil
        </p>
      </div>
    </div>
  )
}
