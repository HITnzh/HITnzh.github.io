import { categories as localCategories, posts as localPosts } from '../data/posts'
import { projects as localProjects } from '../data/projects'
import { recommendations as localRecommendations } from '../data/recommendations'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

function asPost(row) {
  if (!row) return null

  const tags = Array.isArray(row.tags)
    ? row.tags
    : Array.isArray(row.post_tags)
      ? row.post_tags.map((item) => item.tags?.name).filter(Boolean)
      : []

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.published_at ? row.published_at.slice(0, 10) : row.created_at?.slice(0, 10),
    category: row.category?.name || row.categories?.name || row.category || '随笔',
    tags,
    readTime: row.read_time || row.readTime || '5 min',
    cover: row.cover_image || row.cover || '/images/hero-mountain.jpg',
    featured: Boolean(row.featured),
    excerpt: row.excerpt || '',
    content: row.content || [],
    status: row.status || 'published',
  }
}

function asProject(row) {
  return {
    id: row.id,
    name: row.name,
    status: row.status || '进行中',
    description: row.description || '',
    stack: Array.isArray(row.stack) ? row.stack : [],
    link: row.demo_url || row.repo_url || '#',
  }
}

function asRecommendation(item) {
  return {
    id: item.id || item.slug,
    slug: item.slug,
    type: item.type || '安利',
    title: item.title,
    creator: item.creator || '',
    note: item.note || item.description || '',
    cover: item.cover || item.cover_image || '',
    shareImage: item.shareImage || item.share_image || item.cover || item.cover_image || '',
    linkUrl: item.linkUrl || item.link_url || '',
    linkLabel: item.linkLabel || item.link_label || '打开链接',
    tags: Array.isArray(item.tags) ? item.tags : [],
    status: item.status || 'published',
    featured: Boolean(item.featured),
    sortOrder: Number(item.sortOrder ?? item.sort_order ?? 100),
    tone: item.tone || 'moss',
  }
}

function sortPosts(items) {
  return [...items].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

function sortRecommendations(items) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
}

async function getRecommendationItems() {
  if (!isSupabaseConfigured) return localRecommendations.map(asRecommendation)

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'recommendations')
    .maybeSingle()

  if (error) {
    console.warn('Falling back to local recommendations:', error.message)
    return localRecommendations.map(asRecommendation)
  }

  const value = data?.value
  const items = Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : localRecommendations
  return items.map(asRecommendation)
}

export async function getPublishedPosts() {
  if (!isSupabaseConfigured) return sortPosts(localPosts)

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        id,
        slug,
        title,
        excerpt,
        content,
        cover_image,
        status,
        featured,
        read_time,
        published_at,
        created_at,
        category:categories(name),
        post_tags(tags(name))
      `,
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.warn('Falling back to local posts:', error.message)
    return sortPosts(localPosts)
  }

  return data.map(asPost)
}

export async function getPostBySlug(slug) {
  if (!isSupabaseConfigured) {
    return localPosts.find((post) => post.slug === slug) || null
  }

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        id,
        slug,
        title,
        excerpt,
        content,
        cover_image,
        status,
        featured,
        read_time,
        published_at,
        created_at,
        category:categories(name),
        post_tags(tags(name))
      `,
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.warn('Falling back to local post:', error.message)
    return localPosts.find((post) => post.slug === slug) || null
  }

  return asPost(data)
}

export async function getCategories(posts = null) {
  if (!isSupabaseConfigured) return localCategories

  const { data, error } = await supabase.from('categories').select('name').order('name')
  if (error) {
    const source = posts || localPosts
    return ['全部', ...Array.from(new Set(source.map((post) => post.category)))]
  }

  return ['全部', ...data.map((item) => item.name)]
}

export async function getProjects() {
  if (!isSupabaseConfigured) return localProjects

  const { data, error } = await supabase
    .from('projects')
    .select('id, name, status, description, stack, repo_url, demo_url, sort_order')
    .order('sort_order', { ascending: true })

  if (error) {
    console.warn('Falling back to local projects:', error.message)
    return localProjects
  }

  return data.map(asProject)
}

export async function getPublishedRecommendations() {
  const items = await getRecommendationItems()
  return sortRecommendations(items.filter((item) => item.status === 'published'))
}

export async function getRecommendationBySlug(slug) {
  const items = await getPublishedRecommendations()
  return items.find((item) => item.slug === slug) || null
}
