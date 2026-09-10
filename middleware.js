const ALLOWED_IPS = ['153.96.224.80']

export default function middleware(request) {
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

// /api/keepalive (Cron) kommt aus Vercels eigener Infrastruktur, nicht aus
// dem Institutsnetz, und ist bewusst die einzige Ausnahme von der Sperre.
export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api/keepalive).*)'],
}
