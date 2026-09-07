import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { QUIZ_QUESTIONS, QUIZ_RESULTS } from '../../lib/quizData'

export default function QuizGame({ onBack }) {
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState([])
  const [done,      setDone]      = useState(false)
  const [animating, setAnimating] = useState(false)

  // Speichern
  const [saveName,  setSaveName]  = useState('')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [saveError, setSaveError] = useState(false)

  const answer = (choice) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      const next = [...answers, choice]
      setAnswers(next)
      if (current + 1 >= QUIZ_QUESTIONS.length) setDone(true)
      else setCurrent(c => c + 1)
      setAnimating(false)
    }, 150)
  }

  const reset = () => {
    setAnswers([]); setCurrent(0); setDone(false)
    setSaveName(''); setSaved(false); setSaveError(false)
  }

  const handleSave = async () => {
    if (!saveName.trim() || saving || saved) return
    setSaving(true)
    setSaveError(false)
    const { error } = await supabase.from('quiz_results').insert({
      name:         saveName.trim(),
      answers,
      result_title: result.title,
    })
    setSaving(false)
    if (error) setSaveError(true)
    else setSaved(true)
  }

  if (done) {
    const niklasCount    = answers.filter(a => a === 'niklas').length
    const alexanderCount = QUIZ_QUESTIONS.length - niklasCount
    const result         = QUIZ_RESULTS.find(r => niklasCount >= r.min && niklasCount <= r.max)

    return (
      <div className="page-container animate-fade-up">
        <h2 className="font-display text-3xl font-light text-ink mb-2 text-center">Dein Ergebnis</h2>
        <p className="font-body text-sm text-ink-muted mb-8 text-center">So siehst du das Brautpaar.</p>

        {/* Result card */}
        <div className="bg-white rounded-2xl border border-gold/20 shadow-sm p-6 mb-6 text-center">
          <p className="font-body text-xs tracking-widest uppercase text-gold mb-3">Niklas oder Alexander?</p>
          <div className="text-5xl mb-4">{result.emoji}</div>
          <h3 className="font-display text-2xl text-ink mb-3">{result.title}</h3>
          <p className="font-body text-sm text-ink-muted leading-relaxed mb-6">{result.text}</p>

          <div className="h-px bg-gold/20 mb-5" />

          {/* Score bars */}
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex items-center gap-3">
              <span className="font-body text-xs text-ink-muted w-20 text-right">💙 Niklas</span>
              <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full transition-all duration-700"
                  style={{ width: `${(niklasCount / QUIZ_QUESTIONS.length) * 100}%` }} />
              </div>
              <span className="font-body text-xs font-medium text-ink w-6">{niklasCount}×</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-body text-xs text-ink-muted w-20 text-right">❤️ Alexander</span>
              <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-blush rounded-full transition-all duration-700"
                  style={{ width: `${(alexanderCount / QUIZ_QUESTIONS.length) * 100}%` }} />
              </div>
              <span className="font-body text-xs font-medium text-ink w-6">{alexanderCount}×</span>
            </div>
          </div>

          {/* Antwort-Dots */}
          <div className="flex justify-center flex-wrap gap-1 mb-4">
            {answers.map((a, i) => (
              <span key={i} title={QUIZ_QUESTIONS[i].text} className="text-lg leading-none">
                {a === 'niklas' ? '💙' : '❤️'}
              </span>
            ))}
          </div>

          <div className="h-px bg-gold/20 mb-3" />
          <p className="font-body text-xs text-ink-muted">Hochzeit Niklas & Alexander · 23. Mai 2026</p>
        </div>

        {/* Ins Fotoalbum speichern */}
        {!saved ? (
          <div className="bg-gold/10 border border-gold/25 rounded-2xl p-5 mb-6">
            <p className="font-body text-sm font-medium text-ink mb-1">📖 Ins Fotoalbum?</p>
            <p className="font-body text-xs text-ink-muted mb-4">
              Dein Ergebnis landet dann auf einer eigenen Seite im gedruckten Album.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field flex-1 text-sm"
                placeholder="Dein Name"
                value={saveName}
                onChange={e => setSaveName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                maxLength={60}
              />
              <button
                className="btn-primary px-5 py-2 text-sm whitespace-nowrap"
                disabled={!saveName.trim() || saving}
                onClick={handleSave}
              >
                {saving ? '…' : 'Speichern'}
              </button>
            </div>
            {saveError && (
              <p className="font-body text-xs text-blush mt-2">Fehler – bitte nochmal versuchen.</p>
            )}
          </div>
        ) : (
          <div className="bg-gold/10 border border-gold/25 rounded-2xl p-5 mb-6 text-center">
            <p className="font-body text-sm text-ink">✓ Gespeichert! Dein Ergebnis kommt ins Fotoalbum.</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button className="btn-secondary" onClick={reset}>Nochmal spielen</button>
          <button onClick={onBack} className="btn-ghost text-center py-2">Zurück zu den Spielen</button>
        </div>
      </div>
    )
  }

  const q        = QUIZ_QUESTIONS[current]
  const progress = (current / QUIZ_QUESTIONS.length) * 100

  return (
    <div className="page-container animate-fade-up">
      <button onClick={onBack} className="font-body text-xs text-ink-muted mb-6 flex items-center gap-1 hover:text-ink transition-colors">
        ← Zurück
      </button>

      <div className="flex items-center justify-between mb-2">
        <p className="font-body text-xs text-ink-muted">Frage {current + 1} / {QUIZ_QUESTIONS.length}</p>
      </div>
      <div className="h-[3px] bg-[#E8E0D5] rounded-full mb-10 overflow-hidden">
        <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className={`text-center mb-10 transition-opacity duration-150 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-6xl mb-6">{q.emoji}</div>
        <h2 className="font-display text-2xl font-light text-ink leading-snug px-2">{q.text}</h2>
      </div>

      <div className="flex flex-col gap-4">
        <button onClick={() => answer('niklas')} disabled={animating}
          className="rounded-2xl p-5 border-2 border-gold/30 bg-[#FBF5E6] hover:border-gold/70 hover:bg-gold/10 transition-all duration-200 active:scale-[0.97] font-body font-medium text-lg text-ink">
          💙 Niklas
        </button>
        <button onClick={() => answer('alexander')} disabled={animating}
          className="rounded-2xl p-5 border-2 border-blush/30 bg-[#FAF0EE] hover:border-blush/60 hover:bg-blush/10 transition-all duration-200 active:scale-[0.97] font-body font-medium text-lg text-ink">
          ❤️ Alexander
        </button>
      </div>
    </div>
  )
}
