import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getGalleryVisible } from '../lib/settings'

const ADVANCE_MS = 9000

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function PraesentationPage() {
  const [entries, setEntries] = useState([])
  const [index, setIndex]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [locked, setLocked]   = useState(false)
  const [paused, setPaused]   = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data: { session } } = await supabase.auth.getSession()
      const isAdmin = !!session

      if (!isAdmin) {
        const visible = await getGalleryVisible()
        if (!visible) {
          setLocked(true)
          setLoading(false)
          return
        }
      }

      const { data } = await supabase
        .from('entries')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: true })
      setEntries(data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (paused || entries.length < 2) return
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % entries.length)
    }, ADVANCE_MS)
    return () => clearTimeout(timerRef.current)
  }, [index, paused, entries.length])

  const next = () => setIndex((i) => (i + 1) % entries.length)
  const prev = () => setIndex((i) => (i - 1 + entries.length) % entries.length)

  if (loading) {
    return (
      <div className="min-h-dvh bg-brand flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (locked) {
    return (
      <div className="min-h-dvh bg-brand flex flex-col items-center justify-center px-8 text-center">
        <p className="font-display italic text-3xl text-cream mb-3">Kommt bald</p>
        <p className="font-body text-sm text-cream/50 max-w-xs">
          Die Präsentation wird zum Übergabe-Moment freigeschaltet.
        </p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-dvh bg-brand flex flex-col items-center justify-center px-8 text-center">
        <p className="font-display italic text-2xl text-cream/40">Noch keine Einträge</p>
        <Link to="/" className="font-body text-xs text-gold mt-6 tracking-widest uppercase">← Zurück</Link>
      </div>
    )
  }

  const entry = entries[index]

  return (
    <div
      className="min-h-dvh bg-brand flex flex-col select-none"
      onClick={() => setPaused((p) => !p)}
    >
      {/* Fortschritt */}
      <div className="flex gap-1 px-6 pt-6">
        {entries.map((_, i) => (
          <div key={i} className="h-0.5 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div
              className="h-full transition-all"
              style={{
                background: '#009775',
                width: i < index ? '100%' : i === index ? (paused ? '100%' : '0%') : '0%',
                transitionDuration: i === index && !paused ? `${ADVANCE_MS}ms` : '200ms',
                transitionTimingFunction: 'linear',
              }}
            />
          </div>
        ))}
      </div>

      {/* Inhalt */}
      <div className="flex-1 flex items-center justify-center px-8 py-10">
        <div key={entry.id} className="max-w-2xl w-full text-center animate-fade-in">
          {entry.photo_url && (
            <div className="mb-8 flex justify-center">
              <img
                src={entry.photo_url}
                alt=""
                className="max-h-[45vh] rounded-2xl shadow-2xl object-contain"
              />
            </div>
          )}
          <p className="font-display italic text-2xl md:text-3xl text-cream leading-relaxed mb-6">
            „{entry.message}"
          </p>
          <p className="font-body text-base text-gold">{entry.name}</p>
          <p className="font-body text-xs text-cream/40 mt-1">{formatDate(entry.created_at)}</p>
        </div>
      </div>

      {/* Steuerung */}
      <div className="flex items-center justify-between px-6 pb-6" onClick={(e) => e.stopPropagation()}>
        <Link to="/" className="font-body text-xs text-cream/40 tracking-widest uppercase hover:text-cream/70 transition-colors">
          ← Beenden
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={prev} className="text-cream/50 hover:text-cream text-xl px-2">‹</button>
          <span className="font-body text-xs text-cream/40 tracking-widest">
            {index + 1} / {entries.length} {paused && '· Pause'}
          </span>
          <button onClick={next} className="text-cream/50 hover:text-cream text-xl px-2">›</button>
        </div>
      </div>
    </div>
  )
}
