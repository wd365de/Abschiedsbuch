import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export default function GalleryModal({ entries, index, onClose, onPrev, onNext }) {
  const entry = entries[index]
  const touchStartX = useRef(null)
  const [imageLoading, setImageLoading] = useState(true)

  const hasPrev = index > 0
  const hasNext = index < entries.length - 1

  // Tastatur-Navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      else if (e.key === 'ArrowRight' && hasNext) onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [hasPrev, hasNext, onClose, onPrev, onNext])

  // Beim Index-Wechsel Loading-Indikator wieder anzeigen (falls Bild)
  useEffect(() => {
    setImageLoading(!!entry?.photo_url)
  }, [index, entry?.photo_url])

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 60) {
      if (dx < 0 && hasNext) onNext()
      else if (dx > 0 && hasPrev) onPrev()
    }
    touchStartX.current = null
  }

  if (!entry) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center sm:p-6"
      style={{ background: 'rgba(11,22,20,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Prev-Button – links neben dem Dialog */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Voriger Eintrag"
          className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 items-center justify-center z-10"
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(250,247,242,0.15)',
            color: '#FAF7F2', fontSize: 22,
            border: '1px solid rgba(250,247,242,0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          ‹
        </button>
      )}
      {/* Next-Button – rechts */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Nächster Eintrag"
          className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 items-center justify-center z-10"
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(250,247,242,0.15)',
            color: '#FAF7F2', fontSize: 22,
            border: '1px solid rgba(250,247,242,0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          ›
        </button>
      )}

      <div
        className="relative flex flex-col w-full h-full sm:h-auto sm:max-h-[88vh] sm:max-w-2xl sm:rounded-2xl sm:overflow-hidden sm:shadow-2xl"
        style={{ background: 'rgba(250,247,242,0.98)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Schließen */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center"
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(44,36,24,0.08)',
            color: '#2C2418', fontSize: 18,
            border: '1px solid rgba(44,36,24,0.12)',
          }}
          aria-label="Schließen"
        >
          ✕
        </button>

        {/* Zähler oben links */}
        <div
          className="absolute top-4 left-4 z-10 font-body text-xs px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(44,36,24,0.08)', color: '#2C2418', border: '1px solid rgba(44,36,24,0.12)' }}
        >
          {index + 1} / {entries.length}
        </div>

        {/* Foto */}
        {entry.photo_url ? (
          <div className="flex-1 overflow-hidden relative" style={{ minHeight: 0 }}>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-ink/20 border-t-ink/60 rounded-full animate-spin" />
              </div>
            )}
            <img
              key={entry.id}
              src={entry.photo_url}
              alt={`Foto von ${entry.name}`}
              className="w-full h-full object-contain"
              onLoad={() => setImageLoading(false)}
            />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Text unten */}
        <div
          className="flex-shrink-0 px-6 py-5 overflow-y-auto"
          style={{
            maxHeight: '40dvh',
            borderTop: '1px solid rgba(44,36,24,0.08)',
            background: 'rgba(250,247,242,0.98)',
          }}
        >
          <p className="font-body text-base text-ink leading-relaxed mb-4" style={{ lineHeight: 1.7 }}>
            {entry.message}
          </p>
          <div className="flex items-center justify-between">
            <p className="font-display font-medium text-lg" style={{ color: '#2C2418' }}>{entry.name}</p>
            <p className="font-body text-sm" style={{ color: '#B5A898' }}>{formatDate(entry.created_at)}</p>
          </div>
        </div>

        {/* Prev/Next auf Mobile als Leiste unten im Dialog */}
        <div className="sm:hidden flex items-center justify-between gap-3 px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(44,36,24,0.08)' }}>
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex-1 py-2.5 rounded-full font-body text-sm"
            style={{
              background: hasPrev ? 'rgba(44,36,24,0.08)' : 'transparent',
              color: hasPrev ? '#2C2418' : '#B5A898',
              border: '1px solid rgba(44,36,24,0.12)',
            }}
          >
            ‹ Zurück
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex-1 py-2.5 rounded-full font-body text-sm"
            style={{
              background: hasNext ? 'rgba(44,36,24,0.08)' : 'transparent',
              color: hasNext ? '#2C2418' : '#B5A898',
              border: '1px solid rgba(44,36,24,0.12)',
            }}
          >
            Weiter ›
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
