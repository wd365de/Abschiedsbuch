import { useState } from 'react'
import GalleryCard from './GalleryCard'
import GalleryModal from './GalleryModal'

export default function GalleryGrid({ entries }) {
  const [openIndex, setOpenIndex] = useState(null)

  const close = () => setOpenIndex(null)
  const prev  = () => setOpenIndex((i) => (i > 0 ? i - 1 : i))
  const next  = () => setOpenIndex((i) => (i < entries.length - 1 ? i + 1 : i))

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 lg:gap-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className="break-inside-avoid mb-3 animate-fade-up">
            <GalleryCard entry={entry} onOpen={() => setOpenIndex(i)} />
          </div>
        ))}
      </div>

      {openIndex !== null && (
        <GalleryModal
          entries={entries}
          index={openIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}
