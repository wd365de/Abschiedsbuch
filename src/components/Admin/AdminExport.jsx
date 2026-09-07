import JSZip from 'jszip'

function toCSV(entries) {
  const header = ['ID', 'Name', 'Kategorie', 'Nachricht', 'Freigegeben', 'Datum', 'Foto-URL']
  const rows = entries.map((e) => [
    e.id,
    `"${e.name.replace(/"/g, '""')}"`,
    e.category,
    `"${e.message.replace(/"/g, '""')}"`,
    e.approved ? 'Ja' : 'Nein',
    new Date(e.created_at).toLocaleString('de-DE'),
    e.photo_url || '',
  ])
  return [header, ...rows].map((r) => r.join(';')).join('\n')
}

export function downloadCSV(entries) {
  const csv  = toCSV(entries)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `abschiedsbuch-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadZIP(entries, onProgress) {
  const zip     = new JSZip()
  const photos  = entries.filter((e) => e.photo_url)
  const folder  = zip.folder('fotos')

  // Add CSV manifest inside ZIP
  folder.file('_nachichten.csv', '\uFEFF' + toCSV(entries))

  let done = 0
  await Promise.all(
    photos.map(async (entry) => {
      try {
        const resp = await fetch(entry.photo_url)
        const blob = await resp.blob()
        const ext  = entry.photo_url.split('.').pop().split('?')[0] || 'jpg'
        const safe = entry.name.replace(/[^a-zA-Z0-9äöüÄÖÜß]/g, '_').slice(0, 40)
        folder.file(`${safe}_${entry.id.slice(0, 8)}.${ext}`, blob)
      } catch (_) {
        // einzelnes Foto überspringen wenn nicht erreichbar
      }
      done++
      onProgress?.(Math.round((done / photos.length) * 100))
    })
  )

  const content  = await zip.generateAsync({ type: 'blob' })
  const url      = URL.createObjectURL(content)
  const a        = document.createElement('a')
  a.href         = url
  a.download     = `abschiedsbuch-fotos-${new Date().toISOString().slice(0, 10)}.zip`
  a.click()
  URL.revokeObjectURL(url)
}
