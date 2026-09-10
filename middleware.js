const ALLOWED_IPS = ['153.96.224.80']

// Cron-Aufrufe (/api/keepalive) kommen aus Vercels eigener Infrastruktur,
// nicht aus dem Institutsnetz, und müssen die Prüfung immer passieren.
const BYPASS_PATHS = ['/api/keepalive']

export default function middleware(request) {
  const { pathname } = new URL(request.url)
  if (BYPASS_PATHS.some((path) => pathname.startsWith(path))) {
    return
  }

  const forwardedFor = request.headers.get('x-forwarded-for') || ''
  const ip = forwardedFor.split(',')[0].trim()

  if (ALLOWED_IPS.includes(ip)) {
    return
  }

  return new Response('Diese Seite ist nur aus dem Institutsnetz erreichbar.', {
    status: 403,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

export const config = {
  runtime: 'edge',
}
