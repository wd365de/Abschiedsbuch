import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { NAME_FULL, TAGLINE } from '../config'

const CONFIG = {
  name: NAME_FULL,
  tagline: TAGLINE,
  subtitle: `Hinterlasst hier eure Worte, Wünsche und Erinnerungen für Herrn Krug.`,
  photoBookText: 'Eure Fotos und Nachrichten werden zu einem gedruckten Abschiedsbuch zusammengestellt.',
}

export default function Home() {
  const [count, setCount] = useState(null)

  useEffect(() => {
    // Nur die Anzahl – Inhalte sind für Gäste per RLS nicht lesbar
    supabase.rpc('entry_count').then(({ data }) => setCount(Number(data) || 0))
  }, [])

  return (
    <div className="h-dvh flex flex-col lg:flex-row bg-ink overflow-hidden">

      {/* Luftbild-Spalte — Mobile: Band oben; Desktop: rechte 2/3 */}
      <div className="relative h-[34dvh] lg:h-full lg:w-2/3 lg:order-last flex-shrink-0">
        <img
          src="/fraunhofer-luftbild.webp"
          alt="Fraunhofer-Campus Hannover"
          className="w-full h-full object-cover object-left"
        />
        {/* Weicher Übergang ins Ink – Mobile nach unten, Desktop nach links */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 lg:hidden"
          style={{ background: 'linear-gradient(to top, #2C2418 0%, rgba(44,36,24,0.55) 45%, transparent 100%)' }}
        />
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-y-0 left-0 w-[30%]"
          style={{ background: 'linear-gradient(to right, #2C2418 0%, rgba(44,36,24,0.6) 40%, transparent 100%)' }}
        />

        {/* Polaroid – Mobile: mittig an der Unterkante des Bandes, über dem Namen */}
        <div className="lg:hidden absolute left-1/2 -bottom-10 -translate-x-1/2 z-20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Polaroid className="w-[170px] rotate-[-2deg]" captionClass="text-[11px] mt-1.5" padClass="p-2 pb-4" />
        </div>
      </div>

      {/* Textspalte — Mobile: unten; Desktop: linke 1/3 */}
      <main className="relative z-10 flex-1 lg:w-1/3 flex flex-col items-center justify-start lg:justify-center px-6 pt-16 pb-8 lg:py-8 text-center overflow-y-auto lg:overflow-visible bg-ink">

        {/* Polaroid – Desktop: über dem Namen, ragt leicht ins Luftbild */}
        <div className="hidden lg:block mb-8 animate-fade-in lg:translate-x-[24%] xl:translate-x-[30%]" style={{ animationDelay: '0.2s' }}>
          <Polaroid className="w-[260px] xl:w-[300px] rotate-[-2deg]" captionClass="text-sm mt-2.5" padClass="p-2.5 pb-6" />
        </div>

        {/* Titel */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-display font-medium text-[clamp(1.75rem,5vw,3rem)] leading-tight text-cream mb-3">
            {CONFIG.name}
          </h1>
          <p className="font-display font-medium text-[clamp(0.95rem,2.2vw,1.35rem)] text-gold-light tracking-wide">
            {CONFIG.tagline}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full max-w-[180px] my-6 animate-fade-in" style={{ animationDelay: '0.25s', background: 'rgba(250,247,242,0.25)' }} />

        {/* Beschreibung */}
        <p
          className="font-body text-cream/90 text-sm md:text-base leading-relaxed max-w-[320px] mb-4 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          {CONFIG.subtitle}
        </p>

        <p
          className="font-body text-xs md:text-sm text-cream/60 leading-relaxed max-w-[320px] mb-8 animate-fade-up"
          style={{ animationDelay: '0.35s' }}
        >
          {CONFIG.photoBookText}
        </p>

        {/* CTA */}
        <div
          className="flex flex-col gap-3 w-full max-w-[280px] animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Link to="/eintrag" className="btn-primary text-center">
            Eintrag hinterlassen
          </Link>
        </div>

        {/* Fortschritt (dezent unter dem Button) */}
        {count !== null && count > 0 && (
          <p
            className="mt-6 font-body text-xs text-cream/70 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            Bereits {count} {count === 1 ? 'Kolleg*in hat' : 'Kolleg*innen haben'} beigetragen
          </p>
        )}

      </main>
    </div>
  )
}

// Polaroid mit Herrn Krug (Bild wird ggf. noch ausgetauscht)
function Polaroid({ className = '', captionClass = '', padClass = '' }) {
  return (
    <div className={`bg-cream ${padClass} shadow-[0_18px_50px_rgba(0,0,0,0.6),0_4px_14px_rgba(0,0,0,0.35)] ${className}`}>
      <div className="w-full aspect-[3/2] overflow-hidden bg-ink/10">
        <img
          src="/krug-hero.webp"
          alt={NAME_FULL}
          className="w-full h-full object-cover"
        />
      </div>
      <p className={`text-center font-display italic text-ink ${captionClass}`}>
        Norbert Krug
      </p>
    </div>
  )
}
