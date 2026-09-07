import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { downloadCSV, downloadZIP } from './AdminExport'
import { Link } from 'react-router-dom'

const CATEGORY_META = {
  'dankbarkeit':     { emoji: '💛', label: 'Dankbarkeit' },
  'erinnerungen':    { emoji: '📸', label: 'Erinnerungen' },
  'wuensche':        { emoji: '🌟', label: 'Wünsche' },
  'humor':           { emoji: '😊', label: 'Humor' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const STORAGE_LIMIT_BYTES = 1_073_741_824 // 1 GB

function StorageBar({ usedBytes }) {
  const pct     = Math.min((usedBytes / STORAGE_LIMIT_BYTES) * 100, 100)
  const usedMB  = (usedBytes / 1_048_576).toFixed(1)
  const limitMB = (STORAGE_LIMIT_BYTES / 1_048_576).toFixed(0)
  const color   = pct > 90 ? '#B87068' : pct > 70 ? '#C9A84C' : '#6BAA8B'
  const label   = pct > 90 ? '⚠️ Fast voll!' : pct > 70 ? '⚠️ Aufmerksamkeit' : '✓ Genug Platz'

  return (
    <div className="bg-white rounded-2xl p-5 border border-ink/5">
      <div className="flex items-center justify-between mb-2">
        <p className="font-body text-xs uppercase tracking-wider text-ink-muted">Foto-Speicher</p>
        <span className="font-body text-xs" style={{ color }}>{label}</span>
      </div>
      <div className="h-2 bg-ink/10 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="font-body text-xs text-ink-muted">
        {usedMB} MB von {limitMB} MB belegt ({pct.toFixed(1)}%)
      </p>
    </div>
  )
}

export default function AdminDashboard({ onLogout }) {
  const [entries, setEntries]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('alle')
  const [zipProgress, setZipProgress] = useState(null)
  const [deleteId, setDeleteId]       = useState(null)
  const [storageUsed, setStorageUsed] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })
    setEntries(data || [])
    setLoading(false)

    // Storage-Verbrauch berechnen
    const { data: files } = await supabase.storage.from('photos').list('', { limit: 10000 })
    if (files) {
      const total = files.reduce((sum, f) => sum + (f.metadata?.size || 0), 0)
      setStorageUsed(total)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (entry) => {
    if (!window.confirm(`Eintrag von „${entry.name}" wirklich löschen?`)) return
    setDeleteId(entry.id)

    if (entry.photo_url) {
      const path = entry.photo_url.split('/photos/')[1]?.split('?')[0]
      if (path) await supabase.storage.from('photos').remove([path])
    }

    await supabase.from('entries').delete().eq('id', entry.id)
    setEntries((prev) => prev.filter((e) => e.id !== entry.id))
    setDeleteId(null)
  }

  const handleZIP = async () => {
    setZipProgress(0)
    await downloadZIP(filtered, (p) => setZipProgress(p))
    setZipProgress(null)
  }

  const filtered = filter === 'alle'
    ? entries
    : entries.filter((e) => e.category === filter)

  const stats = {
    total: entries.length,
    fotos: entries.filter((e) => e.photo_url).length,
  }

  return (
    <div className="min-h-dvh bg-cream-dark">
      {/* Header */}
      <header className="bg-ink text-cream px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display italic text-xl text-gold">Abschiedsbuch – Admin</h1>
            <p className="font-body text-xs text-cream/50 mt-0.5">Verwaltung</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/galerie" className="font-body text-xs text-cream/60 hover:text-cream transition-colors">
              Galerie
            </Link>
            <button
              onClick={onLogout}
              className="font-body text-xs text-cream/60 hover:text-cream transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label: 'Einträge gesamt', value: stats.total },
            { label: 'Mit Foto',        value: stats.fotos },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 text-center border border-ink/5">
              <p className="font-display text-4xl font-light text-gold">{s.value}</p>
              <p className="font-body text-xs text-ink-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Storage Bar */}
        {storageUsed !== null && (
          <div className="mb-8">
            <StorageBar usedBytes={storageUsed} />
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap flex-1">
            {['alle', 'wuensche', 'erinnerungen', 'tipps', 'party'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="font-body text-xs px-3 py-1.5 rounded-full border transition-colors"
                style={{
                  borderColor:     filter === f ? '#C9A84C' : '#D8CFC4',
                  backgroundColor: filter === f ? '#C9A84C' : 'white',
                  color:           filter === f ? '#FAF7F2' : '#8B7D6E',
                }}
              >
                {f === 'alle' ? 'Alle' : (CATEGORY_META[f]?.emoji + ' ' + CATEGORY_META[f]?.label)}
              </button>
            ))}
          </div>

          {/* Export */}
          <div className="flex gap-2">
            <button
              onClick={() => downloadCSV(filtered)}
              className="font-body text-xs border border-ink/20 text-ink px-4 py-2 rounded-full hover:bg-ink/5 transition-colors"
            >
              CSV Export
            </button>
            <button
              onClick={handleZIP}
              disabled={zipProgress !== null}
              className="font-body text-xs bg-gold text-cream px-4 py-2 rounded-full hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {zipProgress !== null ? `ZIP ${zipProgress}%…` : 'Fotos als ZIP'}
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center font-body text-ink-muted py-16">Keine Einträge gefunden.</p>
        ) : (
          <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-ink/5">
                    {['Datum', 'Name', 'Kategorie', 'Nachricht', 'Foto', 'Fotobuch', ''].map((h) => (
                      <th key={h} className="font-body text-xs uppercase tracking-wider text-ink-muted px-4 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => {
                    const meta = CATEGORY_META[entry.category]
                    return (
                      <tr key={entry.id} className="border-b border-ink/5 hover:bg-cream/50 transition-colors">
                        <td className="px-4 py-3 font-body text-xs text-ink-muted whitespace-nowrap">
                          {formatDate(entry.created_at)}
                        </td>
                        <td className="px-4 py-3 font-body text-sm font-medium text-ink whitespace-nowrap">
                          {entry.name}
                        </td>
                        <td className="px-4 py-3 font-body text-xs text-ink-muted whitespace-nowrap">
                          {meta ? `${meta.emoji} ${meta.label}` : entry.category}
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-ink max-w-xs">
                          <p className="line-clamp-2">{entry.message}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {entry.photo_url ? (
                            <a href={entry.photo_url} target="_blank" rel="noreferrer">
                              <img
                                src={entry.photo_url}
                                alt=""
                                className="w-10 h-10 object-cover rounded-lg hover:opacity-80 transition-opacity"
                              />
                            </a>
                          ) : (
                            <span className="text-ink-light text-xs">–</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center font-body text-sm">
                          {entry.fotobuch ? '✅' : '–'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDelete(entry)}
                            disabled={deleteId === entry.id}
                            className="font-body text-xs text-blush hover:text-blush-dark transition-colors disabled:opacity-50"
                          >
                            {deleteId === entry.id ? '…' : 'Löschen'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
