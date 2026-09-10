const ALLOWED_IPS = ['153.96.224.80']

// Cron-Aufrufe (/api/keepalive) kommen aus Vercels eigener Infrastruktur,
// nicht aus dem Institutsnetz, und müssen die Prüfung immer passieren.
const BYPASS_PATHS = ['/api/keepalive']

export default function middleware(request) {
  const { pathname } = new URL(request.url)
  if (BYPASS_PATHS.some((path) => pathname.startsWith(path))) {
    return
  }

  // Der letzte Eintrag in x-forwarded-for ist die von Vercels Edge selbst
  // gesehene Client-IP und kann anders als vorherige Eintraege nicht vom
  // Client gefaelscht werden.
  const forwardedFor = request.headers.get('x-forwarded-for') || ''
  const parts = forwardedFor.split(',').map((part) => part.trim()).filter(Boolean)
  const ip = parts[parts.length - 1] || ''

  if (ALLOWED_IPS.includes(ip)) {
    return
  }

  return new Response('Diese Seite ist nur aus dem Institutsnetz erreichbar.', {
    status: 403,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api/keepalive).*)'],
}
