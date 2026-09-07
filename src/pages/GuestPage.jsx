import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { compressImage } from '../lib/imageCompression'
import StepCategory from '../components/GuestForm/StepCategory'
import StepPhoto from '../components/GuestForm/StepPhoto'
import StepMessage from '../components/GuestForm/StepMessage'
import StepPreview from '../components/GuestForm/StepPreview'
import StepSuccess from '../components/GuestForm/StepSuccess'

const INITIAL = {
  category:     '',
  photo:        null,
  photoPreview: null,
  name:         '',
  message:      '',
}

export default function GuestPage() {
  const [step, setStep]         = useState(1)
  const [formData, setFormData] = useState(INITIAL)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const update = (patch) => setFormData((p) => ({ ...p, ...patch }))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      let photo_url = null

      if (formData.photo) {
        const compressed = await compressImage(formData.photo)
        const filename   = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`

        const { error: uploadErr } = await supabase.storage
          .from('photos')
          .upload(filename, compressed, { contentType: 'image/jpeg' })

        if (uploadErr) throw uploadErr

        const { data: urlData } = supabase.storage.from('photos').getPublicUrl(filename)
        photo_url = urlData.publicUrl
      }

      const { error: insertErr } = await supabase.from('entries').insert([{
        name:     formData.name.trim(),
        message:  formData.message.trim(),
        category: formData.category,
        photo_url,
      }])

      if (insertErr) throw insertErr

      setStep(5) // Erfolg
    } catch (err) {
      console.error(err)
      setError('Etwas ist schiefgelaufen. Bitte versuche es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const TOTAL_STEPS = 4 // Kategorie, Foto, Nachricht, Vorschau

  return (
    <div className="min-h-dvh bg-brand">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 max-w-lg mx-auto">
        <Link to="/" className="font-display italic text-gold-light text-lg">Abschiedsbuch</Link>
        {step <= TOTAL_STEPS && (
          <span className="font-body text-xs text-cream/60 tracking-wider uppercase">
            Schritt {step} / {TOTAL_STEPS}
          </span>
        )}
      </header>

      {/* Progress bar */}
      {step <= TOTAL_STEPS && (
        <div className="px-6 pb-6 max-w-lg mx-auto">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="h-[3px] flex-1 rounded-full transition-all duration-500"
                style={{ background: s <= step ? '#009775' : 'rgba(250,247,242,0.25)' }}
              />
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <StepCategory
          selected={formData.category}
          onChange={(cat) => update({ category: cat })}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepPhoto
          photo={formData.photo}
          photoPreview={formData.photoPreview}
          onChange={(photo, photoPreview) => update({ photo, photoPreview })}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepMessage
          name={formData.name}
          message={formData.message}
          onChange={update}
          onNext={() => {
            setError(null)
            setStep(4)
          }}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <StepPreview
          formData={formData}
          onSubmit={handleSubmit}
          onBack={() => setStep(3)}
          loading={loading}
          error={error}
        />
      )}
      {step === 5 && (
        <StepSuccess name={formData.name} />
      )}
    </div>
  )
}
