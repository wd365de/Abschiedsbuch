import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { pdf } from '@react-pdf/renderer'
import { FotobuchDocument } from '../lib/fotobuchPDF'
import { NAME, INSTITUTE, ROLE } from '../config'
import AdminLogin from '../components/Admin/AdminLogin'

const CATEGORIES = [
  { id: 'dankbarkeit',  emoji: '💛', label: 'Dankbarkeit',   color: '#009775', bg: '#E5F5F1' },
  { id: 'erinnerungen', emoji: '📸', label: 'Erinnerungen',  color: '#6BAA8B', bg: '#F0F6F3' },
  { id: 'wuensche',     emoji: '🌟', label: 'Wünsche',       color: '#B87068', bg: '#FAF0EE' },
  { id: 'humor',        emoji: '😊', label: 'Humor',         color: '#6B7A8B', bg: '#F0F1F4' },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

// 4 Einträge pro Seite
function groupIntoPages(entries) {
  const pages = []
  for (let i = 0; i < entries.length; i += 4) pages.push(entries.slice(i, i + 4))
  return pages
}

// A4 Seiten-Wrapper
function A4Page({ children, bg = '#FAF7F2' }) {
  return (
    <div style={{
      width: '210mm', minHeight: '297mm', background: bg,
      margin: '0 auto 24px', boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
      position: 'relative', overflow: 'hidden', pageBreakAfter: 'always',
    }}>
      {/* Doppelter Goldrahmen */}
      <div style={{ position: 'absolute', inset: '7mm',  border: '0.6px solid #009775', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', inset: '9.5mm', border: '0.3px solid rgba(201,168,76,0.3)', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ padding: '14mm 14mm 14mm', minHeight: '297mm', boxSizing: 'border-box' }}>
        {children}
      </div>
    </div>
  )
}

// Deckblatt
function CoverPage() {
  return (
    <A4Page>
      <div style={{ height: '269mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Georgia,serif', fontSize: '10px', letterSpacing: '7px', color: '#009775', textTransform: 'uppercase', marginBottom: '28px' }}>
          Abschiedsbuch
        </p>
        <Rule color="#009775" />
        <h1 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: '56px', fontWeight: 300, color: '#2C2418', lineHeight: 1.1, margin: '20px 0 0', textAlign: 'center' }}>{NAME}</h1>
        <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: '16px', fontStyle: 'italic', color: '#009775', margin: '8px 0 20px' }}>{ROLE} · {INSTITUTE}</p>
        <Rule color="#009775" />
        <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'italic', fontSize: '15px', color: '#B5A898', maxWidth: '130mm', lineHeight: 1.9, marginTop: '40px' }}>
          „Der Ruhestand ist nicht das Ende, sondern der Anfang eines neuen Kapitels voller Möglichkeiten."
        </p>
      </div>
    </A4Page>
  )
}

// Dekorative Trennlinie
function Rule({ color = '#009775', my = '0' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: `${my} 0`, width: '100%', justifyContent: 'center' }}>
      <div style={{ height: '1px', width: '36px', background: `linear-gradient(to right, transparent, ${color})` }} />
      <span style={{ color, fontSize: '10px' }}>✦</span>
      <div style={{ height: '1px', width: '36px', background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  )
}

// Kategorie-Trennseite
function CategoryPage({ cat }) {
  return (
    <A4Page bg={cat.bg}>
      <div style={{ height: '269mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px', lineHeight: 1 }}>{cat.emoji}</div>
        <h2 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: '52px', fontWeight: 300, color: '#2C2418', lineHeight: 1.1, margin: '0 0 16px' }}>
          {cat.label}
        </h2>
        <Rule color={cat.color} />
      </div>
    </A4Page>
  )
}

// ── Deterministischer Pseudozufall ───────────────────────────
function prng(seed, min = 0, max = 1) {
  let h = 0
  const s = String(seed)
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return min + (Math.abs(h) % 10000) / 10000 * (max - min)
}

