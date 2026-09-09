import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getGalleryVisible } from '../lib/settings'
import GalleryFilter from '../components/Gallery/GalleryFilter'
import GalleryGrid from '../components/Gallery/GalleryGrid'

export default function GalleryPage() {
  const [entries, setEntries]   = useState([])
  const [filter, setFilter]     = useState('alle')
  const [sort, setSort]         = useState('newest')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [locked, setLocked]     = useState(false)

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

  if (locked) {
    return (
      <div className="min-h-dvh bg-brand flex flex-col items-center justify-center px-8 text-center">
        <p className="font-display italic text-3xl text-cream mb-3">Kommt bald</p>
        <p className="font-body text-sm text-cream/70 max-w-xs">
          Die Galerie wird zu einem besonderen Moment freigeschaltet.
        </p>
        <Link to="/eintrag" className="btn-primary max-w-[240px] mt-10">
          Eigenen Eintrag hinterlassen
        </Link>
      </div>
    )
  }

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
      {/* Header */}
      <header className="sticky top-0 z-10 border-b" style={{ background: 'rgba(10,20,20,0.75)', backdropFilter: 'blur(12px)', borderColor: 'rgba(250,247,242,0.1)' }}>
        <div className="max-w-3xl lg:max-w-6xl mx-auto px-5 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="font-display italic text-gold-light text-lg">Abschiedsbuch</Link>
          <h1 className="font-display text-lg text-cream tracking-wide">Galerie</h1>
          <Link
            to="/eintrag"
            className="font-body text-xs tracking-widest uppercase transition-colors"
            style={{ color: '#3DBA9C' }}
          >
            + Eintrag
          </Link>
        </div>

        {/* Sticky Filter-Leiste */}
        <div className="max-w-3xl lg:max-w-6xl mx-auto px-5 lg:px-8 pb-3">
          <GalleryFilter active={filter} onChange={setFilter} counts={counts} />
        </div>
      </header>

      <main className="max-w-3xl lg:max-w-6xl mx-auto px-5 lg:px-8 py-5">
        {/* Zeile: Anzahl + Sortierung */}
        <div className="flex items-center justify-between mb-5">
          <p className="font-body text-sm" style={{ color: 'rgba(250,247,242,0.6)' }}>
            {loading ? '…' : `${filtered.length} ${filtered.length === 1 ? 'Eintrag' : 'Einträge'}`}
          </p>
          <button
            onClick={() => setSort(s => s === 'newest' ? 'oldest' : 'newest')}
            className="font-body text-xs transition-colors flex items-center gap-1"
            style={{ color: 'rgba(250,247,242,0.6)' }}
          >
            {sort === 'newest' ? '↓ Neueste' : '↑ Älteste'}
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
          <div className="text-center py-24">
            <p className="font-display italic text-2xl text-cream/40 mb-4">Noch keine Einträge</p>
            <Link to="/eintrag" className="btn-primary max-w-[240px] mx-auto block">
              Erster sein
            </Link>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <GalleryGrid entries={filtered} />
        )}
      </main>
    </div>
  )
}
