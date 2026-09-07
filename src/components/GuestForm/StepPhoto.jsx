import { useRef } from 'react'

export default function StepPhoto({ photo, photoPreview, onChange, onNext, onBack }) {
  const fileInputRef   = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const preview = URL.createObjectURL(file)
    onChange(file, preview)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    onChange(null, null)
  }

  return (
    <div className="page-container animate-fade-up">
      <h2 className="font-display text-3xl font-light text-cream leading-snug mb-2">
        Habt ihr einen schönen Moment eingefangen?
      </h2>
      <p className="font-body text-sm text-cream/70 mb-8">
        Optional – ihr könnt diesen Schritt auch überspringen.
      </p>

      {/* Upload area */}
      {!photoPreview ? (
        <div className="mb-6">
          <div className="text-5xl mb-6 text-center">📷</div>

          <div className="flex flex-col gap-3">
            {/* Camera (mobile) */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="btn-primary"
            >
              Kamera öffnen
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary"
            >
              Aus Galerie
            </button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="relative mb-6 rounded-2xl overflow-hidden">
          <img
            src={photoPreview}
            alt="Vorschau"
            className="w-full max-h-72 object-cover"
          />
          <button
            onClick={removePhoto}
            className="absolute top-3 right-3 w-9 h-9 bg-ink/70 hover:bg-ink text-cream rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-3 left-3 bg-ink/60 text-cream text-xs font-body px-3 py-1 rounded-full backdrop-blur-sm">
            Foto ausgewählt
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {photo && (
          <button className="btn-primary" onClick={onNext}>
            Weiter mit Foto
          </button>
        )}
        <button className="btn-ghost text-center py-2" onClick={onBack}>
          Zurück
        </button>
        {!photo && (
          <button
            className="text-center py-1 font-body text-xs text-cream/50 hover:text-cream/80 transition-colors duration-200"
            onClick={onNext}
          >
            Ohne Foto fortfahren
          </button>
        )}
      </div>
    </div>
  )
}
