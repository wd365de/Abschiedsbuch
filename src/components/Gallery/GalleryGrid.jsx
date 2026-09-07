import GalleryCard from './GalleryCard'

export default function GalleryGrid({ entries }) {
  return (
    <div className="columns-2 gap-3">
      {entries.map((entry) => (
        <div key={entry.id} className="break-inside-avoid mb-3 animate-fade-up">
          <GalleryCard entry={entry} />
        </div>
      ))}
    </div>
  )
}
