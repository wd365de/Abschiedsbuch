export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    return res.status(500).json({ error: 'Supabase-Zugangsdaten fehlen' })
  }

  const response = await fetch(`${url}/rest/v1/entries?select=id&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  if (!response.ok) {
    return res.status(502).json({ error: 'Supabase-Ping fehlgeschlagen', status: response.status })
  }

  res.status(200).json({ ok: true, pinged: new Date().toISOString() })
}
