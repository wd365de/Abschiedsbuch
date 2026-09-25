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
      <h2 className="font-display text-3xl md:text-4xl font-light text-cream text-shadow-soft leading-snug mb-2 text-center">
        Welche Art von Eintrag möchtest du hinterlassen?
      </h2>
      <p className="font-body text-sm md:text-base text-cream/85 text-shadow-soft mb-6 text-center">
        Wähle eine Kategorie, die zu deinem Beitrag passt. In allen Kategorien kann mit und ohne Foto beigetragen werden.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={`text-left transition-all duration-200 ${isSelected ? 'card-glass-selected' : 'card-glass'}`}
              style={{
                borderRadius: 10,
                padding: '16px 20px',
              }}
            >
              <div className="flex items-center gap-4">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="font-body font-medium text-base md:text-lg"
                    style={{ margin: 0, color: '#FAF7F2' }}
                  >
                    {cat.title}
                  </p>
                  <p className="font-body text-sm md:text-base mt-1" style={{ margin: 0, color: 'rgba(250,247,242,0.8)' }}>
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
