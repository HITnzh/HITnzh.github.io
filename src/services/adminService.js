import { isSupabaseConfigured, supabase, supabaseConfig } from '../lib/supabase'

export function getBackendStatus() {
  return {
    configured: isSupabaseConfigured,
    url: supabaseConfig.url,
    storageBucket: supabaseConfig.storageBucket,
  }
}

export async function getSession() {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function signIn(email, password) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.session
}

export async function signOut() {
  if (!isSupabaseConfigured) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function listAdminPosts() {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, title, status, featured, published_at, updated_at')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getAdminPost(id) {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function savePost(payload) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.')
  }

  const record = {
    slug: payload.slug,
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image: payload.cover_image,
    status: payload.status,
    featured: payload.featured,
    read_time: payload.read_time,
    published_at: payload.status === 'published' ? payload.published_at || new Date().toISOString() : null,
  }

  const query = payload.id
    ? supabase.from('posts').update(record).eq('id', payload.id).select('id').single()
    : supabase.from('posts').insert(record).select('id').single()

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function uploadAsset(file) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.')
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`
  const { error } = await supabase.storage.from(supabaseConfig.storageBucket).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })

  if (error) throw error

  const { data } = supabase.storage.from(supabaseConfig.storageBucket).getPublicUrl(path)
  return data.publicUrl
}
