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
    supabase
      .from('entries')
      .select('*', { count: 'exact', head: true })
      .then(({ count }) => setCount(count ?? 0))
  }, [])

  return (
    <div className="h-dvh flex flex-col lg:flex-row bg-ink overflow-hidden">

      {/* Luftbild-Spalte — Mobile: Band oben (40dvh); Desktop: rechte 2/3 */}
      <div className="relative h-[40dvh] lg:h-full lg:w-2/3 lg:order-last flex-shrink-0">
        <div className="w-full h-full overflow-hidden">
          <img
            src="/fraunhofer-luftbild.webp"
            alt="Fraunhofer-Campus Hannover"
            className="w-full h-full object-cover object-left"
          />
        </div>

        {/* Krug-Polaroid – Desktop: linksbündig in der Bildhälfte */}
        <div className="hidden lg:block absolute left-[5%] xl:left-[7%] top-1/2 -translate-y-1/2 rotate-[-3deg] w-[300px] xl:w-[360px] animate-fade-in z-20" style={{ animationDelay: '0.5s' }}>
          <div className="relative bg-cream p-2.5 pb-6 shadow-[0_18px_50px_rgba(0,0,0,0.6),0_4px_14px_rgba(0,0,0,0.35)]">
            <div className="absolute -top-3 left-[110px] xl:left-[140px] w-14 h-5 -rotate-[5deg] shadow-[0_1px_4px_rgba(0,0,0,0.25)]" style={{ background: 'rgba(61,186,156,0.55)' }} />
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

        {/* Krug-Polaroid – Mobile: ueberlappt am unteren Rand des Luftbildes */}
        <div className="lg:hidden absolute left-5 bottom-0 translate-y-1/2 rotate-[-3deg] w-[180px] animate-fade-in z-20" style={{ animationDelay: '0.3s' }}>
          <div className="relative bg-cream p-2 pb-4 shadow-[0_10px_28px_rgba(0,0,0,0.55),0_3px_8px_rgba(0,0,0,0.3)]">
            <div className="absolute -top-2 left-[65px] w-10 h-3 -rotate-[5deg] shadow-[0_1px_3px_rgba(0,0,0,0.25)]" style={{ background: 'rgba(61,186,156,0.55)' }} />
            <div className="w-full aspect-[3/2] overflow-hidden bg-ink/10">
              <img
                src="/krug-hero.webp"
                alt={NAME_FULL}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center font-display italic text-[11px] text-ink mt-1.5">
              Norbert Krug
            </p>
          </div>
        </div>
      </div>

      {/* Textspalte — Mobile: unten; Desktop: linke 1/3 */}
      <main className="relative flex-1 lg:w-1/3 flex flex-col items-center justify-center px-6 pt-20 pb-8 lg:py-8 text-center overflow-y-auto bg-ink">

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

        {/* CTAs */}
        <div
          className="flex flex-col gap-3 w-full max-w-[280px] animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Link to="/eintrag" className="btn-primary text-center">
            Eintrag hinterlassen
          </Link>
          <Link
            to="/galerie"
            className="text-center font-body font-medium tracking-widest text-sm uppercase py-4 px-8 transition-all duration-300 active:scale-[0.98]"
            style={{ border: '1px solid rgba(250,247,242,0.5)', color: '#FAF7F2' }}
          >
            Galerie ansehen
          </Link>
        </div>

        {/* Fortschritt + Fotobuch-Link */}
        <div
          className="mt-6 flex flex-col items-center gap-1 animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          {count !== null && count > 0 && (
            <span className="font-body text-xs text-cream/70">
              Bereits {count} {count === 1 ? 'Kolleg*in hat' : 'Kolleg*innen haben'} beigetragen
            </span>
          )}
          <Link
            to="/fotobuch"
            className="font-body text-xs text-cream/70 underline underline-offset-4 hover:text-gold-light transition-colors"
          >
            Fotobuch ansehen
          </Link>
        </div>

      </main>
    </div>
  )
}
