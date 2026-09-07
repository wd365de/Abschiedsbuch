import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { NAME } from '../../config'

export default function StepSuccess({ name }) {
  useEffect(() => {
    // Erste Salve
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#009775', '#3DBA9C', '#B87068', '#FAF7F2', '#2C2418'],
    })
    // Zweite Salve nach kurzer Pause
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.45 },
        angle: 60,
        colors: ['#009775', '#3DBA9C', '#FAF7F2'],
      })
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.45 },
        angle: 120,
        colors: ['#009775', '#3DBA9C', '#FAF7F2'],
      })
    }, 400)
  }, [])

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[80dvh] text-center animate-fade-up">
      <div className="text-5xl mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        💚
      </div>

      <h2
        className="font-display text-4xl font-light text-cream mb-3 animate-fade-up"
        style={{ animationDelay: '0.25s' }}
      >
        Danke{name ? `, ${name}` : ''}!
      </h2>

      <p
        className="font-body text-cream/70 leading-relaxed mb-10 max-w-[300px] animate-fade-up"
        style={{ animationDelay: '0.35s' }}
      >
        Dein Eintrag ist gespeichert. {NAME} wird sich sehr
        über deine Worte freuen.
      </p>

      <div
        className="flex items-center gap-4 mb-10 w-full max-w-[200px] animate-fade-in"
        style={{ animationDelay: '0.4s' }}
      >
        <div className="h-px flex-1 bg-gold/30" />
        <span className="text-gold text-sm">✦</span>
        <div className="h-px flex-1 bg-gold/30" />
      </div>

      <div
        className="flex flex-col gap-3 w-full max-w-[280px] animate-fade-up"
        style={{ animationDelay: '0.45s' }}
      >
        <Link to="/galerie" className="btn-primary text-center">
          Galerie ansehen
        </Link>
        <Link to="/eintrag" className="btn-secondary text-center">
          Weiteren Eintrag schreiben
        </Link>
        <Link to="/" className="btn-ghost text-center py-2">
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}