// ── Hintergrund-Dekor ─────────────────────────────────────────
const DECO = ['♥','✦','◆','✿','♡','❋','★','·','❤','〜','◇','✼','∿','♪']

function BackgroundDeco({ pageIndex, color }) {
  return (
    <>
      {Array.from({ length: 28 }, (_, i) => {
        const x   = prng(`${pageIndex}${i}x`, 0, 100)
        const y   = prng(`${pageIndex}${i}y`, 0, 100)
        const sz  = prng(`${pageIndex}${i}s`, 9, 22)
        const op  = prng(`${pageIndex}${i}o`, 0.05, 0.20)
        const rot = prng(`${pageIndex}${i}r`, -60, 60)
        const sym = DECO[Math.floor(prng(`${pageIndex}${i}m`, 0, DECO.length - 0.01))]
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            fontSize: `${sz}px`, color, opacity: op,
            transform: `rotate(${rot}deg)`,
            pointerEvents: 'none', userSelect: 'none', lineHeight: 1, zIndex: 1,
          }}>{sym}</div>
        )
      })}
    </>
  )
}

// ── Klebeband ─────────────────────────────────────────────────
function Tape({ color, angle = -35, top = '-8px', left = '14px' }) {
  return (
    <div style={{
      position: 'absolute', top, left,
      width: '32px', height: '13px',
      background: color + '60',
      borderRadius: '1px',
      transform: `rotate(${angle}deg)`,
      zIndex: 5,
      boxShadow: '0 1px 3px rgba(0,0,0,0.10)',
    }} />
  )
}

// ── Polaroid ──────────────────────────────────────────────────
function Polaroid({ entry, cat, posStyle }) {
  const rot     = prng(entry.id,       -6, 6)
  const tapeAng = prng(entry.id + 't', -55, 55)
  const tapeX   = prng(entry.id + 'p',  8,  52)
  return (
    <div style={{
      position: 'absolute',
      background: 'white',
      padding: '6px 6px 22px 6px',
      boxShadow: '0 6px 22px rgba(0,0,0,0.26), 0 2px 5px rgba(0,0,0,0.12)',
      transform: `rotate(${rot}deg)`,
      zIndex: 3,
      ...posStyle,
    }}>
      <Tape color={cat.color} angle={tapeAng} left={`${tapeX}px`} />
      {/* Quadratischer Ausschnitt, Bildausschnitt oben → Gesichter sichtbar */}
      <div style={{ width: '100%', aspectRatio: '1/1', background: '#F0EBE1', overflow: 'hidden' }}>
        <img src={entry.photo_url} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
      </div>
      <div style={{ textAlign: 'center', paddingTop: '4px', paddingLeft: '2px', paddingRight: '2px' }}>
        <p style={{
          fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'italic',
          fontSize: '10px', color: '#2C2418', margin: '0 0 3px', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>„{entry.message}"</p>
        <p style={{ fontFamily: 'Georgia,serif', fontSize: '8.5px', color: cat.color, margin: 0, letterSpacing: '0.5px' }}>
          — {entry.name}
        </p>
      </div>
    </div>
  )
}

// ── Zettelkarte (kein Foto) ───────────────────────────────────
function NoteCard({ entry, cat, posStyle }) {
  const rot     = prng(entry.id,       -5, 5)
  const tapeAng = prng(entry.id + 't', -55, 55)
  return (
    <div style={{
      position: 'absolute',
      background: cat.bg,
      border: `1px solid ${cat.color}35`,
      padding: '12px 15px 13px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.13)',
      transform: `rotate(${rot}deg)`,
      zIndex: 3,
      ...posStyle,
    }}>
      <Tape color={cat.color} angle={tapeAng} />
      <p style={{
        fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'italic',
        fontSize: '12.5px', lineHeight: 1.85, color: '#2C2418', margin: '0 0 9px',
        display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>„{entry.message}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ height: '0.5px', flex: 1, background: `linear-gradient(to right, transparent, ${cat.color}60)` }} />
        <span style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: '13px', color: '#2C2418' }}>
          {entry.name}
        </span>
        <div style={{ height: '0.5px', flex: 1, background: `linear-gradient(to left, transparent, ${cat.color}60)` }} />
      </div>
      <p style={{ fontFamily: 'Georgia,serif', fontSize: '8px', color: '#8B7D6E', margin: 0, textAlign: 'center' }}>
        {formatDate(entry.created_at)}
      </p>
    </div>
  )
}

