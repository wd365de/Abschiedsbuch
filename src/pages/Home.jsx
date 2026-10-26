import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
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

        {/* QR-Code – nur Desktop: Seite schnell aufs Handy holen */}
        <div
          className="hidden lg:flex absolute right-6 bottom-6 z-20 items-center gap-3 bg-cream/95 rounded-xl p-3 pr-4 shadow-[0_10px_30px_rgba(0,0,0,0.45)] animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <QRCodeSVG value={`${window.location.origin}/`} size={88} bgColor="transparent" fgColor="#2C2418" level="M" />
          <p className="font-body text-xs text-ink leading-snug text-left max-w-[110px]">
            Scannen und die Seite auf dem Handy öffnen
          </p>
        </div>

      </div>

      {/* Textspalte — Mobile: unten; Desktop: linke 1/3 */}
      <main className="relative z-10 flex-1 lg:w-1/3 flex flex-col items-center justify-start lg:justify-center px-6 pt-2 pb-8 lg:py-8 text-center overflow-y-auto lg:overflow-visible bg-ink">

        {/* Porträt – mittig über dem Namen, Ränder laufen weich in den Hintergrund aus */}
        <Portrait className="w-[230px] -mb-5 lg:-mb-8 lg:w-[340px] xl:w-[370px] animate-fade-in" />

        {/* Titel */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-display font-medium text-[clamp(1.75rem,5vw,3rem)] leading-tight text-cream mb-3 relative" style={{ textShadow: "0 2px 18px rgba(44,36,24,0.9)" }}>
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
          <Link
            to="/eintrag"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold text-cream font-body font-medium tracking-widest text-sm uppercase py-4 px-8
                       shadow-[0_8px_28px_rgba(0,151,117,0.35)] ring-1 ring-gold-light/40
                       transition-all duration-300 hover:bg-gold-light hover:shadow-[0_10px_36px_rgba(61,186,156,0.5)] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Eintrag hinterlassen
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
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

// Porträt von Herrn Krug, freigestellt (transparenter Hintergrund).
// Unten läuft es per Maske in den Ink-Hintergrund aus, damit der Name
// direkt anschließt; ein dezenter Lichtschein dahinter gibt Tiefe.
const PORTRAIT_MASK = [
  'linear-gradient(to bottom, #000 50%, rgba(0,0,0,0.5) 78%, transparent 96%)',
  'linear-gradient(to right, transparent 0%, #000 12%)',
].join(', ')

function Portrait({ className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ animationDelay: '0.2s' }}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 48% 45% at 50% 35%, rgba(201,168,76,0.16) 0%, transparent 70%)' }}
      />
      <img
        src="/krug-portrait.webp"
        alt={NAME_FULL}
        className="relative w-full h-auto"
        style={{
          WebkitMaskImage: PORTRAIT_MASK,
          maskImage: PORTRAIT_MASK,
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      />
    </div>
  )
}
