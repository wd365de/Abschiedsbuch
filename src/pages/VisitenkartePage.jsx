import { QRCodeSVG } from 'qrcode.react'
import { Link } from 'react-router-dom'

const TARGET_URL = 'https://na26.vercel.app/eintrag'

const GOLD  = '#C9A84C'
const INK   = '#2C2418'
const CREAM = '#FAF7F2'
const MUTED = '#8B7D6E'
const LIGHT = '#B5A898'

// Visitenkarte: 85×55 mm Endformat, 3 mm Beschnitt → 91×61 mm Druckformat
const W  = 85  // Endformat Breite
const H  = 55  // Endformat Höhe
const B  =  3  // Beschnitt

const mm = (v) => `${v}mm`

function GoldLine() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '2mm 0' }}>
      <div style={{ flex: 1, height: 0.3, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
      <span style={{ color: GOLD, fontSize: 6 }}>✦</span>
      <div style={{ flex: 1, height: 0.3, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
    </div>
  )
}

// ─── Vorderseite ──────────────────────────────────────────────────────────────
function Vorderseite() {
  return (
    <div style={{
      width: mm(W + 2 * B),
      height: mm(H + 2 * B),
      background: CREAM,
      boxSizing: 'border-box',
      padding: `${B + 4}mm ${B + 5}mm`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* Eckverzierungen */}
      <div style={{ position: 'absolute', top: mm(B + 2), left: mm(B + 2), width: 8, height: 8, borderTop: `0.4px solid ${GOLD}`, borderLeft: `0.4px solid ${GOLD}` }} />
      <div style={{ position: 'absolute', top: mm(B + 2), right: mm(B + 2), width: 8, height: 8, borderTop: `0.4px solid ${GOLD}`, borderRight: `0.4px solid ${GOLD}` }} />
      <div style={{ position: 'absolute', bottom: mm(B + 2), left: mm(B + 2), width: 8, height: 8, borderBottom: `0.4px solid ${GOLD}`, borderLeft: `0.4px solid ${GOLD}` }} />
      <div style={{ position: 'absolute', bottom: mm(B + 2), right: mm(B + 2), width: 8, height: 8, borderBottom: `0.4px solid ${GOLD}`, borderRight: `0.4px solid ${GOLD}` }} />

      {/* Überschrift */}
      <p style={{
        fontFamily: '"Cormorant Garamond",Georgia,serif',
        fontStyle: 'italic',
        fontSize: 29,
        fontWeight: 700,
        color: GOLD,
        lineHeight: 1.15,
        margin: '0 0 1.5mm',
        width: '100%',
      }}>
        Hochzeitsgästebuch für Niklas &amp; Alexander
      </p>

      {/* Divider */}
      <div style={{ width: '100%', height: 0.4, background: `linear-gradient(to right, transparent, ${GOLD} 20%, ${GOLD} 80%, transparent)`, margin: '0 0 1.5mm' }} />

      {/* Fließtext */}
      <p style={{
        fontFamily: '"Cormorant Garamond",Georgia,serif',
        fontSize: 13.5,
        fontWeight: 400,
        color: INK,
        lineHeight: 1.5,
        margin: '0 0 2mm',
        width: '100%',
      }}>
        Hinterlasse persönliche Wünsche und lade dein Erinnerungsfoto hoch.<br />
        Scanne den QR-Code auf der Rückseite und folge den Anweisungen.
      </p>

      {/* Logo */}
      <img src="/logo-na.svg" alt="N & A" style={{ width: mm(8), height: mm(8), opacity: 0.6 }} />
    </div>
  )
}

// ─── Rückseite ────────────────────────────────────────────────────────────────
function Rueckseite() {
  return (
    <div style={{
      width: mm(W + 2 * B),
      height: mm(H + 2 * B),
      background: INK,
      boxSizing: 'border-box',
      padding: `${B + 2}mm`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: '1.5mm',
    }}>
      {/* Überschrift – nicht kursiv für bessere Lesbarkeit */}
      <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'normal', fontWeight: 700, fontSize: 17, color: GOLD, letterSpacing: 0.5, margin: 0, lineHeight: 1.2, textAlign: 'center', width: '100%' }}>
        QR-Code zum Gästebuch
      </p>

      {/* QR-Code – größer (30mm) und Level Q für weniger Dichte */}
      <div style={{ padding: '2mm', background: CREAM, borderRadius: 1 }}>
        <QRCodeSVG
          value={TARGET_URL}
          size={30 * 3.78}
          bgColor={CREAM}
          fgColor={INK}
          level="Q"
          style={{ display: 'block', width: mm(30), height: mm(30) }}
        />
      </div>

      {/* URL klar und groß */}
      <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'normal', fontSize: 14, color: LIGHT, margin: 0, letterSpacing: 0.5 }}>
        na26.vercel.app
      </p>

      {/* Scan-Anleitung */}
      <p style={{ fontFamily: '"Cormorant Garamond",Georgia,serif', fontSize: 14, fontWeight: 700, color: LIGHT, margin: 0, lineHeight: 1.3, letterSpacing: 0.2 }}>
        Kamera öffnen <span style={{ color: GOLD, fontWeight: 400 }}>→</span> Code anvisieren <span style={{ color: GOLD, fontWeight: 400 }}>→</span> Link antippen
      </p>
    </div>
  )
}

