import { Link } from 'react-router-dom'

// Anpassbare Informationen für das Abschiedsbuch
const CONFIG = {
  name: 'Institutsleitung',
  date: '',
  subtitle: 'Hinterlasst eure Worte, Glückwünsche und schönsten Erinnerungen.',
  photoBookText: 'Eure Fotos und Nachrichten werden zu einem gedruckten Abschiedsbuch zusammengestellt.',
}

export default function Home() {
  return (
    <div className="min-h-dvh bg-cream flex flex-col overflow-hidden">
      {/* Top ornament bar */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">

        {/* Date chip */}
        {CONFIG.date && (
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-10 animate-fade-in">
            {CONFIG.date}
          </p>
        )}

        {/* Title */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="font-display font-light text-[clamp(2.5rem,12vw,6rem)] leading-tight text-ink mb-3">
            Zum Abschied
          </h1>
          <p className="font-display italic text-[clamp(1rem,5vw,2rem)] text-gold">
            {CONFIG.name}
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10 w-full max-w-[280px] animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <div className="h-px flex-1 bg-gold/30" />
          <span className="text-gold text-sm">✦</span>
          <div className="h-px flex-1 bg-gold/30" />
        </div>

        {/* Subtitle */}
        <p
          className="font-body font-light text-ink-muted text-base leading-relaxed max-w-[320px] mb-8 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          {CONFIG.subtitle}
        </p>

        {/* Photo book hint */}
        <div
          className="flex items-start gap-3 bg-gold/10 border border-gold/30 rounded-2xl px-5 py-4 max-w-[320px] mb-10 text-left animate-fade-up"
          style={{ animationDelay: '0.35s' }}
        >
          <span className="text-xl leading-none mt-0.5">📖</span>
          <p className="font-body text-sm text-ink-muted leading-relaxed">
            {CONFIG.photoBookText}
          </p>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col gap-3 w-full max-w-[320px] animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Link to="/eintrag" className="btn-primary text-center">
            Eintrag hinterlassen
          </Link>
          <Link to="/galerie" className="btn-secondary text-center">
            Galerie ansehen
          </Link>
        </div>

      </main>

      {/* Bottom ornament bar */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
    </div>
  )
}
