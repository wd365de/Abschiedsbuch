import { QRCodeSVG } from 'qrcode.react'
import { Link } from 'react-router-dom'

const TARGET_URL = 'https://na26.vercel.app/eintrag'

const GOLD  = '#C9A84C'
const INK   = '#2C2418'
const CREAM = '#FAF7F2'
const MUTED = '#8B7D6E'
const LIGHT = '#B5A898'

const B  = 3   // Beschnitt mm
const P1 = 97  // Panel 1 – innen
const P2 = 100 // Panel 2 – mitte
const P3 = 100 // Panel 3 – Cover
const H  = 210 // Höhe Endformat

const mm = (v) => `${v}mm`

function Gold({ my = 4 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: `${my}mm 0` }}>
      <div style={{ flex: 1, height: 0.4, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
      <span style={{ color: GOLD, fontSize: 8 }}>✦</span>
      <div style={{ flex: 1, height: 0.4, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
    </div>
  )
}

function QR({ size = 30 }) {
  return (
    <QRCodeSVG
      value={TARGET_URL}
      size={size * 3.78}
      bgColor={CREAM}
      fgColor={INK}
      level="H"
      imageSettings={{ src: '/logo-na.svg', height: size * 0.28 * 3.78, width: size * 0.28 * 3.78, excavate: true }}
      style={{ display: 'block', width: mm(size), height: mm(size) }}
    />
  )
}

// ─── Panel-Inhalt (alle drei gleich) ──────────────────────────────────────────

function Panel({ width, bg = CREAM }) {
  return (
    <div style={{ width: mm(width), height: mm(H), background: bg, boxSizing: 'border-box', padding: '10mm 8mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', textAlign: 'center' }}>

      {/* Oben: Datum + Namen */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontFamily: 'Georgia,serif', fontSize: 11, fontWeight: 600, letterSpacing: 5, color: GOLD, textTransform: 'uppercase', margin: '0 0 5mm' }}>
          23. Mai 2026
        </p>
        <h1 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 48, fontWeight: 400, color: INK, margin: 0, lineHeight: 1 }}>
          Niklas
        </h1>
        <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'italic', fontSize: 26, color: GOLD, margin: '2mm 0' }}>
          &amp;
        </p>
        <h1 style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 48, fontWeight: 400, color: INK, margin: 0, lineHeight: 1 }}>
          Alexander
        </h1>
      </div>

      {/* Mitte: QR-Code */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Gold my={3} />
        <QR size={32} />
        <Gold my={3} />
      </div>

      {/* Unten: Text + URL */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'italic', fontSize: 15, color: MUTED, lineHeight: 1.8, margin: '0 0 3mm' }}>
          Scannt den Code und hinterlasst<br />
          uns Fotos &amp; Worte für unser<br />
          gemeinsames Fotoalbum.
        </p>
        <p style={{ fontFamily: 'Georgia,serif', fontSize: 9, color: LIGHT, margin: 0, wordBreak: 'break-all' }}>
          na26.vercel.app
        </p>
      </div>

    </div>
  )
}

function OuterP1() { return <Panel width={P1} /> }
function OuterP2() { return <Panel width={P2} bg="#F5F1EB" /> }
function OuterP3() { return <Panel width={P3} /> }

