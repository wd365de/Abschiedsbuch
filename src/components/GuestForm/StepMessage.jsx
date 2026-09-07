import { NAME } from '../../config'

export default function StepMessage({
  name, message,
  onChange, onNext, onBack,
}) {
  return (
    <div className="page-container animate-fade-up">
      <h2 className="font-display text-3xl font-light text-cream leading-snug mb-2">
        Deine Worte
      </h2>
      <p className="font-body text-sm text-cream/70 mb-10">
        Schreib 2–3 Sätze – von Herzen.
      </p>

      <div className="flex flex-col gap-8 mb-10">
        {/* Name */}
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
        </div>

      </div>

      <div className="flex flex-col gap-3">
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!name.trim() || !message.trim()}
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
