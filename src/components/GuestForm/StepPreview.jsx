const CATEGORY_META = {
  'wuensche':        { label: 'Wünsche für das Hochzeitspaar', color: '#C9A84C', bg: '#FBF5E6' },
  'erinnerungen':    { label: 'Erinnerungen',                  color: '#7A8B6B', bg: '#F2F4EF' },
  'tipps':           { label: 'Tipps für eine gelungene Ehe',  color: '#B87068', bg: '#FAF0EE' },
  'party':           { label: 'Highlight des Tages',           color: '#6B7A8B', bg: '#F0F1F4' },
  // Alte Kategorien (Rückwärtskompatibilität)
  'ehe':             { label: 'Für eure Ehe',                  color: '#C9A84C', bg: '#FBF5E6' },
  'schlechte-tage':  { label: 'Für schlechte Tage',            color: '#B87068', bg: '#FAF0EE' },
  'zukunft':         { label: 'Für eure Zukunft',              color: '#6B7A8B', bg: '#F0F1F4' },
}

export default function StepPreview({ formData, onSubmit, onBack, loading, error }) {
  const meta = CATEGORY_META[formData.category] || { label: formData.category, color: '#C9A84C', bg: '#FBF5E6' }

  return (
    <div className="page-container animate-fade-up">
      <h2 className="font-display text-3xl font-light text-ink leading-snug mb-2">
        Alles richtig?
      </h2>
      <p className="font-body text-sm text-ink-muted mb-8">
        Schaut euren Eintrag noch einmal durch – danach wird er gespeichert.
      </p>

      {/* Vorschau-Karte */}
      <div className="rounded-2xl overflow-hidden border border-ink/8 mb-8 shadow-sm">

        {/* Foto */}
        {formData.photoPreview && (
          <div className="bg-cream-dark flex items-center justify-center" style={{ maxHeight: '260px', overflow: 'hidden' }}>
            <img
              src={formData.photoPreview}
              alt="Vorschau"
              className="w-full object-contain"
              style={{ maxHeight: '260px' }}
            />
          </div>
        )}

        <div className="bg-white p-5">
          {/* Kategorie */}
          <span
            className="inline-block font-body text-xs px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: meta.color + '18', color: meta.color }}
          >
            {meta.label}
          </span>

          {/* Nachricht */}
          <p className="font-body text-sm text-ink leading-relaxed mb-5">
            {formData.message}
          </p>

          {/* Footer */}
          <div className="border-t border-ink/8 pt-4">
            <p className="font-display italic text-lg text-ink">{formData.name}</p>
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
