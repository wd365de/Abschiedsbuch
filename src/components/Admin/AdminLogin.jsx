import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'

export default function AdminLogin() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Login fehlgeschlagen. E-Mail oder Passwort falsch.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-dvh bg-brand flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="font-display italic text-gold-light text-2xl">Abschiedsbuch</Link>
          <h1 className="font-display text-3xl font-light text-cream mt-4 mb-1">Admin-Bereich</h1>
          <p className="font-body text-sm text-cream/70">Nur für Admin und Institutsleitung</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-cream/60 block mb-3">
              E-Mail
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="eure@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

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
                Einloggen…
              </span>
            ) : (
              'Einloggen'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
