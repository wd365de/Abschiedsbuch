import { CATEGORY_LABELS } from '../../config'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

const CATEGORY_COLOR = {
  privat:   '#009775',
  team:     '#C9A84C',
  sonstige: '#B87068',
}

export default function GalleryCard({ entry, onOpen }) {
  const accent = {
    color: CATEGORY_COLOR[entry.category] || '#009775',
    label: CATEGORY_LABELS[entry.category] || '',
  }

  return (
    <button
      className="relative block w-full text-left overflow-visible transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
      style={{ cursor: 'pointer' }}
      onClick={onOpen}
    >
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
