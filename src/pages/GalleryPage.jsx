import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import GalleryFilter from '../components/Gallery/GalleryFilter'
import GalleryGrid from '../components/Gallery/GalleryGrid'

// Galerie – nur mit Login erreichbar (Herr Krug oder Admin, siehe KrugPage).
export default function GalleryPage({ onLogout }) {
  const [entries, setEntries]   = useState([])
  const [filter, setFilter]     = useState('alle')
  const [sort, setSort]         = useState('newest')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Einträge konnten nicht geladen werden.')
      } else {
        setEntries(data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  const counts = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1
    return acc
  }, {})

  const filtered = (filter === 'alle' ? entries : entries.filter((e) => e.category === filter))
    .slice()
    .sort((a, b) => sort === 'newest'
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
    )

  return (
    <div className="min-h-dvh bg-brand">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 border-b" style={{ background: 'rgba(15,24,32,0.82)', backdropFilter: 'blur(14px)', borderColor: 'rgba(250,247,242,0.08)' }}>
        <div className="max-w-3xl lg:max-w-6xl mx-auto px-5 lg:px-8 py-3 flex items-center justify-between">
          <p className="font-display italic text-gold-light text-lg">Abschiedsbuch</p>
          <button
            onClick={onLogout}
            className="font-body text-xs tracking-widest uppercase text-cream/70 hover:text-cream transition-colors"
          >
            Abmelden
          </button>
        </div>

        {/* Sticky Filter-Leiste */}
        <div className="max-w-3xl lg:max-w-6xl mx-auto px-5 lg:px-8 pb-3">
          <GalleryFilter active={filter} onChange={setFilter} counts={counts} />
        </div>
      </header>

      {/* Hero-Intro */}
      <section className="max-w-3xl lg:max-w-6xl mx-auto px-5 lg:px-8 pt-10 lg:pt-14 pb-6 text-center">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold-light/80 mb-3">
          Galerie
        </p>
        <h1 className="font-display font-light text-cream mb-3" style={{ fontSize: 'clamp(2rem,5vw,3rem)', lineHeight: 1.15 }}>
          Was wir Ihnen mitgeben
        </h1>
        <div className="flex items-center justify-center gap-3 my-5" aria-hidden="true">
          <span style={{ display: 'inline-block', height: 1, width: 48, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6))' }} />
          <span className="text-gold-light/70">✦</span>
          <span style={{ display: 'inline-block', height: 1, width: 48, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.6))' }} />
        </div>
        <p className="font-body text-cream/70 max-w-xl mx-auto" style={{ fontSize: 15, lineHeight: 1.7 }}>
          Alle Grüße, Erinnerungen und Fotos Ihrer Kolleg*innen —
          dicht an dicht zu einem Album.
        </p>
      </section>

      <main className="max-w-3xl lg:max-w-6xl mx-auto px-5 lg:px-8 pb-16">
        {/* Zeile: Anzahl + Sortierung */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-body text-sm" style={{ color: 'rgba(250,247,242,0.6)' }}>
            {loading ? '…' : `${filtered.length} ${filtered.length === 1 ? 'Eintrag' : 'Einträge'}`}
          </p>
          <button
            onClick={() => setSort(s => s === 'newest' ? 'oldest' : 'newest')}
            className="font-body text-xs tracking-widest uppercase transition-colors flex items-center gap-1"
            style={{ color: 'rgba(250,247,242,0.6)' }}
          >
            {sort === 'newest' ? '↓ Neueste zuerst' : '↑ Älteste zuerst'}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-center text-blush font-body py-12">{error}</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display italic text-cream/50 mb-6" style={{ fontSize: 'clamp(1.5rem,3.5vw,2rem)' }}>
              Noch keine Einträge in dieser Kategorie
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <GalleryGrid entries={filtered} />
        )}
      </main>
    </div>
  )
}
