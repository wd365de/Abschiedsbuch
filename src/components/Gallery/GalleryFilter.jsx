const FILTERS = [
  { id: 'alle',          label: 'Alle' },
  { id: 'dankbarkeit',   label: 'Dankbarkeit' },
  { id: 'erinnerungen',  label: 'Erinnerungen' },
  { id: 'wuensche',      label: 'Wünsche' },
  { id: 'humor',         label: 'Humor' },
  { id: 'vermaechtnis',  label: 'Vermächtnis' },
]

export default function GalleryFilter({ active, onChange, counts = {} }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-0.5"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {FILTERS.map((f) => {
        const count = f.id === 'alle' ? total : (counts[f.id] || 0)
        const isActive = active === f.id
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className="flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 flex-shrink-0"
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              fontSize: 13,
              fontFamily: 'inherit',
              border: isActive ? '1.5px solid #009775' : '1.5px solid rgba(44,36,24,0.12)',
              background: isActive
                ? 'linear-gradient(135deg, #009775, #3DBA9C)'
                : 'rgba(255,255,255,0.7)',
              color: isActive ? '#FAF7F2' : '#8B7D6E',
              boxShadow: isActive ? '0 2px 10px rgba(201,168,76,0.30)' : 'none',
              fontWeight: isActive ? 600 : 400,
            }}
          >
            <span>{f.label}</span>
            {count > 0 && (
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(201,168,76,0.12)',
                color:      isActive ? 'rgba(250,247,242,0.9)' : '#009775',
                borderRadius: 99,
                padding: '1px 6px',
                fontSize: 11,
                fontWeight: 600,
                minWidth: 18,
                textAlign: 'center',
              }}>{count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
