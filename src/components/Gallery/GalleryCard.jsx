function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

export default function GalleryCard({ entry, onOpen }) {
  return (
    <button
      className="block w-full text-left overflow-hidden transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
      style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid rgba(44,36,24,0.07)',
        boxShadow: '0 2px 12px rgba(44,36,24,0.06)',
        cursor: 'pointer',
      }}
      onClick={onOpen}
    >
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
        <p
          className="font-body text-sm text-ink leading-relaxed mb-3"
          style={{ lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {entry.message}
        </p>

        <div
          className="flex items-center justify-between pt-2.5"
          style={{ borderTop: '1px solid rgba(44,36,24,0.06)' }}
        >
          <p className="font-display font-medium text-sm" style={{ color: '#2C2418' }}>{entry.name}</p>
          <p className="font-body text-xs" style={{ color: '#B5A898' }}>{formatDate(entry.created_at)}</p>
        </div>
      </div>
    </button>
  )
}
