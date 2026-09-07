import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Link } from 'react-router-dom'

const GUEST_URL = 'https://na26.vercel.app/eintrag'

// Herzpfad im 152×214 mm Koordinatensystem (1 Einheit = 1 mm)
// Herzform: oben 28 mm Abstand, unten Spitze bei 195 mm, Seiten bei 4 mm und 148 mm
const HEART = 'M 76 195 C 20 155, 4 115, 4 82 C 4 48, 24 28, 46 28 C 59 28, 70 35, 76 48 C 82 35, 93 28, 106 28 C 128 28, 148 48, 148 82 C 148 115, 132 155, 76 195 Z'

// Normierter Herzpfad für objectBoundingBox clipPath (Werte 0–1)
const HEART_NORM = 'M 0.500 0.911 C 0.132 0.724, 0.026 0.537, 0.026 0.383 C 0.026 0.224, 0.158 0.131, 0.303 0.131 C 0.388 0.131, 0.461 0.164, 0.500 0.224 C 0.539 0.164, 0.612 0.131, 0.697 0.131 C 0.842 0.131, 0.974 0.224, 0.974 0.383 C 0.974 0.537, 0.868 0.724, 0.500 0.911 Z'

function FlyerContent() {
  return (
    <div style={{ position: 'relative', width: '152mm', height: '214mm', overflow: 'hidden' }}>

      {/* Verstecktes SVG mit clipPath-Definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <clipPath id="herzClip" clipPathUnits="objectBoundingBox">
            <path d={HEART_NORM} />
          </clipPath>
        </defs>
      </svg>

      {/* Herzform: Füllung */}
      <svg
        viewBox="0 0 152 214"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="hgFill" x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="#FDF8F5" />
            <stop offset="45%" stopColor="#FAF0EE" />
            <stop offset="100%" stopColor="#F0DDD6" />
          </linearGradient>
          <filter id="hShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C4A882" floodOpacity="0.2" />
          </filter>
        </defs>
        {/* Füllung */}
        <path d={HEART} fill="url(#hgFill)" filter="url(#hShadow)" />
        {/* Rand */}
        <path d={HEART} fill="none" stroke="#C4A882" strokeWidth="0.8" />
        {/* Innerer feiner Rand */}
        <path
          d="M 76 192 C 23 153, 7 114, 7 82 C 7 50, 26 31, 46 31 C 59 31, 70 38, 76 51 C 82 38, 93 31, 106 31 C 126 31, 145 50, 145 82 C 145 114, 129 153, 76 192 Z"
          fill="none"
          stroke="#C4A882"
          strokeWidth="0.3"
          strokeDasharray="2,3"
          opacity="0.5"
        />
      </svg>

      {/* Inhaltsbereich – geclippt auf Herzform */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: 'url(#herzClip)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '62mm',
        }}
      >
        {/* Goldene Linie oben */}
        <div style={{ width: '90mm', height: '0.4mm', background: 'linear-gradient(to right, transparent, #C4A882, transparent)', marginBottom: '4mm' }} />

        {/* Namen */}
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: '14pt',
          fontStyle: 'italic',
          color: '#2C2418',
          letterSpacing: '0.5pt',
          marginBottom: '3mm',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          Niklas &amp; Alexander
        </div>

        {/* Datum */}
        <div style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: '6pt',
          color: '#8B7355',
          letterSpacing: '3pt',
          marginBottom: '5mm',
          textAlign: 'center',
        }}>
          23. MAI 2026
        </div>

        {/* Goldene Linie */}
        <div style={{ width: '75mm', height: '0.3mm', background: 'linear-gradient(to right, transparent, #C4A882, transparent)', marginBottom: '5mm' }} />

        {/* QR-Code */}
        <div style={{
          padding: '4mm',
          background: 'white',
          borderRadius: '2mm',
          boxShadow: '0 1mm 4mm rgba(196,168,130,0.3)',
          marginBottom: '5mm',
        }}>
          <QRCodeCanvas
            value={GUEST_URL}
            size={190}
            bgColor="#FFFFFF"
            fgColor="#2C2418"
            level="H"
            imageSettings={{
              src: '/logo-na.svg',
              height: 48,
              width: 48,
              excavate: true,
            }}
          />
        </div>

        {/* Goldene Linie */}
        <div style={{ width: '65mm', height: '0.3mm', background: 'linear-gradient(to right, transparent, #C4A882, transparent)', marginBottom: '4mm' }} />

        {/* Text */}
        <div style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: '6.5pt',
          color: '#2C2418',
          textAlign: 'center',
          lineHeight: '1.5',
          maxWidth: '90mm',
          marginBottom: '2mm',
        }}>
          Scannt den Code und hinterlasst
        </div>
        <div style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: '6.5pt',
          color: '#2C2418',
          textAlign: 'center',
          lineHeight: '1.5',
          maxWidth: '90mm',
          marginBottom: '3mm',
        }}>
          eine Nachricht für unser Fotoalbum
        </div>
        <div style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: '5.5pt',
          color: '#8B7355',
          fontStyle: 'italic',
          textAlign: 'center',
        }}>
          na26.vercel.app
        </div>
      </div>
    </div>
  )
}

export default function FlyerHerzPage() {
  const printRef = useRef(null)

  return (
    <div style={{ minHeight: '100dvh', background: '#f3f4f6' }}>

      {/* Toolbar */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <Link
          to="/"
          style={{ fontFamily: "Georgia, serif", fontStyle: 'italic', color: '#C4A882', fontSize: '18px', textDecoration: 'none' }}
        >
          N &amp; A
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>
            Herz-Flyer · 152×214 mm · 250g glänzend · 4/4-farbig
          </span>
          <button
            onClick={() => window.print()}
            style={{
              padding: '8px 18px',
              background: '#C4A882',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Als PDF drucken
          </button>
        </div>
      </div>

      {/* Hinweis */}
      <div className="no-print" style={{
        background: '#FDF8F5',
        borderBottom: '1px solid #E8D9CC',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        color: '#6B5A44',
      }}>
        <span>📌</span>
        <span>
          Druckeinstellungen: Seitenformat <strong>152×214 mm</strong>, kein Rand, beidseitig auf <strong>einseitig</strong> stellen.
          Die Herzform wird als <strong>Stanzform</strong> beim Druckdienstleister angegeben (Stanzvorlage von der Druckerei verwenden).
        </span>
      </div>

      {/* Vorschau */}
      <div className="no-print" style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.12)', borderRadius: '2px' }}>
          <FlyerContent />
        </div>
      </div>

      {/* Druckversion */}
      <div ref={printRef} className="print-only">
        <FlyerContent />
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          @page {
            size: 152mm 214mm portrait;
            margin: 0;
          }
          body { margin: 0; background: white; }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>
    </div>
  )
}
