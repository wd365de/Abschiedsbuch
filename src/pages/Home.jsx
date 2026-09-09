import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { NAME_FULL, INSTITUTE, ROLE } from '../config'

const CONFIG = {
  name: NAME_FULL,
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
    <div className="h-dvh flex flex-col bg-brand overflow-hidden relative">

      {/* Portraitfoto als Polaroid – ab Desktop links neben dem Inhalt */}
      <div className="hidden lg:block absolute z-10 left-[8%] xl:left-[12%] top-1/2 -translate-y-1/2 rotate-[-4deg] w-[190px] xl:w-[230px] animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="relative bg-cream p-2.5 pb-6 shadow-[0_18px_50px_rgba(0,0,0,0.5),0_4px_14px_rgba(0,0,0,0.3)]">
          <div className="absolute -top-3 left-[70px] w-14 h-5 -rotate-[5deg] shadow-[0_1px_4px_rgba(0,0,0,0.25)]" style={{ background: 'rgba(61,186,156,0.55)' }} />
          <div className="w-full aspect-square overflow-hidden bg-ink/10">
            <img
              src="/norbert-krug.jpg"
              alt={NAME_FULL}
              className="w-full h-full object-cover object-[62%_22%]"
            />
          </div>
          <p className="text-center font-display italic text-sm text-ink mt-2.5">
            Norbert Krug
          </p>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">

        {/* Date chip */}
        {CONFIG.date && (
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold-light mb-6 animate-fade-in">
            {CONFIG.date}
          </p>
        )}

        {/* Title */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-display font-light text-[clamp(2rem,9vw,4.5rem)] leading-tight text-cream mb-2">
            Zum Abschied
          </h1>
          <p className="font-display italic text-[clamp(0.95rem,3.5vw,1.5rem)] text-gold-light">
            {CONFIG.name}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full max-w-[220px] my-6 animate-fade-in" style={{ animationDelay: '0.25s', background: 'rgba(250,247,242,0.2)' }} />

        {/* Subtitle */}
        <p
          className="font-body font-light text-cream/80 text-sm md:text-base leading-relaxed max-w-[320px] md:max-w-lg mb-6 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          {CONFIG.subtitle}
        </p>

        {/* Photo book hint */}
        <p
          className="font-body text-xs text-cream/50 leading-relaxed max-w-[320px] md:max-w-md mb-8 animate-fade-up"
          style={{ animationDelay: '0.35s' }}
        >
          {CONFIG.photoBookText}
        </p>

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
            className="text-center sm:w-56 font-body font-medium tracking-widest text-sm uppercase py-4 px-8 transition-all duration-300 active:scale-[0.98]"
            style={{ border: '1px solid rgba(250,247,242,0.4)', color: '#FAF7F2' }}
          >
            Galerie ansehen
          </Link>
        </div>

        {/* Fortschritt */}
        {count !== null && count > 0 && (
          <p
            className="font-body text-xs text-cream/40 mt-6 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            Bereits {count} {count === 1 ? 'Kolleg*in hat' : 'Kolleg*innen haben'} beigetragen
          </p>
        )}

      </main>
    </div>
  )
}
