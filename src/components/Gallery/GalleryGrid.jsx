import GalleryCard from './GalleryCard'

export default function GalleryGrid({ entries }) {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 lg:gap-4">
      {entries.map((entry) => (
        <div key={entry.id} className="break-inside-avoid mb-3 animate-fade-up">
          <GalleryCard entry={entry} />
        </div>
      ))}
    </div>
  )
}
