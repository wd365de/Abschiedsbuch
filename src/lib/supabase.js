import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error('Supabase-Zugangsdaten fehlen. Bitte .env.local prüfen.')
}

export const supabase = createClient(supabaseUrl, supabaseAnon)
