<script setup>
import { Upload } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminPost, getBackendStatus, getSession, savePost, uploadAsset } from '../services/adminService'

const route = useRoute()
const router = useRouter()
const backend = getBackendStatus()
const isNew = computed(() => route.name === 'admin-post-new')
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const form = ref({
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  cover_image: '',
  status: 'draft',
  featured: false,
  read_time: '5 min',
  published_at: '',
  body: '',
})

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ensureSlug() {
  if (!form.value.slug && form.value.title) {
    form.value.slug = slugify(form.value.title)
  }
}

function contentToText(content) {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content.flatMap((block) => [block.heading, ...(block.paragraphs || []), block.code]).filter(Boolean).join('\n\n')
}

function textToContent(value) {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)

  return [
    {
      heading: '正文',
      paragraphs,
    },
  ]
}

async function load() {
  if (!backend.configured) {
    loading.value = false
    return
  }

  const session = await getSession()
  if (!session) {
    router.push('/admin/login')
    return
  }

  if (!isNew.value) {
    try {
      const post = await getAdminPost(route.params.id)
      form.value = {
        id: post.id,
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        cover_image: post.cover_image || '',
        status: post.status || 'draft',
        featured: Boolean(post.featured),
        read_time: post.read_time || '5 min',
        published_at: post.published_at || '',
        body: contentToText(post.content),
      }
    } catch (error) {
      message.value = error.message
    }
  }

  loading.value = false
}

async function save() {
  message.value = ''
  saving.value = true
  try {
    const payload = {
      ...form.value,
      slug: form.value.slug || slugify(form.value.title),
      content: textToContent(form.value.body),
    }
    const result = await savePost(payload)
    message.value = '已保存'
    if (isNew.value) router.replace(`/admin/posts/${result.id}/edit`)
  } catch (error) {
    message.value = error.message
  } finally {
    saving.value = false
  }
}

async function uploadCover(event) {
  const file = event.target.files?.[0]
  if (!file) return
  message.value = '正在上传图片'
  try {
    form.value.cover_image = await uploadAsset(file)
    message.value = '图片已上传'
  } catch (error) {
    message.value = error.message
  }
}

onMounted(load)
</script>

<template>
  <main class="page-shell admin-shell">
    <section class="page-hero compact-hero">
      <p class="eyebrow">Admin</p>
      <h1>{{ isNew ? '新文章' : '编辑文章' }}</h1>
      <p>写草稿、上传封面、发布内容。</p>
    </section>

    <section class="section-wrap">
      <div v-if="loading" class="empty-state">
        <h2>正在加载编辑器</h2>
        <p>稍等一下。</p>
      </div>
      <div v-else-if="!backend.configured" class="setup-panel">
        <h2>Supabase 未配置</h2>
        <p>配置 `.env.local` 并运行数据库脚本后，编辑器会启用。</p>
      </div>
      <form v-else class="admin-editor" @submit.prevent="save">
        <div class="editor-grid">
          <label>
            标题
            <input v-model="form.title" type="text" required @blur="ensureSlug" />
          </label>
          <label>
            Slug
            <input v-model="form.slug" type="text" required />
          </label>
          <label>
            摘要
            <textarea v-model="form.excerpt" rows="3" required></textarea>
          </label>
          <label>
            正文
            <textarea v-model="form.body" class="body-editor" rows="16" required></textarea>
          </label>
        </div>

        <aside class="editor-sidebar">
          <label>
            状态
            <select v-model="form.status">
              <option value="draft">草稿</option>
              <option value="published">发布</option>
            </select>
          </label>
          <label>
            阅读时间
            <input v-model="form.read_time" type="text" />
          </label>
          <label class="check-row">
            <input v-model="form.featured" type="checkbox" />
            设为精选
          </label>
          <label>
            封面 URL
            <input v-model="form.cover_image" type="url" />
          </label>
          <label class="upload-control">
            <Upload :size="18" />
            上传封面
            <input type="file" accept="image/*" @change="uploadCover" />
          </label>
          <button class="primary-action" type="submit" :disabled="saving">
            {{ saving ? '保存中' : '保存文章' }}
          </button>
          <p v-if="message" class="form-note">{{ message }}</p>
        </aside>
      </form>
    </section>
  </main>
</template>
