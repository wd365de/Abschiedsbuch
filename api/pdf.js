// Vercel Serverless Function: rendert die Fotobuch-Vorschau mit
// headless Chrome (via @sparticuz/chromium-min + puppeteer-core) und
// streamt das Ergebnis als PDF zurück.
//
// Erwartete Env-Variablen (im Vercel-Dashboard setzen):
//   PDF_SECRET      zufaelliger String, z.B. 32 hex. Wird intern
//                   als x-pdf-token an die Print-Route gesendet.
//   APP_ORIGIN      optional, z.B. "https://abschiedsbuch.vercel.app".
//                   Fallback: https://${VERCEL_PROJECT_PRODUCTION_URL}.
//                   Request-Host wird NICHT verwendet (SSRF-Schutz).
//
// Die eigentliche Aufrufer-Authentisierung erfolgt ueber die Edge-
// Middleware (Passwort-Cookie). Diese Function selbst muss den
// Cookie nicht nochmal pruefen.

import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'

export const config = {
  maxDuration: 60,
}

// Chromium-Binary wird zur Laufzeit vom GitHub-Release geladen, damit
// die Vercel-Function-Groesse unter dem 50MB-Limit bleibt. Die Version
// muss zur installierten @sparticuz/chromium-min-Version passen.
const CHROMIUM_PACK_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v153.0.0/chromium-v153.0.0-pack.x64.tar'

// Hostnamen, deren Ressourcen Puppeteer waehrend des Rendering laden
// darf. Alles andere wird abgebrochen (verhindert, dass z.B. ein
// kompromittierter Supabase-URL Fremddaten einschleust).
const ALLOWED_HOSTS = new Set([
  'fonts.googleapis.com',
  'fonts.gstatic.com',
])

function resolveAppOrigin() {
  const explicit = process.env.APP_ORIGIN
  if (explicit) {
    try { return new URL(explicit).origin } catch { /* fall through */ }
  }
  const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (prodHost) return `https://${prodHost}`
  const vercelHost = process.env.VERCEL_URL
  if (vercelHost) return `https://${vercelHost}`
  return null
}

function isAllowedUrl(rawUrl, appOrigin) {
  try {
    const u = new URL(rawUrl)
    if (u.protocol === 'data:' || u.protocol === 'blob:') return true
    if (u.origin === appOrigin) return true
    if (ALLOWED_HOSTS.has(u.hostname)) return true
    // Supabase project domains (Datenbank + Storage)
    if (u.hostname.endsWith('.supabase.co')) return true
    if (u.hostname.endsWith('.supabase.in')) return true
    return false
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  const secret = process.env.PDF_SECRET
  if (!secret) {
    res.status(500).send('PDF_SECRET ist nicht gesetzt.')
    return
  }
  const appOrigin = resolveAppOrigin()
  if (!appOrigin) {
    res.status(500).send('APP_ORIGIN (oder VERCEL_PROJECT_PRODUCTION_URL) ist nicht gesetzt.')
    return
  }

  const format = req.query?.format === 'quadrat' ? 'quadrat' : 'a4'
  const printUrl = new URL('/fotobuch-print', appOrigin)
  printUrl.searchParams.set('format', format)
  // Zusaetzliche Sicherung: Zieldomain muss unserer App-Origin entsprechen.
  if (printUrl.origin !== appOrigin) {
    res.status(500).send('Interne URL-Validierung fehlgeschlagen.')
    return
  }

  let browser
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: chromium.headless,
      defaultViewport: { width: 1240, height: 1754, deviceScaleFactor: 2 },
    })
    const page = await browser.newPage()
    page.on('pageerror', (e) => console.error('page error:', e.message))
    page.on('requestfailed', (r) => console.error('request failed:', r.url(), r.failure()?.errorText))

    // Token wird NUR als Header mitgeschickt, nicht in der URL, damit
    // er nicht in Access-Logs oder Referrer-Headers landet.
    await page.setExtraHTTPHeaders({ 'x-pdf-token': secret })

    // Request-Allowlist: nur eigene Origin + Supabase + Google Fonts.
    await page.setRequestInterception(true)
    page.on('request', (r) => {
      if (isAllowedUrl(r.url(), appOrigin)) r.continue()
      else r.abort()
    })

    await page.goto(printUrl.toString(), { waitUntil: 'networkidle0', timeout: 45000 })

    // Warten, bis die Fotobuch-Komponente signalisiert, dass alle
    // Bilder geladen sind.
    await page.waitForFunction(() => window.__fotobuchReady === true, { timeout: 30000 })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="abschiedsbuch-${format}.pdf"`)
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(pdfBuffer)
  } catch (err) {
    console.error('PDF-Rendering-Fehler:', err)
    res.status(500).send(`PDF-Rendering-Fehler: ${err?.message || err}`)
  } finally {
    if (browser) {
      try { await browser.close() } catch { /* ignore */ }
    }
  }
}
