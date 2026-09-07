import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { NAME, INSTITUTE, ROLE } from '../config'

const CONFIG = {
  name: NAME,
  date: '',
  subtitle: `Hinterlasst eure Worte, Wünsche und schönsten Erinnerungen an die gemeinsame Zeit am ${INSTITUTE}.`,
  photoBookText: `Eure Fotos und Nachrichten werden zu einem gedruckten Abschiedsbuch für den ${ROLE} zusammengestellt.`,
}

export default function Home() {
  const [count, setCount] = useState(null)

  useEffect(() => {
    supabase
      .from('entries')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => setCount(count ?? 0))
  }, [])

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{
        backgroundImage: "linear-gradient(rgba(10,20,20,0.45), rgba(10,20,20,0.55)), url('/fraunhofer-hero.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center">

        {/* Date chip */}
        {CONFIG.date && (
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold-light mb-10 animate-fade-in">
            {CONFIG.date}
          </p>
        )}

        {/* Title */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-display font-light text-[clamp(2.5rem,12vw,6rem)] leading-tight text-cream mb-3">
            Zum Abschied
          </h1>
          <p className="font-display italic text-[clamp(1rem,5vw,2rem)] text-gold-light">
            {CONFIG.name}
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10 w-full max-w-[280px] animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <div className="h-px flex-1 bg-cream/30" />
          <span className="text-gold-light text-sm">✦</span>
          <div className="h-px flex-1 bg-cream/30" />
        </div>

        {/* Subtitle */}
        <p
          className="font-body font-light text-cream/85 text-base md:text-lg leading-relaxed max-w-[320px] md:max-w-xl mb-8 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          {CONFIG.subtitle}
        </p>

        {/* Photo book hint */}
        <div
          className="flex items-start gap-3 rounded-2xl px-5 py-4 max-w-[320px] md:max-w-md mb-10 text-left animate-fade-up"
          style={{
            animationDelay: '0.35s',
            background: 'rgba(250,247,242,0.12)',
            border: '1px solid rgba(250,247,242,0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="text-xl leading-none mt-0.5">📖</span>
          <p className="font-body text-sm text-cream/90 leading-relaxed">
            {CONFIG.photoBookText}
          </p>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px] sm:max-w-none justify-center animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Link to="/eintrag" className="btn-primary text-center sm:w-56">
            Eintrag hinterlassen
          </Link>
          <Link
            to="/galerie"
            className="text-center sm:w-56 font-body font-medium tracking-widest text-sm uppercase py-4 px-8 transition-all duration-300 active:scale-[0.98] rounded-none"
            style={{ border: '1px solid rgba(250,247,242,0.5)', color: '#FAF7F2' }}
          >
            Galerie ansehen
          </Link>
        </div>

        {/* Fortschritt */}
        {count !== null && count > 0 && (
          <p
            className="font-body text-xs text-cream/60 mt-8 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            Bereits {count} {count === 1 ? 'Kolleg*in hat' : 'Kolleg*innen haben'} beigetragen
          </p>
        )}

      </main>
    </div>
  )
}