// ── 5 Seiten-Templates (4 Positionen je) ─────────────────────
// Quadratische Polaroids: width=83mm → Foto 83×83mm + caption~20mm = ~109mm hoch
// Inhaltsbereich: 182mm breit × 255mm hoch → 2 Reihen à ~109mm füllen ~230mm
const TEMPLATES = [
  // T0: 2×2 klassisch versetzt
  [
    { left: '2mm',  top: '6mm',   width: '86mm' },
    { left: '92mm', top: '1mm',   width: '84mm' },
    { left: '0mm',  top: '124mm', width: '88mm' },
    { left: '90mm', top: '130mm', width: '86mm' },
  ],
  // T1: links groß · rechts kleiner · versetzt
  [
    { left: '0mm',  top: '8mm',   width: '92mm' },
    { left: '96mm', top: '2mm',   width: '82mm' },
    { left: '4mm',  top: '126mm', width: '84mm' },
    { left: '92mm', top: '120mm', width: '86mm' },
  ],
  // T2: Zickzack – abwechselnd links/rechts
  [
    { left: '4mm',  top: '4mm',   width: '84mm' },
    { left: '90mm', top: '14mm',  width: '88mm' },
    { left: '2mm',  top: '122mm', width: '88mm' },
    { left: '92mm', top: '114mm', width: '84mm' },
  ],
  // T3: rechts groß · links kleiner
  [
    { left: '0mm',  top: '10mm',  width: '82mm' },
    { left: '86mm', top: '3mm',   width: '92mm' },
    { left: '3mm',  top: '122mm', width: '86mm' },
    { left: '93mm', top: '128mm', width: '84mm' },
  ],
  // T4: obere Reihe eng · untere weit auseinander
  [
    { left: '6mm',  top: '3mm',   width: '82mm' },
    { left: '92mm', top: '8mm',   width: '84mm' },
    { left: '0mm',  top: '120mm', width: '84mm' },
    { left: '94mm', top: '116mm', width: '84mm' },
  ],
]

