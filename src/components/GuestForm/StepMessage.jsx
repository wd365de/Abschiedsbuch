import { NAME } from '../../config'

const PROMPTS = [
  'Ich erinnere mich besonders an…',
  'Was ich sehr an dir geschätzt habe…',
  'Ich wünsche dir für die Zukunft…',
]

export default function StepMessage({
  name, message, anonymous,
  onChange, onNext, onBack,
}) {
  const insertPrompt = (prompt) => {
    if (!message.trim()) onChange({ message: prompt + ' ' })
  }

  const nameValid = anonymous || name.trim()

  return (
    <div className="page-container animate-fade-up flex flex-col justify-center">
      <h2 className="font-display text-3xl md:text-4xl font-light text-cream text-shadow-soft leading-snug mb-2">
        Deine Worte
      </h2>
      <p className="font-body text-sm md:text-base text-cream/85 text-shadow-soft mb-6">
        Schreib 2–3 Sätze – von Herzen.
      </p>

      <div className="flex flex-col gap-5 mb-6">
        {/* Name */}
        {!anonymous && (
          <div>
            <label className="font-body text-sm tracking-widest uppercase text-cream/80 text-shadow-soft block mb-3">
              Dein Name
            </label>
            <input
              type="text"
              className="input-field text-lg"
              placeholder="z. B. Max Mustermann"
              value={name}
              onChange={(e) => onChange({ name: e.target.value })}
              maxLength={80}
            />
          </div>
        )}

        {/* Anonym-Option */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => onChange({ anonymous: e.target.checked })}
            style={{ width: 18, height: 18, accentColor: '#009775' }}
          />
          <span className="font-body text-sm text-cream/85 text-shadow-soft">
            Anonym beitragen – dein Name wird nicht angezeigt
          </span>
        </label>

        {/* Message */}
        <div>
          <label className="font-body text-sm tracking-widest uppercase text-cream/80 text-shadow-soft block mb-3">
            Deine Nachricht
          </label>
          <textarea
            className="input-field resize-none text-base md:text-lg leading-relaxed"
            placeholder={`Was möchtest du ${NAME} auf den Weg geben?`}
            rows={4}
            value={message}
            onChange={(e) => onChange({ message: e.target.value })}
            maxLength={500}
          />
          <p className="font-body text-sm text-cream/65 text-right mt-1">
            {message.length}/500
          </p>

          {/* Schreibhilfe */}
          {!message.trim() && (
            <div className="flex flex-wrap gap-2 mt-3">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => insertPrompt(p)}
                  className="font-body text-sm px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    border: '1px solid rgba(250,247,242,0.24)',
                    color: 'rgba(250,247,242,0.8)',
                    background: 'rgba(15,24,32,0.35)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      <div className="flex flex-col gap-3">
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!nameValid || !message.trim()}
        >
          Vorschau ansehen
        </button>
        <button className="btn-ghost text-center py-2" onClick={onBack}>
          Zurück
        </button>
      </div>
    </div>
  )
}
