import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useEffect } from 'react'
import { Button } from '../components/ui'

const FEATURES = [
  { icon: '📝', title: 'Examens simulés', desc: 'Reproduit fidèlement le format TECFÉE officiel' },
  { icon: '✅', title: 'Correction détaillée', desc: 'Chaque erreur expliquée avec la règle grammaticale' },
  { icon: '📊', title: 'Suivi de progression', desc: 'Graphiques et statistiques pour mesurer vos progrès' },
  { icon: '🎯', title: 'Entraînement ciblé', desc: 'Travaillez vos catégories faibles en priorité' },
  { icon: '🏆', title: 'Gamification', desc: 'Badges, niveaux et streaks pour rester motivée' },
  { icon: '📱', title: 'Mobile et desktop', desc: 'Accessible partout, sur tous vos appareils' },
]

const CATEGORIES = [
  { icon: '📖', name: 'Grammaire' }, { icon: '✍️', name: 'Orthographe' },
  { icon: '🔗', name: 'Syntaxe' }, { icon: '❓', name: 'Ponctuation' },
  { icon: '💬', name: 'Vocabulaire' }, { icon: '🤝', name: 'Accords' },
  { icon: '🔍', name: 'Compréhension' }, { icon: '📝', name: 'Rédaction' },
]

export default function Landing() {
  const navigate = useNavigate()
  const user = useStore(s => s.user)

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  return (
    <div className="min-h-dvh bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium mb-8">
            <span>🎓</span> Pour les futur·e·s enseignant·e·s du Québec
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Réussis ton<br />
            <span className="text-yellow-300">TECFÉE</span> !
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            La plateforme complète pour préparer ta certification en français écrit pour l'enseignement. Examens simulés, corrections détaillées et suivi personnalisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" onClick={() => navigate('/auth')} className="bg-white text-primary-700 hover:bg-primary-50 shadow-2xl">
              🚀 Commencer gratuitement
            </Button>
            <Button variant="ghost" size="xl" onClick={() => navigate('/auth?demo=1')} className="text-white border-2 border-white/50 hover:border-white hover:bg-white/10">
              👀 Voir la démo
            </Button>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-primary-200">
            <span>✓ 100% gratuit</span>
            <span>✓ Sans installation</span>
            <span>✓ Mobile et desktop</span>
          </div>
        </div>
      </div>

      {/* Score display */}
      <div className="bg-primary-900 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            {[['70+', 'questions réalistes'], ['8', 'catégories TECFÉE'], ['100%', 'gratuit']].map(([val, label]) => (
              <div key={label}>
                <div className="text-3xl font-black text-yellow-300">{val}</div>
                <div className="text-xs text-primary-300 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Catégories */}
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">8 catégories couvertes</h2>
          <p className="text-gray-500 mb-8">Identiques au vrai TECFÉE</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map(c => (
              <div key={c.name} className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs font-medium text-gray-600 text-center leading-tight">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Tout ce qu'il faut pour réussir</h2>
          <p className="text-gray-500 text-center mb-10">Une application complète conçue pour les futur·e·s enseignant·e·s</p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-3xl flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-6 bg-gradient-to-br from-primary-600 to-indigo-700 text-white text-center">
        <h2 className="text-3xl font-black mb-4">Prête à commencer ?</h2>
        <p className="text-primary-200 mb-8">Crée ton compte gratuitement et commence à t'entraîner dès maintenant.</p>
        <Button size="xl" onClick={() => navigate('/auth')} className="bg-white text-primary-700 hover:bg-white/90 shadow-2xl">
          🎯 Créer mon compte gratuit
        </Button>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-sm text-gray-400 bg-gray-50 border-t border-gray-100">
        TECFÉE Pratique · Application de préparation à la certification en français écrit pour l'enseignement au Québec
      </footer>
    </div>
  )
}