// ─── Druckbogen (beide Seiten nebeneinander) ──────────────────────────────────
function Druckbogen() {
  return (
    <div style={{ display: 'flex', gap: '8mm', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontFamily: 'sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 3mm', textAlign: 'center' }}>Vorderseite</p>
        <div style={{ position: 'relative', width: mm(W + 2 * B), height: mm(H + 2 * B), border: '0.5px solid #ccc' }}>
          {/* Beschnittmarkierungen */}
          {[[0,0],[W+2*B,0],[0,H+2*B],[W+2*B,H+2*B]].map(([cx, cy], i) => {
            const hw = 3, hh = 3, gap = 0.5
            const rx = cx === 0 ? gap : cx - hw - gap
            const ry = cy === 0 ? gap : cy - hh - gap
            return (
              <div key={i} style={{ position: 'absolute', left: mm(rx), top: mm(ry), width: mm(hw), height: mm(hh) }}>
                <div style={{ position: 'absolute', top: cy === 0 ? 0 : '100%', left: 0, right: 0, height: 0, borderTop: '0.3px solid #999' }} />
                <div style={{ position: 'absolute', left: cx === 0 ? 0 : '100%', top: 0, bottom: 0, width: 0, borderLeft: '0.3px solid #999' }} />
              </div>
            )
          })}
          <Vorderseite />
        </div>
      </div>
      <div>
        <p style={{ fontFamily: 'sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 3mm', textAlign: 'center' }}>Rückseite</p>
        <div style={{ position: 'relative', width: mm(W + 2 * B), height: mm(H + 2 * B), border: '0.5px solid #ccc' }}>
          {[[0,0],[W+2*B,0],[0,H+2*B],[W+2*B,H+2*B]].map(([cx, cy], i) => {
            const hw = 3, hh = 3, gap = 0.5
            const rx = cx === 0 ? gap : cx - hw - gap
            const ry = cy === 0 ? gap : cy - hh - gap
            return (
              <div key={i} style={{ position: 'absolute', left: mm(rx), top: mm(ry), width: mm(hw), height: mm(hh) }}>
                <div style={{ position: 'absolute', top: cy === 0 ? 0 : '100%', left: 0, right: 0, height: 0, borderTop: '0.3px solid #999' }} />
                <div style={{ position: 'absolute', left: cx === 0 ? 0 : '100%', top: 0, bottom: 0, width: 0, borderLeft: '0.3px solid #999' }} />
              </div>
            )
          })}
          <Rueckseite />
        </div>
      </div>
    </div>
  )
}

// ─── Hauptseite ───────────────────────────────────────────────────────────────
export default function VisitenkartePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        @media print {
          @page { size: 91mm 61mm; margin: 0; }
          body { margin: 0; background: white; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 100, background: INK, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: GOLD, fontSize: 18 }}>N & A</span>
          <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, textTransform: 'uppercase' }}>
            Visitenkarte · 85×55 mm · beidseitig
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
          <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Druckanleitung:</strong> Vorder- und Rückseite separat drucken → Papier: <strong style={{ color: GOLD }}>91×61 mm</strong> (mit Beschnitt) bzw. <strong style={{ color: GOLD }}>85×55 mm</strong> Endformat · Seitenränder: keine · Skalierung: 100 % · <strong style={{ color: GOLD }}>beidseitig</strong>
        </p>
      </div>

      {/* Vorschau (nur am Bildschirm) */}
      <div className="no-print" style={{ background: '#3a3530', padding: '40px 32px', overflowX: 'auto' }}>
        <Druckbogen />
      </div>

      {/* Fußzeile */}
      <div className="no-print" style={{ background: INK, padding: '14px 24px' }}>
        <p style={{ fontFamily: 'sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, letterSpacing: 1 }}>
          ENDFORMAT 85 × 55 mm · DATENFORMAT 91 × 61 mm · BESCHNITT 3 mm · BEIDSEITIG · 350–400g KARTON EMPFOHLEN
        </p>
      </div>

      {/* Druckinhalt – Vorderseite Seite 1, Rückseite Seite 2 */}
      <div className="print-only">
        <div style={{ pageBreakAfter: 'always' }}><Vorderseite /></div>
        <div><Rueckseite /></div>
      </div>
    </>
  )
}
