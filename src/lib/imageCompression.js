/**
 * Komprimiert ein Bild clientseitig auf max. 1200px Breite und ~400 KB.
 * Gibt eine neue File-Instanz (JPEG) zurück.
 */
export function compressImage(file, maxWidth = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'))
      img.onload = () => {
        let { width, height } = img

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width  = maxWidth
        }

        const canvas = document.createElement('canvas')
        canvas.width  = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Komprimierung fehlgeschlagen.'))
            const safeName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
            resolve(new File([blob], safeName, { type: 'image/jpeg' }))
          },
          'image/jpeg',
          quality,
        )
      }
      img.src = e.target.result
    }

    reader.readAsDataURL(file)
  })
}
