const CATEGORIES = [
  {
    id:          'dankbarkeit',
    emoji:       '💛',
    title:       'Dankbarkeit',
    description: 'Wofür bist du dankbar? Deine Worte der Wertschätzung.',
    accent:      '#C9A84C',
    glow:        'rgba(201,168,76,0.18)',
  },
  {
    id:          'erinnerungen',
    emoji:       '📸',
    title:       'Erinnerungen',
    description: 'Ein schöner oder lustiger Moment, den du gemeinsam erlebt hast.',
    accent:      '#7A8B6B',
    glow:        'rgba(122,139,107,0.18)',
  },
  {
    id:          'wuensche',
    emoji:       '🌟',
    title:       'Wünsche für die Zukunft',
    description: 'Wünsche für eine erfüllte Zeit im Ruhestand.',
    accent:      '#B87068',
    glow:        'rgba(184,112,104,0.18)',
  },
  {
    id:          'humor',
    emoji:       '😊',
    title:       'Humor & Leichtigkeit',
    description: 'Ein Witz, eine lustige Anekdote oder ein Augenzwinkern.',
    accent:      '#6B7A8B',
    glow:        'rgba(107,122,139,0.18)',
  },
]

export default function StepCategory({ selected, onChange, onNext }) {
  return (
    <div className="page-container animate-fade-up">

      <style>{`
        @keyframes shimmerOnce {
          0%   { transform: translateX(-200%) skewX(-20deg); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateX(350%) skewX(-20deg); opacity: 0; }
        }
        .category-sweep::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.15) 30%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0.15) 70%,
            transparent 100%
          );
          animation: shimmerOnce 2.5s ease-in-out 0.6s 1 forwards;
          opacity: 0;
        }
      `}</style>

      {/* Überschrift zentriert */}
      <h2 className="font-display text-4xl font-light text-ink leading-snug mb-2 text-center">
        Welche Art von Eintrag möchtest du hinterlassen?
      </h2>
      <p className="font-body text-base text-ink-muted mb-4 text-center">
        Wähle eine Kategorie, die zu deinem Beitrag passt.
      </p>

      {/* Karten mit Sweep-Container */}
      <div className="flex flex-col gap-3 mb-10" style={{ position: 'relative' }}>
        {/* Sweep-Overlay über alle Karten */}
        <div className="category-sweep" style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10,
          borderRadius: 16,
          overflow: 'hidden',
        }} />

        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="text-left transition-all duration-300 active:scale-[0.98]"
              style={{
                position: 'relative',
                borderRadius: 16,
                padding: '14px 18px',
                border: isSelected
                  ? `1.5px solid ${cat.accent}`
                  : '1.5px solid rgba(44,36,24,0.10)',
                background: isSelected
                  ? `linear-gradient(135deg, ${cat.glow}, rgba(255,255,255,0.85))`
                  : 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: isSelected
                  ? `0 4px 20px ${cat.glow}, 0 1px 4px rgba(0,0,0,0.06)`
                  : '0 2px 10px rgba(44,36,24,0.07), 0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center gap-4">
                {/* Emoji-Badge */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  flexShrink: 0,
                }}>
                  {cat.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    className="font-body font-semibold text-base"
                    style={{
                      color: isSelected ? cat.accent : '#2C2418',
                      margin: 0,
                    }}
                  >
                    {cat.title}
                  </p>
                  <p className="font-body text-sm text-ink-muted mt-0.5" style={{ margin: 0 }}>
                    {cat.description}
                  </p>
                </div>

                {/* Radio-Indikator */}
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: isSelected ? `2px solid ${cat.accent}` : '2px solid rgba(44,36,24,0.15)',
                  background: isSelected ? cat.accent : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  {isSelected && (
                    <span style={{ color: 'white', fontSize: 11, lineHeight: 1 }}>✓</span>
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
