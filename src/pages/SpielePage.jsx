import { useState } from 'react'
import { Link } from 'react-router-dom'
import QuizGame from '../components/Games/QuizGame'

export default function SpielePage() {
  const [activeGame, setActiveGame] = useState(null)

  if (activeGame === 'quiz') return <QuizGame onBack={() => setActiveGame(null)} />

  return (
    <div className="min-h-dvh bg-cream flex flex-col">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="page-container flex-1">
        <Link to="/" className="font-display italic text-gold text-lg block mb-10">
          N & A
        </Link>

        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-3">
          Hochzeits-Spiele
        </p>
        <h1 className="font-display text-4xl font-light text-ink mb-3 leading-tight">
          Für zwischendurch.
        </h1>
        <p className="font-body text-sm text-ink-muted mb-10 leading-relaxed max-w-[320px]">
          Ein kleines Spiel – und mit etwas Glück landet dein Ergebnis im gedruckten Fotoalbum.
        </p>

        <button
          onClick={() => setActiveGame('quiz')}
          className="text-left rounded-2xl p-6 border-2 border-blush/30 bg-[#FAF0EE] hover:border-blush/50 transition-all duration-300 active:scale-[0.98] w-full"
        >
          <div className="text-4xl mb-3">🤔</div>
          <h2 className="font-body font-semibold text-base text-ink mb-1">
            Niklas oder Alexander?
          </h2>
          <p className="font-body text-sm text-ink-muted leading-relaxed">
            10 Fragen – wer von beiden würde das eher tun? Du entscheidest. Dein Ergebnis kommt ins Fotoalbum.
          </p>
        </button>
      </div>

      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mt-10" />
    </div>
  )
}
