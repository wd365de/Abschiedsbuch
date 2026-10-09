import { NAME } from '../../config'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

// Deterministischer Pseudo-Zufall aus der entry-id — fuer sanfte,
// aber stabile Variation (Tape-Position, Rotation).
function prng(seed, min = 0, max = 1) {
  let h = 0
  const s = String(seed)
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return min + (Math.abs(h) % 10000) / 10000 * (max - min)
}

const CATEGORY_ACCENT = {
  gruesse:        { color: '#C9A84C', label: 'Grüße' },
  erinnerungen:   { color: '#009775', label: 'Erinnerungen' },
  abschiedsfeier: { color: '#B87068', label: 'Abschiedsfeier' },
}

export default function GalleryCard({ entry, onOpen }) {
  const accent = CATEGORY_ACCENT[entry.category] || { color: '#009775', label: '' }
  const tapeLeft = prng(entry.id + 't', 20, 60)
  const tapeRot  = prng(entry.id + 'r', -8, 8)

  return (
    <button
      className="relative block w-full text-left overflow-visible transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
      style={{ cursor: 'pointer' }}
      onClick={onOpen}
    >
      {/* Washi-Tape in Kategorie-Farbe */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -7, left: `${tapeLeft}%`,
          width: 44, height: 14,
          background: accent.color + '99',
          transform: `rotate(${tapeRot}deg)`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.14)',
          zIndex: 3, pointerEvents: 'none',
          borderRadius: 1,
        }}
      />

      <div
        className="overflow-hidden"
        style={{
          background: '#FBF8F2',
          borderRadius: 14,
          border: '1px solid rgba(44,36,24,0.08)',
          boxShadow: '0 4px 18px rgba(44,36,24,0.08), 0 1px 3px rgba(44,36,24,0.04)',
        }}
      >
        {entry.photo_url && (
          <div className="overflow-hidden" style={{ background: '#F0EBE1' }}>
            <img
              src={entry.photo_url}
              alt={`Foto von ${entry.name}`}
              className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        )}

        <div className="px-5 pt-4 pb-4">
          {/* Kategorie-Label (dezent) */}
          <p
            className="font-body uppercase mb-2.5"
            style={{ fontSize: 10, letterSpacing: 2.5, color: accent.color }}
          >
            {accent.label}
          </p>

          <p
            className="font-body text-ink mb-4"
            style={{
              fontSize: 14, lineHeight: 1.65,
              display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {entry.message}
          </p>

          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: `1px solid ${accent.color}22` }}
          >
            <p className="font-body font-medium" style={{ color: '#2C2418', fontSize: 14 }}>
              {entry.name}
            </p>
            <p className="font-body" style={{ color: '#B5A898', fontSize: 11 }}>
              {formatDate(entry.created_at)}
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}
