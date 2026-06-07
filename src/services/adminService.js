import { isSupabaseConfigured, supabase, supabaseConfig } from '../lib/supabase'
import { recommendations as localRecommendations } from '../data/recommendations'

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

export function onSessionChange(callback) {
  if (!isSupabaseConfigured) return () => {}

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })

  return () => data.subscription.unsubscribe()
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseTagNames(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  return String(value || '')
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

async function ensureCategoryId(name) {
  const trimmed = String(name || '').trim()
  if (!trimmed) return null

  const { data: existing, error: selectError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', trimmed)
    .maybeSingle()

  if (selectError) throw selectError
  if (existing) return existing.id

  const { data, error } = await supabase
    .from('categories')
    .insert({ name: trimmed, slug: slugify(trimmed) })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

async function syncPostTags(postId, tagValue) {
  const names = Array.from(new Set(parseTagNames(tagValue)))
  const { error: deleteError } = await supabase.from('post_tags').delete().eq('post_id', postId)
  if (deleteError) throw deleteError

  if (!names.length) return

  const { data: existingTags, error: selectError } = await supabase
    .from('tags')
    .select('id, name')
    .in('name', names)

  if (selectError) throw selectError

  const existingNames = new Set((existingTags || []).map((tag) => tag.name))
  const missingTags = names
    .filter((name) => !existingNames.has(name))
    .map((name) => ({ name, slug: slugify(name) }))

  let createdTags = []
  if (missingTags.length) {
    const { data, error } = await supabase.from('tags').insert(missingTags).select('id, name')
    if (error) throw error
    createdTags = data || []
  }

  const tags = [...(existingTags || []), ...createdTags]
  const links = tags.map((tag) => ({ post_id: postId, tag_id: tag.id }))
  const { error: insertError } = await supabase.from('post_tags').insert(links)
  if (insertError) throw insertError
}

function normalizeRecommendation(item) {
  return {
    id: item.id || crypto.randomUUID(),
    slug: item.slug || slugify(item.title),
    type: item.type || '安利',
    title: item.title || '',
    creator: item.creator || '',
    note: item.note || '',
    cover: item.cover || '',
    shareImage: item.shareImage || item.share_image || '',
    linkUrl: item.linkUrl || item.link_url || '',
    linkLabel: item.linkLabel || item.link_label || '打开链接',
    tags: parseTagNames(item.tags),
    status: item.status || 'draft',
    featured: Boolean(item.featured),
    sortOrder: Number(item.sortOrder ?? item.sort_order ?? 100),
    tone: item.tone || 'moss',
  }
}

async function getRecommendationSettingItems() {
  if (!isSupabaseConfigured) return localRecommendations.map(normalizeRecommendation)

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'recommendations')
    .maybeSingle()

  if (error) throw error

  const value = data?.value
  const items = Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : localRecommendations
  return items.map(normalizeRecommendation)
}

async function saveRecommendationSettingItems(items) {
  const normalizedItems = items.map(normalizeRecommendation)
  const { error } = await supabase.from('site_settings').upsert({
    key: 'recommendations',
    value: {
      items: normalizedItems,
      updated_at: new Date().toISOString(),
    },
    updated_at: new Date().toISOString(),
  })

  if (error) throw error
  return normalizedItems
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

  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(name), post_tags(tags(name))')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function savePost(payload) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.')
  }

  const categoryId = await ensureCategoryId(payload.category_name)
  const record = {
    slug: payload.slug,
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image: payload.cover_image,
    status: payload.status,
    featured: payload.featured,
    read_time: payload.read_time,
    category_id: categoryId,
    published_at: payload.status === 'published' ? payload.published_at || new Date().toISOString() : null,
  }

  const query = payload.id
    ? supabase.from('posts').update(record).eq('id', payload.id).select('id').single()
    : supabase.from('posts').insert(record).select('id').single()

  const { data, error } = await query
  if (error) throw error
  await syncPostTags(data.id, payload.tags)
  return data
}

export async function listAdminRecommendations() {
  if (!isSupabaseConfigured) return []

  const items = await getRecommendationSettingItems()
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
}

export async function getAdminRecommendation(id) {
  if (!isSupabaseConfigured) return null

  const items = await getRecommendationSettingItems()
  return items.find((item) => item.id === id || item.slug === id) || null
}

export async function saveRecommendation(payload) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.')
  }

  const items = await getRecommendationSettingItems()
  const record = normalizeRecommendation({
    ...payload,
    slug: payload.slug || slugify(payload.title),
  })
  const index = items.findIndex((item) => item.id === record.id)
  const nextItems = [...items]

  if (index >= 0) {
    nextItems[index] = record
  } else {
    nextItems.push(record)
  }

  await saveRecommendationSettingItems(nextItems)
  return { id: record.id }
}

export async function deleteRecommendation(id) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.')
  }

  const items = await getRecommendationSettingItems()
  await saveRecommendationSettingItems(items.filter((item) => item.id !== id))
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
