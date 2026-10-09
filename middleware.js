// Vercel Edge Middleware: Passwortschutz für die ganze Seite.
// Prüft Cookie "abschiedsbuch_access". Fehlt der oder ist ungültig,
// wird eine Login-Seite ausgespielt. Bei korrektem Passwort setzt
// die POST-Handling-Zweig das Cookie mit 24h Gültigkeit.
//
// Erwartete Env-Variable (im Vercel-Dashboard setzen):
//   ACCESS_PASSWORD   z.B. "item"
//
// matcher lässt /api/keepalive (Cron), Favicon und Robots unberührt.

export const config = {
  matcher: ['/((?!api/keepalive|favicon|robots\\.txt|\\.well-known).*)'],
}

const COOKIE_NAME = 'abschiedsbuch_access'
const COOKIE_VALUE = 'ok'
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

function cookieHeader() {
  const attrs = [
    `${COOKIE_NAME}=${COOKIE_VALUE}`,
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

export default async function middleware(request) {
  const url = new URL(request.url)
  const password = globalThis.process?.env?.ACCESS_PASSWORD || ''

  // Falls kein Passwort gesetzt ist: Middleware deaktiviert (Fallback).
  if (!password) return

  // Auth-Endpoint: Passwort prüfen und Cookie setzen
  if (url.pathname === '/__auth' && request.method === 'POST') {
    let form
    try { form = await request.formData() } catch { form = new FormData() }
    const given = String(form.get('passwort') || '')
    const target = String(form.get('redirect') || '/') || '/'
    const safeTarget = target.startsWith('/') ? target : '/'

    if (given === password) {
      return new Response(null, {
        status: 303,
        headers: {
          location: safeTarget,
          'set-cookie': cookieHeader(),
          'cache-control': 'no-store',
        },
      })
    }
    return htmlResponse(loginPage({ target: safeTarget, error: true }), 401)
  }

  // Cookie prüfen
  if (readCookie(request, COOKIE_NAME) === COOKIE_VALUE) {
    return // durchlassen
  }

  // Login-Seite
  const target = url.pathname + url.search
  return htmlResponse(loginPage({ target }))
}
