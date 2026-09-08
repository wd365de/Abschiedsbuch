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
      <h2 className="font-display text-3xl font-light text-cream leading-snug mb-2">
        Deine Worte
      </h2>
      <p className="font-body text-sm text-cream/70 mb-6">
        Schreib 2–3 Sätze – von Herzen.
      </p>

      <div className="flex flex-col gap-5 mb-6">
        {/* Name */}
        {!anonymous && (
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-cream/60 block mb-3">
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
            style={{ width: 16, height: 16, accentColor: '#009775' }}
          />
          <span className="font-body text-xs text-cream/60">
            Anonym beitragen – dein Name wird nicht angezeigt
          </span>
        </label>

        {/* Message */}
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-cream/60 block mb-3">
            Deine Nachricht
          </label>
          <textarea
            className="input-field resize-none text-base leading-relaxed"
            placeholder={`Was möchtest du ${NAME} auf den Weg geben?`}
            rows={4}
            value={message}
            onChange={(e) => onChange({ message: e.target.value })}
            maxLength={500}
          />
          <p className="font-body text-xs text-cream/50 text-right mt-1">
            {message.length}/500
          </p>

          {/* Schreibhilfe */}
          {!message.trim() && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => insertPrompt(p)}
                  className="font-body text-xs px-2.5 py-1 rounded-full transition-colors"
                  style={{
                    border: '1px solid rgba(250,247,242,0.18)',
                    color: 'rgba(250,247,242,0.55)',
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
