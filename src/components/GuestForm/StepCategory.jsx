const CATEGORIES = [
  {
    id:          'gruesse',
    title:       'Grüße',
    description: 'Worte zum Abschied — gern einzeln oder als Team, Gruppe, Abteilung.',
  },
  {
    id:          'erinnerungen',
    title:       'Erinnerungen',
    description: 'Alte Fotos und Erinnerungsbilder, gern mit Zeitangabe oder passender Anekdote.',
  },
  {
    id:          'abschiedsfeier',
    title:       'Abschiedsfeier',
    description: 'Aktuelle Fotos von den Abschiedsfestivitäten (Kuratoriumssitzung + Winter-Info im Dezember).',
  },
]

export default function StepCategory({ selected, onChange, onNext }) {
  return (
    <div className="page-container animate-fade-up flex flex-col justify-center">

      {/* Überschrift zentriert */}
      <h2 className="font-display text-2xl font-light text-cream leading-snug mb-1 text-center">
        Welche Art von Eintrag möchtest du hinterlassen?
      </h2>
      <p className="font-body text-xs text-cream/60 mb-4 text-center">
        Wähle eine Kategorie, die zu deinem Beitrag passt. In allen Kategorien kann mit und ohne Foto beigetragen werden.
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="text-left transition-all duration-200"
              style={{
                borderRadius: 10,
                padding: '10px 16px',
                border: isSelected
                  ? '1px solid #009775'
                  : '1px solid rgba(250,247,242,0.14)',
                background: isSelected
                  ? 'rgba(0,151,117,0.16)'
                  : 'rgba(250,247,242,0.04)',
              }}
            >
              <div className="flex items-center gap-4">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="font-body font-medium text-sm"
                    style={{ margin: 0, color: '#FAF7F2' }}
                  >
                    {cat.title}
                  </p>
                  <p className="font-body text-xs mt-0.5" style={{ margin: 0, color: 'rgba(250,247,242,0.55)' }}>
                    {cat.description}
                  </p>
                </div>

                {/* Radio-Indikator */}
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: isSelected ? '2px solid #009775' : '2px solid rgba(250,247,242,0.25)',
                  background: isSelected ? '#009775' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isSelected && (
                    <span style={{ color: 'white', fontSize: 10, lineHeight: 1 }}>✓</span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button
        className="btn-primary"
        disabled={!selected}
        onClick={onNext}
      >
        Weiter
      </button>
    </div>
  )
}
