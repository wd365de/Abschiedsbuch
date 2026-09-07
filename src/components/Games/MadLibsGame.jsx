import { useState } from 'react'

const FIELDS = [
  { key: 'name',       label: 'Dein Name',           placeholder: 'z. B. Tante Heidi',  hint: 'Wer hält diese Rede?' },
  { key: 'adjektiv1',  label: 'Ein Adjektiv',         placeholder: 'z. B. chaotisch',    hint: 'Wie würdest du das Paar beschreiben?' },
  { key: 'adjektiv2',  label: 'Noch ein Adjektiv',    placeholder: 'z. B. zärtlich',     hint: 'Positiv oder negativ – egal' },
  { key: 'tier',       label: 'Ein Tier',             placeholder: 'z. B. Pinguin',      hint: 'Irgendein Tier' },
  { key: 'ort',        label: 'Ein Ort',              placeholder: 'z. B. IKEA',         hint: 'Wo könnte man sich kennenlernen?' },
  { key: 'verb',       label: 'Ein Verb (Infinitiv)', placeholder: 'z. B. stolpern',     hint: 'Was man zusammen tun kann' },
  { key: 'zahl',       label: 'Eine Zahl',            placeholder: 'z. B. 7',            hint: 'Irgendeine Zahl' },
  { key: 'substantiv', label: 'Ein Gegenstand',       placeholder: 'z. B. Kühlschrank',  hint: 'Ein beliebiger Gegenstand' },
  { key: 'geraeusch',  label: 'Ein Geräusch',         placeholder: 'z. B. Glucksen',     hint: 'Schreib ein Geräusch aus' },
]

function generateSpeech(f) {
  return [
    `Liebe Hochzeitsgesellschaft,`,
    ``,
    `ich, ${f.name}, kenne Niklas und Alexander nun schon ${f.zahl} Jahre – und ich kann euch versichern: Ein ${f.adjektiv1}eres Paar werdet ihr nirgendwo finden. Nicht mal in ${f.ort}.`,
    ``,
    `Alles begann an jenem schicksalhaften Tag, als Niklas beschloss, ein ${f.tier} als Gesprächseinstieg zu nutzen. Alexander sah das Tier, machte ein leises „${f.geraeusch}" – und von diesem Moment an war klar: Das wird groß.`,
    ``,
    `Seitdem haben die beiden gemeinsam gelernt, zu ${f.verb}, den ${f.substantiv} des anderen zu akzeptieren und immer dann ${f.adjektiv2} zu sein, wenn es am wenigsten erwartet wird.`,
    ``,
    `Liebe Niklas, lieber Alexander: Bleibt so ${f.adjektiv1}, wie ihr seid. Die Welt braucht mehr Paare, die bereit sind, wegen eines ${f.tier}s alles zu riskieren.`,
    ``,
    `Auf euch – und auf noch ${f.zahl} mal ${f.zahl} gemeinsame Jahre! 🥂`,
  ].join('\n')
}

export default function MadLibsGame({ onBack }) {
  const [fields, setFields] = useState({})
  const [done, setDone]     = useState(false)

  const update    = (key, val) => setFields(f => ({ ...f, [key]: val }))
  const allFilled = FIELDS.every(f => (fields[f.key] || '').trim())

  if (done) {
    const speech = generateSpeech(fields)
    return (
      <div className="page-container animate-fade-up">
        <button onClick={() => setDone(false)} className="font-body text-xs text-ink-muted mb-6 flex items-center gap-1 hover:text-ink transition-colors">
          ← Nochmal ausfüllen
        </button>

        <h2 className="font-display text-3xl font-light text-ink mb-1">Eure Rede steht!</h2>
        <p className="font-body text-sm text-ink-muted mb-8">Zum Vorlesen – oder einfach für den Lacher.</p>

        {/* Speech card */}
        <div className="bg-white rounded-2xl border border-gold/20 shadow-sm p-6 mb-6">
          <div className="text-center mb-5">
            <p className="font-body text-xs tracking-widest uppercase text-gold mb-1">Hochzeitsrede</p>
            <p className="font-display italic text-2xl text-ink">von {fields.name}</p>
          </div>
          <div className="h-px bg-gold/20 mb-5" />

          {speech.split('\n').map((line, i) =>
            line
              ? <p key={i} className="font-body text-sm text-ink leading-relaxed mb-3">{line}</p>
              : <div key={i} className="mb-1" />
          )}

          <div className="h-px bg-gold/20 mt-5 mb-4" />
          <p className="font-body text-xs text-center text-ink-muted">Hochzeit Niklas & Alexander · 23. Mai 2026</p>
        </div>

        <p className="font-body text-xs text-center text-ink-muted mb-8">
          📸 Screenshot machen – perfekt fürs Fotoalbum!
        </p>

        <button onClick={onBack} className="btn-ghost w-full text-center py-2">
          Zurück zu den Spielen
        </button>
      </div>
    )
  }

  return (
    <div className="page-container animate-fade-up">
      <button onClick={onBack} className="font-body text-xs text-ink-muted mb-6 flex items-center gap-1 hover:text-ink transition-colors">
        ← Zurück
      </button>

      <div className="text-4xl mb-3">🎤</div>
      <h2 className="font-display text-3xl font-light text-ink mb-2">Die Hochzeitsrede</h2>
      <p className="font-body text-sm text-ink-muted mb-8">
        Füll die Lücken aus – wir übernehmen den Rest.
      </p>

      <div className="flex flex-col gap-6 mb-10">
        {FIELDS.map(f => (
          <div key={f.key}>
            <label className="font-body text-xs tracking-widest uppercase text-ink-muted block mb-1">
              {f.label}
            </label>
            <p className="font-body text-xs text-ink-light mb-2">{f.hint}</p>
            <input
              type={f.key === 'zahl' ? 'number' : 'text'}
              className="input-field"
              placeholder={f.placeholder}
              value={fields[f.key] || ''}
              onChange={e => update(f.key, e.target.value)}
              maxLength={40}
            />
          </div>
        ))}
      </div>

      <button
        className="btn-primary w-full"
        disabled={!allFilled}
        onClick={() => setDone(true)}
      >
        Rede generieren 🎤
      </button>
    </div>
  )
}
