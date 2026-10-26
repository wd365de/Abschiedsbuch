// Vercel Serverless Function: liefert alle freigegebenen Einträge für
// die Print-Seite (/fotobuch-print), die Puppeteer ohne Login rendert.
//
// Seit Migration 008 sind Einträge per RLS nur noch für angemeldete
// Nutzer lesbar. Diese Function liest deshalb mit dem Service-Role-Key
// – aber nur, wenn der Aufrufer das PDF_SECRET als x-pdf-token-Header
// mitschickt (das tut ausschließlich api/pdf.js bei Same-Origin-Requests).
//
// Erwartete Env-Variablen:
//   PDF_SECRET                 wie in api/pdf.js
//   SUPABASE_SERVICE_ROLE_KEY  Supabase → Settings → API (geheim halten!)
//   SUPABASE_URL               optional, Fallback VITE_SUPABASE_URL

import { timingSafeEqual } from 'node:crypto'

function safeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

export default async function handler(req, res) {
  const secret = process.env.PDF_SECRET
  const token  = req.headers['x-pdf-token'] || ''
  if (!secret || !safeEqual(token, secret)) {
    res.status(401).json({ error: 'Nicht autorisiert' })
    return
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    res.status(500).json({ error: 'SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt' })
    return
  }

  const response = await fetch(
    `${url}/rest/v1/entries?select=*&approved=eq.true&order=created_at.asc`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  )
  if (!response.ok) {
    res.status(502).json({ error: 'Supabase-Abfrage fehlgeschlagen', status: response.status })
    return
  }

  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json(await response.json())
}