// ── Albumseite ────────────────────────────────────────────────
function EntriesPage({ pageEntries, cat, pageIndex }) {
  const template = TEMPLATES[pageIndex % TEMPLATES.length]
  // Fotos zuerst, dann Zettel
  const items = [
    ...pageEntries.filter(e => e.photo_url),
    ...pageEntries.filter(e => !e.photo_url),
  ].slice(0, 4)

  return (
    <A4Page>
      {/* Hintergrund-Dekor */}
      <BackgroundDeco pageIndex={pageIndex} color={cat.color} />

      {/* Kategorie-Label */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', marginBottom: '2mm' }}>
        <span style={{ fontFamily: 'Georgia,serif', fontSize: '8px', letterSpacing: '4px', textTransform: 'uppercase', color: cat.color + '80' }}>
          {cat.emoji} {cat.label}
        </span>
      </div>

      {/* Foto-/Zettel-Bereich */}
      <div style={{ position: 'relative', height: '255mm' }}>
        {items.map((entry, i) =>
          entry.photo_url
            ? <Polaroid  key={entry.id} entry={entry} cat={cat} posStyle={template[i] || template[0]} />
            : <NoteCard  key={entry.id} entry={entry} cat={cat} posStyle={template[i] || template[0]} />
        )}
      </div>

      {/* Fußzeile */}
      <div style={{ position: 'absolute', bottom: '10mm', left: '14mm', right: '14mm', textAlign: 'center', zIndex: 5 }}>
        <p style={{ fontFamily: 'Georgia,serif', fontSize: '7px', color: cat.color + '50', letterSpacing: '3px', margin: 0 }}>
          ✦ {NAME.toUpperCase()} · {INSTITUTE.toUpperCase()} ✦
        </p>
      </div>
    </A4Page>
  )
}

export default function FotobuchPreview() {
  const [session,     setSession]     = useState(undefined) // undefined = loading
  const [entries,     setEntries]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [format,      setFormat]      = useState('a4')
  const [pdfLoading,  setPdfLoading]  = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    supabase.from('entries').select('*').eq('approved', true).order('created_at').then(({ data: e }) => {
      setEntries(e || [])
      setLoading(false)
    })
  }, [session])

  const handlePDF = async () => {
    setPdfLoading(true)
    try {
      const blob = await pdf(<FotobuchDocument entries={entries} format={format} />).toBlob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `abschiedsbuch-${format}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setPdfLoading(false)
    }
  }

  if (session === undefined) {
    return (
      <div className="min-h-dvh bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <AdminLogin />
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-ink flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  // Seiten zählen
  let pageCount = 1 // Cover
  CATEGORIES.forEach(cat => {
    const catEntries = entries.filter(e => e.category === cat.id)
    if (catEntries.length > 0) {
      pageCount += 1 // Trennseite
      pageCount += groupIntoPages(catEntries).length
    }
  })
  return (
    <div style={{ background: '#3a3530', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Toolbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100, background: '#2C2418',
        padding: '12px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#009775', fontSize: '18px' }}>Abschiedsbuch</span>
          <span style={{ fontFamily: 'sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Fotobuch-Vorschau · {pageCount} Seiten · {entries.length} Einträge
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Format-Auswahl */}
          {['a4', 'quadrat'].map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              style={{
                background: format === f ? '#009775' : 'transparent',
                color: format === f ? '#FAF7F2' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${format === f ? '#009775' : 'rgba(255,255,255,0.2)'}`,
                padding: '6px 14px', fontFamily: 'sans-serif', fontSize: '11px',
                letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px',
              }}
            >
              {f === 'a4' ? 'A4 Hoch' : 'Quadrat'}
            </button>
          ))}
          {/* PDF Download */}
          <button
            onClick={handlePDF}
            disabled={pdfLoading}
            style={{
              background: pdfLoading ? '#A68730' : '#009775',
              color: '#FAF7F2', border: 'none',
              padding: '8px 20px', fontFamily: 'sans-serif', fontSize: '11px',
              letterSpacing: '2px', textTransform: 'uppercase', cursor: pdfLoading ? 'wait' : 'pointer', borderRadius: '2px',
            }}
          >
            {pdfLoading ? 'Erstelle PDF…' : '⬇ PDF herunterladen'}
          </button>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif', fontSize: '11px', textDecoration: 'none', marginLeft: 4 }}>
            ← Admin
          </Link>
        </div>
      </div>

      <div style={{ paddingTop: '32px' }}>
        <CoverPage />
        {CATEGORIES.map(cat => {
          const catEntries = entries.filter(e => e.category === cat.id)
          if (catEntries.length === 0) return null
          return (
            <div key={cat.id}>
              <CategoryPage cat={cat} />
              {groupIntoPages(catEntries).map((page, idx) => (
                <EntriesPage key={idx} pageEntries={page} cat={cat} pageIndex={idx} />
              ))}
            </div>
          )
        })}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        @media print {
          body { margin: 0; background: white !important; }
          div[style*="sticky"]  { display: none !important; }
          div[style*="3a3530"]  { background: white !important; padding: 0 !important; }
          div[style*="210mm"]   { box-shadow: none !important; margin: 0 auto !important; }
        }
      `}</style>
    </div>
  )
}
