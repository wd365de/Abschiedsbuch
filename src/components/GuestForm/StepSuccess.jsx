import { Link } from 'react-router-dom'
import { NAME } from '../../config'

export default function StepSuccess({ name }) {
  return (
    <div className="page-container flex flex-col items-center justify-center text-center animate-fade-up">
      <div
        className="mb-6 animate-fade-in flex items-center justify-center"
        style={{
          animationDelay: '0.2s',
          width: 48, height: 48, borderRadius: '50%',
          border: '1px solid rgba(0,151,117,0.5)',
        }}
      >
        <span style={{ color: '#009775', fontSize: 20 }}>✓</span>
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
        className="h-px w-full max-w-[200px] mb-10 animate-fade-in"
        style={{ animationDelay: '0.4s', background: 'rgba(250,247,242,0.15)' }}
      />

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
