import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { NAME_FULL, TAGLINE, NAME } from '../config'

const CONFIG = {
  name: NAME_FULL,
  tagline: TAGLINE,
  subtitle: `Hinterlasst hier eure Worte, Wünsche und Erinnerungen für ${NAME}.`,
  photoBookText: 'Eure Fotos und Nachrichten werden zu einem gedruckten Abschiedsbuch zusammengestellt.',
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

      {/* Luftbild-Hintergrund mit dunklem Overlay für Textkontrast */}
      <div className="absolute inset-0 z-0">
        <img
          src="/fraunhofer-luftbild.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(20,32,42,0.72) 0%, rgba(20,32,42,0.82) 60%, rgba(20,32,42,0.92) 100%)' }}
        />
      </div>

      {/* Krug-Foto als Polaroid – ab Desktop links neben dem Inhalt */}
      <div className="hidden lg:block absolute z-10 left-[5%] xl:left-[8%] top-1/2 -translate-y-1/2 rotate-[-3deg] w-[320px] xl:w-[380px] animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="relative bg-cream p-2.5 pb-6 shadow-[0_18px_50px_rgba(0,0,0,0.6),0_4px_14px_rgba(0,0,0,0.35)]">
          <div className="absolute -top-3 left-[120px] xl:left-[150px] w-14 h-5 -rotate-[5deg] shadow-[0_1px_4px_rgba(0,0,0,0.25)]" style={{ background: 'rgba(61,186,156,0.55)' }} />
          <div className="w-full aspect-[3/2] overflow-hidden bg-ink/10">
            <img
              src="/krug-hero.webp"
              alt={NAME_FULL}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center font-display italic text-sm text-ink mt-2.5">
            Norbert Krug
          </p>
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">

        {/* Titel */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-display font-light text-[clamp(2rem,7vw,4rem)] leading-tight text-cream mb-3">
            {CONFIG.name}
          </h1>
          <p className="font-display italic text-[clamp(1rem,3vw,1.5rem)] text-gold-light">
            {CONFIG.tagline}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full max-w-[220px] my-6 animate-fade-in" style={{ animationDelay: '0.25s', background: 'rgba(250,247,242,0.25)' }} />

        {/* Beschreibung */}
        <p
          className="font-body font-light text-cream/85 text-sm md:text-base leading-relaxed max-w-[340px] md:max-w-lg mb-4 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          {CONFIG.subtitle}
        </p>

        <p
          className="font-body text-xs md:text-sm text-cream/55 leading-relaxed max-w-[340px] md:max-w-md mb-8 animate-fade-up"
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
            style={{ border: '1px solid rgba(250,247,242,0.5)', color: '#FAF7F2' }}
          >
            Galerie ansehen
          </Link>
        </div>

        {/* Fortschritt */}
        {count !== null && count > 0 && (
          <p
            className="font-body text-xs text-cream/45 mt-6 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            Bereits {count} {count === 1 ? 'Kolleg*in hat' : 'Kolleg*innen haben'} beigetragen
          </p>
        )}

        {/* Fotobuch-Link (Admin / ausscheidende Person) */}
        <Link
          to="/fotobuch"
          className="font-body text-xs text-cream/45 underline underline-offset-4 mt-3 hover:text-cream/80 transition-colors animate-fade-in"
          style={{ animationDelay: '0.55s' }}
        >
          Fotobuch ansehen
        </Link>

      </main>
    </div>
  )
}
