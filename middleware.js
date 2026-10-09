// Vercel Edge Middleware: Passwortschutz für die ganze Seite.
// Prüft ein HMAC-signiertes Cookie "abschiedsbuch_access". Fehlt
// das Cookie, ist die Signatur ungültig oder abgelaufen, wird eine
// Login-Seite ausgespielt. Bei korrektem Passwort setzt die
// POST-Handling-Zweig ein frisches Token mit 24h Gültigkeit.
//
// Erwartete Env-Variable (im Vercel-Dashboard setzen):
//   ACCESS_PASSWORD   z.B. "item"
//
// Das Passwort wird gleichzeitig als HMAC-Secret genutzt — damit sind
// die Tokens nicht forgeable ohne Kenntnis des Passworts.
//
// matcher lässt /api/keepalive (Cron), Favicon und Robots unberührt.

export const config = {
  matcher: ['/((?!api/keepalive|favicon|robots\\.txt|\\.well-known).*)'],
}

const COOKIE_NAME = 'abschiedsbuch_access'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 Stunden

function loginPage({ target = '/', error = false } = {}) {
  const errMsg = error
    ? '<p style="color:#B87068;margin:0 0 16px;font-size:14px">Falsches Passwort.</p>'
    : ''
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Abschiedsbuch — Zugang</title>
<style>
  html,body{margin:0;padding:0;background:#14202A;color:#FAF7F2;font-family:"DM Sans",Arial,sans-serif;min-height:100dvh}
  body{display:flex;align-items:center;justify-content:center;padding:24px}
  .card{max-width:380px;width:100%;background:rgba(250,247,242,0.04);border:1px solid rgba(250,247,242,0.14);border-radius:16px;padding:32px 28px;backdrop-filter:blur(10px)}
  h1{font-size:22px;font-weight:500;margin:0 0 6px}
  p.sub{font-size:14px;color:rgba(250,247,242,0.65);margin:0 0 24px;line-height:1.5}
  label{display:block;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(250,247,242,0.6);margin-bottom:8px}
  input{width:100%;padding:12px 14px;border-radius:8px;border:1px solid rgba(250,247,242,0.2);background:rgba(0,0,0,0.25);color:#FAF7F2;font-size:16px;box-sizing:border-box;font-family:inherit}
  input:focus{outline:none;border-color:#3DBA9C}
  button{width:100%;margin-top:18px;padding:14px;background:#2C2418;color:#FAF7F2;border:0;border-radius:8px;font-size:14px;font-weight:500;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:inherit}
  button:hover{background:#3b3121}
</style>
</head>
<body>
<form class="card" method="POST" action="/__auth">
  <h1>Abschiedsbuch</h1>
  <p class="sub">Diese Seite ist passwortgeschützt. Bitte Zugangscode eingeben.</p>
  ${errMsg}
  <label for="p">Zugangscode</label>
  <input id="p" name="passwort" type="password" autofocus autocomplete="current-password"/>
  <input type="hidden" name="redirect" value="${target.replace(/"/g, '&quot;')}"/>
  <button type="submit">Zugang</button>
</form>
</body>
</html>`
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

// Base64url ohne Padding
function b64u(bytes) {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(secret, msg) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg))
  return b64u(new Uint8Array(sig))
}

// Timing-safe Vergleich zweier gleich langer Strings
function safeEqual(a, b) {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

async function makeToken(secret) {
  const exp = String(Date.now() + COOKIE_MAX_AGE * 1000)
  const sig = await hmac(secret, exp)
  return `${exp}.${sig}`
}

async function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') return false
  const i = token.indexOf('.')
  if (i < 1) return false
  const exp = token.slice(0, i)
  const sig = token.slice(i + 1)
  if (!/^\d+$/.test(exp)) return false
  if (Number(exp) < Date.now()) return false
  const expected = await hmac(secret, exp)
  return safeEqual(expected, sig)
}

function cookieHeader(token) {
  const attrs = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
  ]
  return attrs.join('; ')
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || ''
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return null
}

// Verhindert Open-Redirect: Ziel muss ein lokaler Pfad sein. Insbesondere
// //evil.com und /\evil.com (protokollrelative Weiterleitungen) werden
// abgewiesen.
function sanitizeRedirect(target) {
  if (!target || typeof target !== 'string') return '/'
  if (!target.startsWith('/')) return '/'
  if (target.startsWith('//') || target.startsWith('/\\')) return '/'
  // Keine eingebetteten Steuerzeichen / CRLF-Injection via Location-Header
  if (/[\r\n]/.test(target)) return '/'
  return target
}

export default async function middleware(request) {
  const url = new URL(request.url)
  const password = globalThis.process?.env?.ACCESS_PASSWORD || ''

  // Falls kein Passwort gesetzt ist: Middleware deaktiviert (Fallback).
  if (!password) return

  // Print-Route fuer die interne PDF-Pipeline:
  // nur mit gueltigem Shared-Secret-Token aufrufbar (umgeht den
  // Password-Cookie, weil Puppeteer keinen Cookie mitbringt). Token
  // kommt aus dem x-pdf-token-Header, damit er nicht in Logs landet.
  if (url.pathname === '/fotobuch-print') {
    const pdfSecret = globalThis.process?.env?.PDF_SECRET || ''
    const t = request.headers.get('x-pdf-token') || ''
    if (pdfSecret && t && safeEqual(t, pdfSecret)) {
      return // durchlassen
    }
    return new Response('Not Found', { status: 404 })
  }

  // Auth-Endpoint: Passwort prüfen und Cookie setzen
  if (url.pathname === '/__auth' && request.method === 'POST') {
    let form
    try { form = await request.formData() } catch { form = new FormData() }
    const given = String(form.get('passwort') || '')
    const target = sanitizeRedirect(String(form.get('redirect') || '/'))

    if (safeEqual(given, password)) {
      const token = await makeToken(password)
      return new Response(null, {
        status: 303,
        headers: {
          location: target,
          'set-cookie': cookieHeader(token),
          'cache-control': 'no-store',
        },
      })
    }
    return htmlResponse(loginPage({ target, error: true }), 401)
  }

  // Cookie prüfen
  const token = readCookie(request, COOKIE_NAME)
  if (token && await verifyToken(token, password)) {
    return // durchlassen
  }

  // Login-Seite
  const target = sanitizeRedirect(url.pathname + url.search)
  return htmlResponse(loginPage({ target }))
}
