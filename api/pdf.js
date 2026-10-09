// Vercel Serverless Function: rendert die Fotobuch-Vorschau mit
// headless Chrome (via @sparticuz/chromium + puppeteer-core) und
// streamt das Ergebnis als PDF zurück.
//
// Erwartete Env-Variable (im Vercel-Dashboard setzen):
//   PDF_SECRET       zufaelliger String, z.B. 32 hex. Wird intern
//                    verwendet, um die Print-Route zu entsperren.
//
// Die eigentliche Aufrufer-Authentisierung erfolgt ueber die Edge-
// Middleware (Passwort-Cookie). Diese Function selbst muss den
// Cookie nicht nochmal pruefen.

import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'

// Chromium-Binary wird zur Laufzeit vom GitHub-Release geladen, damit
// die Vercel-Function-Groesse unter dem 50MB-Limit bleibt. Die Version
// muss zur installierten @sparticuz/chromium-min-Version passen.
const CHROMIUM_PACK_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v153.0.0/chromium-v153.0.0-pack.x64.tar'

export const config = {
  maxDuration: 60,
}

export default async function handler(req, res) {
  const secret = process.env.PDF_SECRET
  if (!secret) {
    res.status(500).send('PDF_SECRET ist nicht gesetzt.')
    return
  }

  const host  = req.headers['x-forwarded-host'] || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'
  if (!host) {
    res.status(500).send('Host-Header fehlt.')
    return
  }

  const format = req.query?.format === 'quadrat' ? 'quadrat' : 'a4'
  const printUrl = new URL(`${proto}://${host}/fotobuch-print`)
  printUrl.searchParams.set('token', secret)
  printUrl.searchParams.set('format', format)

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
