import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { getGalleryVisible, setGalleryVisible } from '../../lib/settings'
import { downloadCSV, downloadZIP } from './AdminExport'
import { Link } from 'react-router-dom'

const CATEGORY_META = {
  'dankbarkeit':     { label: 'Dankbarkeit' },
  'erinnerungen':    { label: 'Erinnerungen' },
  'wuensche':        { label: 'Wünsche' },
  'humor':           { label: 'Humor' },
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
  const color   = pct > 90 ? '#B87068' : pct > 70 ? '#009775' : '#6BAA8B'
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

function GalleryToggle({ visible, onToggle, saving }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-ink/5 flex items-center justify-between mb-6">
      <div>
        <p className="font-body text-sm font-medium text-ink">Galerie-Sichtbarkeit</p>
        <p className="font-body text-xs text-ink-muted mt-0.5">
          {visible
            ? 'Öffentlich sichtbar – jeder mit Link kann die Galerie ansehen.'
            : 'Gesperrt – Gäste sehen "Kommt bald", bis ihr freischaltet.'}
        </p>
      </div>
      <button
        onClick={onToggle}
        disabled={saving}
        className="font-body text-xs px-4 py-2 rounded-full transition-colors disabled:opacity-50"
        style={{
          background: visible ? '#009775' : '#B87068',
          color: '#FAF7F2',
        }}
      >
        {saving ? '…' : visible ? 'Galerie sperren' : 'Galerie freigeben'}
      </button>
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
  const [galleryVisible, setGalleryVisibleState] = useState(false)
  const [galleryToggling, setGalleryToggling]     = useState(false)
  const [approvingId, setApprovingId] = useState(null)

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

    setGalleryVisibleState(await getGalleryVisible())
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

  const handleApprove = async (entry) => {
    setApprovingId(entry.id)
    const { error } = await supabase.from('entries').update({ approved: !entry.approved }).eq('id', entry.id)
    if (!error) {
      setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, approved: !e.approved } : e))
    }
    setApprovingId(null)
  }

  const handleGalleryToggle = async () => {
    setGalleryToggling(true)
    const next = !galleryVisible
    const { error } = await setGalleryVisible(next)
    if (!error) setGalleryVisibleState(next)
    setGalleryToggling(false)
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
    total:     entries.length,
    fotos:     entries.filter((e) => e.photo_url).length,
    ausstehend: entries.filter((e) => !e.approved).length,
  }

  return (
    <div className="min-h-dvh bg-brand">
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
            <Link to="/praesentation" className="font-body text-xs text-cream/60 hover:text-cream transition-colors">
              Präsentation
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
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Einträge gesamt', value: stats.total },
            { label: 'Mit Foto',        value: stats.fotos },
            { label: 'Ausstehend',      value: stats.ausstehend },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 text-center border border-ink/5">
              <p className="font-display text-4xl font-light text-gold">{s.value}</p>
              <p className="font-body text-xs text-ink-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Storage Bar */}
        {storageUsed !== null && (
          <div className="mb-6">
            <StorageBar usedBytes={storageUsed} />
          </div>
        )}

        <GalleryToggle visible={galleryVisible} onToggle={handleGalleryToggle} saving={galleryToggling} />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap flex-1">
            {['alle', 'dankbarkeit', 'erinnerungen', 'wuensche', 'humor'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="font-body text-xs px-3 py-1.5 rounded-full border transition-colors"
                style={{
                  borderColor:     filter === f ? '#009775' : '#D8CFC4',
                  backgroundColor: filter === f ? '#009775' : 'white',
                  color:           filter === f ? '#FAF7F2' : '#8B7D6E',
                }}
              >
                {f === 'alle' ? 'Alle' : CATEGORY_META[f]?.label}
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
          <p className="text-center font-body text-cream/70 py-16">Keine Einträge gefunden.</p>
        ) : (
          <div className="bg-white rounded-2xl border border-ink/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-ink/5">
                    {['Datum', 'Name', 'Kategorie', 'Nachricht', 'Foto', 'Status', ''].map((h) => (
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
                          {meta ? meta.label : entry.category}
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
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleApprove(entry)}
                            disabled={approvingId === entry.id}
                            className="font-body text-xs px-2.5 py-1 rounded-full transition-colors disabled:opacity-50"
                            style={{
                              background: entry.approved ? 'rgba(0,151,117,0.12)' : 'rgba(184,112,104,0.12)',
                              color: entry.approved ? '#009775' : '#B87068',
                            }}
                          >
                            {approvingId === entry.id ? '…' : entry.approved ? '✓ Freigegeben' : 'Freigeben'}
                          </button>
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
