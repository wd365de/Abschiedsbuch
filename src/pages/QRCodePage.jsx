import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Link } from 'react-router-dom'

const GUEST_URL = 'https://abschiedsbuch-wd365des-projects.vercel.app/eintrag'

export default function QRCodePage() {
  const qrRef = useRef(null)

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.download = 'qrcode-abschiedsbuch.png'
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      <header className="px-6 py-5 max-w-lg mx-auto w-full flex items-center justify-between">
        <Link to="/" className="font-display italic text-gold text-lg">Abschiedsbuch</Link>
        <Link to="/admin" className="font-body text-xs text-ink-muted hover:text-ink transition-colors tracking-wider uppercase">
          Admin
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full">

        {/* Title */}
        <h1 className="font-display text-4xl font-light text-ink text-center mb-2 animate-fade-up">
          QR-Code
        </h1>
        <p className="font-body text-sm text-ink-muted text-center mb-10 animate-fade-up">
          Für Aushänge und Einladungen im Institut
        </p>

        {/* QR Code */}
        <div className="animate-fade-up w-full mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gold/30" />
            <span className="font-body text-xs tracking-widest uppercase text-gold">QR-Code</span>
            <div className="h-px flex-1 bg-gold/30" />
          </div>

          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-sm border border-ink/5">
            <div ref={qrRef} className="mb-4">
              <QRCodeCanvas
                value={GUEST_URL}
                size={240}
                bgColor="#FFFFFF"
                fgColor="#2C2418"
                level="H"
              />
            </div>
            <p className="font-body text-xs text-ink-muted text-center mb-6 break-all">
              {GUEST_URL}
            </p>
            <button onClick={downloadQR} className="btn-primary max-w-[280px]">
              QR-Code als PNG herunterladen
            </button>
          </div>
        </div>

        {/* Hint */}
        <div className="bg-gold/10 border border-gold/30 rounded-xl px-5 py-4 w-full">
          <p className="font-body text-sm text-ink leading-relaxed">
            <strong className="font-medium">Tipp:</strong> Den QR-Code auf mindestens 4×4 cm drucken –
            dann können auch ältere Gäste ihn problemlos scannen.
          </p>
        </div>

      </main>

      <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
    </div>
  )
}
