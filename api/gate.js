import { readFileSync } from 'node:fs'
import path from 'node:path'

const ALLOWED_IPS = ['153.96.224.80']

// Vercel liefert statische Dateien (u.a. das gebaute index.html) unabhaengig
// von Cache-Control-Headern aus dem Edge-Cache aus - Middleware/Header
// koennen das nicht zuverlaessig verhindern. Deshalb wird die HTML-Huelle
// hier aus einer Function heraus serviert, die grundsaetzlich nicht
// gecacht wird und bei jedem Aufruf die IP prueft.
const html = readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf-8')

export default function handler(req, res) {
  const forwardedFor = req.headers['x-forwarded-for'] || ''
  const parts = String(forwardedFor).split(',').map((part) => part.trim()).filter(Boolean)
  const ip = parts[parts.length - 1] || ''

  if (!ALLOWED_IPS.includes(ip)) {
    res.status(403)
    res.setHeader('content-type', 'text/plain; charset=utf-8')
    res.setHeader('cache-control', 'no-store')
    res.send('Diese Seite ist nur aus dem Institutsnetz erreichbar.')
    return
  }

  res.status(200)
  res.setHeader('content-type', 'text/html; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.send(html)
}
