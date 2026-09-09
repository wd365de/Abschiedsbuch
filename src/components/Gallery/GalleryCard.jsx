import { useState } from 'react'
import { createPortal } from 'react-dom'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export default function GalleryCard({ entry }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Karte */}
      <button
        className="block w-full text-left overflow-hidden transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid rgba(44,36,24,0.07)',
          boxShadow: '0 2px 12px rgba(44,36,24,0.06)',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      >
        {/* Foto */}
        {entry.photo_url && (
          <div className="overflow-hidden">
            <img
              src={entry.photo_url}
              alt={`Foto von ${entry.name}`}
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-4">
          {/* Nachricht */}
          <p className="font-body text-sm text-ink leading-relaxed mb-3"
            style={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {entry.message}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2.5"
            style={{ borderTop: '1px solid rgba(44,36,24,0.06)' }}>
            <p className="font-display italic text-sm" style={{ color: '#2C2418' }}>{entry.name}</p>
            <p className="font-body text-xs" style={{ color: '#B5A898' }}>{formatDate(entry.created_at)}</p>
          </div>
        </div>
      </button>

      {/* Modal – via Portal direkt in document.body. Mobil: Vollbild. Ab sm: zentrierter Dialog. */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center sm:p-6"
          style={{ background: 'rgba(11,22,20,0.85)', backdropFilter: 'blur(16px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex flex-col w-full h-full sm:h-auto sm:max-h-[88vh] sm:max-w-2xl sm:rounded-2xl sm:overflow-hidden sm:shadow-2xl"
            style={{ background: 'rgba(250,247,242,0.98)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Schließen-Button */}
            <button
              onClick={() => setOpen(false)}
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

            {/* Foto – volle Breite, so viel Höhe wie möglich */}
            {entry.photo_url ? (
              <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <img
                  src={entry.photo_url}
                  alt={`Foto von ${entry.name}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex-1" />
            )}

            {/* Text-Bereich unten */}
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
                <p className="font-display italic text-lg" style={{ color: '#2C2418' }}>{entry.name}</p>
                <p className="font-body text-sm" style={{ color: '#B5A898' }}>{formatDate(entry.created_at)}</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
