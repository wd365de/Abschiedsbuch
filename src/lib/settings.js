import { supabase } from './supabase'

export async function getGalleryVisible() {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'gallery_visible')
    .single()

  if (error) return false
  return data?.value === true
}

export async function setGalleryVisible(visible) {
  return supabase
    .from('settings')
    .update({ value: visible })
    .eq('key', 'gallery_visible')
}
