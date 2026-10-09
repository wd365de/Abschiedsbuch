// Vercel Serverless Function: rendert die Fotobuch-Vorschau mit
// headless Chrome (via @sparticuz/chromium-min + puppeteer-core) und
// streamt das Ergebnis als PDF zurück.
//
// Erwartete Env-Variablen (im Vercel-Dashboard setzen):
//   PDF_SECRET      zufaelliger String, z.B. 32 hex. Wird nur bei
//                   Requests zur eigenen Origin als x-pdf-token-Header
//                   gesendet; nicht an Dritt-Hosts.
//   APP_ORIGIN      optional, z.B. "https://abschiedsbuch.vercel.app".
//                   Fallback: https://${VERCEL_PROJECT_PRODUCTION_URL}.
//                   Request-Host wird NICHT verwendet (SSRF-Schutz).
//   SUPABASE_URL    optional, Fallback VITE_SUPABASE_URL. Daraus wird
//                   der exakte Supabase-Hostname extrahiert; nur dieser
//                   darf von Puppeteer geladen werden (keine Wildcard).
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
// darf. Alles andere wird abgebrochen.
const ALLOWED_STATIC_HOSTS = new Set([
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

function resolveSupabaseHost() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  if (!url) return null
  try { return new URL(url).hostname } catch { return null }
}

function isAllowedUrl(rawUrl, appOrigin, supabaseHost) {
  try {
    const u = new URL(rawUrl)
    if (u.protocol === 'data:' || u.protocol === 'blob:') return true
    if (u.origin === appOrigin) return true
    if (ALLOWED_STATIC_HOSTS.has(u.hostname)) return true
    // Nur der exakte Supabase-Projekt-Host, keine *.supabase.co-Wildcard
    if (supabaseHost && u.hostname === supabaseHost) return true
    return false
  } catch {
    return false
  }
}

function isSameOrigin(rawUrl, appOrigin) {
  try { return new URL(rawUrl).origin === appOrigin } catch { return false }
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
  const supabaseHost = resolveSupabaseHost()

  const format = req.query?.format === 'quadrat' ? 'quadrat' : 'a4'
  const printUrl = new URL('/fotobuch-print', appOrigin)
  printUrl.searchParams.set('format', format)
  // Zusaetzliche Sicherung: Zieldomain muss unserer App-Origin entsprechen.
  if (printUrl.origin !== appOrigin) {
    res.status(500).send('Interne URL-Validierung fehlgeschlagen.')
    return
  }

  const debug = req.query?.debug === '1'
  const pageErrors = []
  const failedRequests = []
  const abortedRequests = []

  let browser
  try {
    console.log('PDF: appOrigin=', appOrigin, 'supabaseHost=', supabaseHost, 'format=', format)
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: chromium.headless,
      defaultViewport: { width: 1240, height: 1754, deviceScaleFactor: 2 },
    })
    const page = await browser.newPage()
    page.on('pageerror', (e) => { pageErrors.push(e.message); console.error('page error:', e.message) })
    page.on('requestfailed', (r) => { failedRequests.push({ url: r.url(), err: r.failure()?.errorText }); console.error('request failed:', r.url(), r.failure()?.errorText) })
    page.on('console', (msg) => console.log('page console:', msg.type(), msg.text()))

    // Request-Allowlist: nur eigene Origin + exakter Supabase-Host +
    // Google Fonts. Das PDF-Secret wird dabei ausschliesslich an
    // Same-Origin-Requests angehaengt, damit es nicht in Fremd-Logs
    // (Supabase, Google) landet.
    await page.setRequestInterception(true)
    page.on('request', (r) => {
      const u = r.url()
      if (!isAllowedUrl(u, appOrigin, supabaseHost)) {
        abortedRequests.push(u)
        r.abort()
        return
      }
      const headers = { ...r.headers() }
      if (isSameOrigin(u, appOrigin)) {
        headers['x-pdf-token'] = secret
      } else {
        delete headers['x-pdf-token']
      }
      r.continue({ headers })
    })

    await page.goto(printUrl.toString(), { waitUntil: 'networkidle0', timeout: 45000 })

    // Warten, bis die Fotobuch-Komponente signalisiert, dass alle
    // Bilder geladen sind.
    await page.waitForFunction(() => window.__fotobuchReady === true, { timeout: 30000 })

    if (debug) {
      const html = await page.content()
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.status(200).send(
        `=== appOrigin: ${appOrigin}\n` +
        `=== supabaseHost: ${supabaseHost}\n` +
        `=== pageErrors (${pageErrors.length}):\n${pageErrors.join('\n')}\n` +
        `=== failedRequests (${failedRequests.length}):\n${failedRequests.map(x => `${x.url} :: ${x.err}`).join('\n')}\n` +
        `=== abortedRequests (${abortedRequests.length}):\n${abortedRequests.slice(0, 20).join('\n')}\n` +
        `=== HTML (erste 4000 Zeichen):\n${html.slice(0, 4000)}`
      )
      return
    }

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