// ─── Druckbogen (flach) ───────────────────────────────────────────────────────
function Bogen() {
  const totalW = B + P1 + P2 + P3 + B
  const totalH = B + H + B
  const foldAt = [B + P1, B + P1 + P2]

  return (
    <div className="druckbogen" style={{ margin: '0 auto', position: 'relative' }}>
      <div style={{ position: 'relative', width: mm(totalW), height: mm(totalH), background: '#fff', border: '0.5px solid #ccc', boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', inset: mm(B), background: CREAM }} />
        <div style={{ position: 'absolute', top: mm(B), left: mm(B), display: 'flex', height: mm(H) }}>
          <OuterP1 /><OuterP2 /><OuterP3 />
        </div>
        {foldAt.map((x, i) => (
          <div key={i} style={{ position: 'absolute', left: mm(x), top: 0, bottom: 0, width: 0, borderLeft: `0.5px dashed ${GOLD}` }}>
            <span style={{ position: 'absolute', top: 2, left: 2, fontFamily: 'sans-serif', fontSize: 7, color: GOLD, letterSpacing: 1 }}>FALZ</span>
          </div>
        ))}
        {[[0,0],[totalW,0],[0,totalH],[totalW,totalH]].map(([cx, cy], i) => {
          const hw = 4, hh = 4, gap = 1
          const rx = cx === 0 ? gap : cx - hw - gap
          const ry = cy === 0 ? gap : cy - hh - gap
          return (
            <div key={i} style={{ position: 'absolute', left: mm(rx), top: mm(ry), width: mm(hw), height: mm(hh) }}>
              <div style={{ position: 'absolute', top: cy === 0 ? 0 : '100%', left: 0, right: 0, height: 0, borderTop: '0.4px solid #999' }} />
              <div style={{ position: 'absolute', left: cx === 0 ? 0 : '100%', top: 0, bottom: 0, width: 0, borderLeft: '0.4px solid #999' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 3D-Falz-Vorschau ─────────────────────────────────────────────────────────
// Zeigt den Tischaufsteller gefaltet als Dreiecksprismensäule
const S = 0.36 // Skalierung für Vorschau

function ScaledPanel({ width, bg, children }) {
  return (
    <div style={{ width: mm(width * S), height: mm(H * S), overflow: 'hidden', background: bg, position: 'relative', flexShrink: 0 }}>
      <div style={{ transform: `scale(${S})`, transformOrigin: 'top left', width: mm(width), height: mm(H), position: 'absolute', top: 0, left: 0 }}>
        {children}
      </div>
    </div>
  )
}

function FoldedPreview() {
  return (
    <div className="no-print" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 56px' }}>
      <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 32 }}>
        So sieht es gefaltet aus
      </p>

      {/* 3D Prismen-Ansicht */}
      <div style={{ perspective: '1000px', perspectiveOrigin: '50% 40%' }}>
        <div style={{ display: 'flex', transformStyle: 'preserve-3d', transform: 'rotateX(6deg)' }}>

          {/* Panel 1 – links, nach hinten-links gefaltet */}
          <div style={{ transformStyle: 'preserve-3d', transform: 'rotateY(54deg)', transformOrigin: '100% 50%' }}>
            <ScaledPanel width={P1} bg={CREAM}><OuterP1 /></ScaledPanel>
            {/* Seitenschatten innen */}
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 12, background: 'linear-gradient(to left, rgba(0,0,0,0.18), transparent)', pointerEvents: 'none' }} />
          </div>

          {/* Panel 2 – mitte, leicht nach vorne */}
          <div style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.45)', position: 'relative', zIndex: 2 }}>
            <ScaledPanel width={P2} bg="#F5F1EB"><OuterP2 /></ScaledPanel>
          </div>

          {/* Panel 3 – Cover, nach hinten-rechts gefaltet */}
          <div style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-54deg)', transformOrigin: '0% 50%' }}>
            <ScaledPanel width={P3} bg={CREAM}><OuterP3 /></ScaledPanel>
            {/* Seitenschatten innen */}
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 12, background: 'linear-gradient(to right, rgba(0,0,0,0.18), transparent)', pointerEvents: 'none' }} />
          </div>

        </div>

        {/* Bodenschatten */}
        <div style={{
          margin: '0 auto', width: '70%',
          height: 20, marginTop: -4,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }} />
      </div>

      {/* Panel-Beschriftungen */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24, fontFamily: 'sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase' }}>
        <span style={{ width: mm(P1 * S), textAlign: 'center' }}>Panel 1</span>
        <span style={{ width: mm(P2 * S), textAlign: 'center' }}>Panel 2</span>
        <span style={{ width: mm(P3 * S), textAlign: 'center' }}>Cover</span>
      </div>
    </div>
  )
}

// ─── Hauptseite ───────────────────────────────────────────────────────────────
export default function TischaufstellerPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        @media print {
          @page { size: 303mm 216mm landscape; margin: 0; }
          body { margin: 0; }
          .no-print { display: none !important; }
          .druckbogen { margin: 0 !important; }
          .print-bg { background: white !important; padding: 0 !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: '#2C2418', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: GOLD, fontSize: 18 }}>N & A</span>
          <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, textTransform: 'uppercase' }}>
            Tischaufsteller · Wickelfalz DIN lang · 1-seitig
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
<button onClick={() => window.print()} style={{ background: GOLD, color: CREAM, border: 'none', padding: '8px 20px', fontFamily: 'sans-serif', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
            ⬇ Als PDF drucken
          </button>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif', fontSize: 11, textDecoration: 'none' }}>← Admin</Link>
        </div>
      </div>

      {/* Hinweis */}
      <div className="no-print" style={{ background: '#3a3530', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ fontFamily: 'sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Druckanleitung:</strong> „Als PDF drucken" → Papier: <strong style={{ color: GOLD }}>303 × 216 mm</strong> quer → Seitenränder: keine → Skalierung: 100 % → <strong style={{ color: GOLD }}>einseitig drucken</strong> → Falz: 97 mm | 100 mm | 100 mm (Wickelfalz)
        </p>
      </div>

      {/* Druckbogen */}
      <div className="print-bg" style={{ background: '#3a3530', padding: '32px 24px', overflowX: 'auto' }}>
        <div style={{ display: 'inline-block', minWidth: mm(B + P1 + P2 + P3 + B) }}>
          <Bogen />
        </div>
      </div>

      {/* 3D-Falz-Vorschau */}
      <div style={{ background: '#2e2822' }}>
        <FoldedPreview />
      </div>

      {/* Fußzeile */}
      <div className="no-print" style={{ background: '#2C2418', padding: '14px 24px' }}>
        <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, letterSpacing: 1 }}>
          DATENFORMAT 303 × 216 mm · ENDFORMAT 297 × 210 mm · FALZ 97 | 100 | 100 mm · BESCHNITT 3 mm · EINSEITIG
        </p>
      </div>
    </>
  )
}
