const CATEGORY_LABELS = {
  'dankbarkeit':   'Dankbarkeit',
  'erinnerungen':  'Erinnerungen',
  'wuensche':      'Wünsche für die Zukunft',
  'humor':         'Humor & Leichtigkeit',
  'vermaechtnis':  'Vermächtnis',
}

export default function StepPreview({ formData, onSubmit, onBack, loading, error }) {
  const label = CATEGORY_LABELS[formData.category] || formData.category

  return (
    <div className="page-container animate-fade-up flex flex-col justify-center">
      <h2 className="font-display text-3xl font-light text-cream leading-snug mb-2">
        Alles richtig?
      </h2>
      <p className="font-body text-sm text-cream/70 mb-6">
        Schaut euren Eintrag noch einmal durch – danach wird er gespeichert.
      </p>

      {/* Vorschau-Karte */}
      <div className="rounded-lg overflow-hidden border border-ink/8 mb-6 shadow-sm">

        {/* Foto */}
        {formData.photoPreview && (
          <div className="bg-cream-dark flex items-center justify-center" style={{ maxHeight: '220px', overflow: 'hidden' }}>
            <img
              src={formData.photoPreview}
              alt="Vorschau"
              className="w-full object-contain"
              style={{ maxHeight: '220px' }}
            />
          </div>
        )}

        <div className="bg-white p-5">
          {/* Kategorie */}
          <span
            className="inline-block font-body text-xs px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(0,151,117,0.1)', color: '#009775' }}
          >
            {label}
          </span>

          {/* Nachricht */}
          <p className="font-body text-sm text-ink leading-relaxed mb-5">
            {formData.message}
          </p>

          {/* Footer */}
          <div className="border-t border-ink/8 pt-4">
            <p className="font-display italic text-lg text-ink">
              {formData.anonymous ? 'Anonym' : formData.name}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-blush/10 border border-blush/30 rounded-xl px-4 py-3 mb-6">
          <p className="font-body text-sm text-blush">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          className="btn-primary"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin inline-block" />
              Wird gespeichert…
            </span>
          ) : (
            'Jetzt absenden ✓'
          )}
        </button>
        <button className="btn-ghost text-center py-2" onClick={onBack} disabled={loading}>
          Zurück bearbeiten
        </button>
      </div>
    </div>
  )
}
