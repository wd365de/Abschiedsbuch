import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import GalleryPage from './GalleryPage'

// Eigener Zugang für Herrn Krug: nur Passwort, die E-Mail des
// Supabase-Users kommt aus VITE_KRUG_EMAIL. Diese Route ist vom
// gemeinsamen Zugangscode der Kolleg*innen ausgenommen (middleware.js).
const KRUG_EMAIL = import.meta.env.VITE_KRUG_EMAIL

function KrugLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!KRUG_EMAIL) {
      setError('Zugang ist noch nicht eingerichtet.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email: KRUG_EMAIL, password })
    if (error) setError('Das Passwort stimmt leider nicht.')
    setLoading(false)
  }

  return (
    <div className="min-h-dvh bg-brand flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10 animate-fade-up">
          <p className="font-display italic text-gold-light text-2xl">Abschiedsbuch</p>
          <h1 className="font-display text-3xl font-light text-cream mt-4 mb-2">
            Lieber Herr Krug,
          </h1>
          <p className="font-body text-sm text-cream/70 leading-relaxed">
            hier finden Sie die Worte, Erinnerungen und Fotos Ihrer Kolleg*innen.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-cream/60 block mb-3">
              Passwort
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-blush/10 border border-blush/30 rounded-xl px-4 py-3">
              <p className="font-body text-sm text-blush">{error}</p>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                Einen Moment…
              </span>
            ) : (
              'Abschiedsbuch öffnen'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function KrugPage() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="min-h-dvh bg-brand flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <KrugLogin />

  return <GalleryPage onLogout={() => supabase.auth.signOut()} />
}
