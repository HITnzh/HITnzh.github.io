<script setup>
import { Upload } from 'lucide-vue-next'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAdminPost, getBackendStatus, getSession, savePost, uploadAsset } from '../services/adminService'

const route = useRoute()
const router = useRouter()
const backend = getBackendStatus()
const isNew = computed(() => route.name === 'admin-post-new')
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const bodyEditor = ref(null)
const form = ref({
  id: null,
  title: '',
  slug: '',
  category_name: '随笔',
  tags: '',
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

  return content
    .map((block) => {
      if (block.type === 'image' || block.src || block.image?.src) {
        const src = block.src || block.image?.src
        const alt = block.alt || block.caption || block.image?.alt || '图片'
        return `![${alt}](${src})`
      }

      if (block.type === 'code' && block.code) {
        return `\`\`\`\n${block.code}\n\`\`\``
      }

      return [
        block.heading ? `## ${block.heading}` : '',
        ...(block.paragraphs || []),
        block.code ? `\`\`\`\n${block.code}\n\`\`\`` : '',
      ]
        .filter(Boolean)
        .join('\n\n')
    })
    .filter(Boolean)
    .join('\n\n')
}

function textToContent(value) {
  const blocks = []
  const lines = value.replace(/\r\n/g, '\n').split('\n')
  let section = { heading: '正文', paragraphs: [] }
  let paragraph = []
  let code = null

  function ensureSection() {
    if (!section) section = { heading: '正文', paragraphs: [] }
  }

  function flushParagraph() {
    if (!paragraph.length) return
    ensureSection()
    section.paragraphs.push(paragraph.join('\n').trim())
    paragraph = []
  }

  function flushSection() {
    flushParagraph()
    if (section && (section.paragraphs.length || section.heading !== '正文')) {
      blocks.push(section)
    }
    section = null
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (code) {
      if (trimmed.startsWith('```')) {
        blocks.push({ type: 'code', code: code.join('\n') })
        code = null
      } else {
        code.push(line)
      }
      continue
    }

    if (trimmed.startsWith('```')) {
      flushSection()
      code = []
      continue
    }

    const heading = trimmed.match(/^#{2,3}\s+(.+)$/)
    if (heading) {
      flushSection()
      section = { heading: heading[1].trim(), paragraphs: [] }
      continue
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/)
    if (image) {
      flushSection()
      blocks.push({
        type: 'image',
        src: image[2],
        alt: image[1] || '文章图片',
        caption: image[3] || image[1] || '',
      })
      continue
    }

    if (!trimmed) {
      flushParagraph()
      continue
    }

    paragraph.push(trimmed)
  }

  if (code) blocks.push({ type: 'code', code: code.join('\n') })
  flushSection()

  return blocks.length ? blocks : [{ heading: '正文', paragraphs: [] }]
}

function insertBodyText(text) {
  const textarea = bodyEditor.value
  const insertion = `\n\n${text}\n\n`

  if (!textarea) {
    form.value.body = `${form.value.body}${insertion}`
    return
  }

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  form.value.body = `${form.value.body.slice(0, start)}${insertion}${form.value.body.slice(end)}`

  nextTick(() => {
    const cursor = start + insertion.length
    textarea.focus()
    textarea.setSelectionRange(cursor, cursor)
  })
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
        category_name: post.category?.name || '随笔',
        tags: (post.post_tags || []).map((item) => item.tags?.name).filter(Boolean).join('，'),
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

async function uploadBodyImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  message.value = '正在上传正文图片'
  try {
    const url = await uploadAsset(file)
    const alt = file.name.replace(/\.[^.]+$/, '')
    insertBodyText(`![${alt}](${url})`)
    message.value = '正文图片已上传并插入'
  } catch (error) {
    message.value = error.message
  } finally {
    event.target.value = ''
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
          <div class="editor-inline-fields">
            <label>
              分类
              <input v-model="form.category_name" type="text" placeholder="技术 / 生活 / 研究" />
            </label>
            <label>
              标签
              <input v-model="form.tags" type="text" placeholder="Vue，部署，笔记" />
            </label>
          </div>
          <label>
            摘要
            <textarea v-model="form.excerpt" rows="3" required></textarea>
          </label>
          <div class="editor-field">
            <div class="field-label-row">
              <span>正文</span>
              <label class="inline-upload-control">
                <Upload :size="16" />
                插入图片
                <input type="file" accept="image/*" @change="uploadBodyImage" />
              </label>
            </div>
            <textarea
              ref="bodyEditor"
              v-model="form.body"
              class="body-editor"
              rows="18"
              required
              placeholder="支持 ## 小标题、空行分段、``` 代码块，以及 ![说明](图片URL) 插图。"
            ></textarea>
            <p class="field-hint">正文图片会上传到 Supabase Storage，并自动插入到当前光标位置。</p>
          </div>
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
          <div v-if="form.cover_image" class="cover-preview">
            <img :src="form.cover_image" alt="文章封面预览" />
          </div>
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
