<script setup>
import { Upload } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getAdminRecommendation,
  getBackendStatus,
  getSession,
  saveRecommendation,
  uploadAsset,
} from '../services/adminService'

const route = useRoute()
const router = useRouter()
const backend = getBackendStatus()
const isNew = computed(() => route.name === 'admin-recommendation-new')
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const form = ref({
  id: null,
  title: '',
  slug: '',
  type: '番剧',
  creator: '',
  note: '',
  cover: '',
  shareImage: '',
  linkUrl: '',
  linkLabel: '打开链接',
  tags: '',
  status: 'draft',
  featured: false,
  sortOrder: 100,
  tone: 'moss',
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
      const item = await getAdminRecommendation(route.params.id)
      if (!item) {
        message.value = '没有找到这条安利'
      } else {
        form.value = {
          id: item.id,
          title: item.title || '',
          slug: item.slug || '',
          type: item.type || '番剧',
          creator: item.creator || '',
          note: item.note || '',
          cover: item.cover || '',
          shareImage: item.shareImage || '',
          linkUrl: item.linkUrl || '',
          linkLabel: item.linkLabel || '打开链接',
          tags: (item.tags || []).join('，'),
          status: item.status || 'draft',
          featured: Boolean(item.featured),
          sortOrder: Number(item.sortOrder || 100),
          tone: item.tone || 'moss',
        }
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
    const result = await saveRecommendation({
      ...form.value,
      slug: form.value.slug || slugify(form.value.title),
    })
    message.value = '已保存'
    if (isNew.value) router.replace(`/admin/recommendations/${result.id}/edit`)
  } catch (error) {
    message.value = error.message
  } finally {
    saving.value = false
  }
}

async function uploadImage(event, field) {
  const file = event.target.files?.[0]
  if (!file) return
  message.value = '正在上传图片'
  try {
    form.value[field] = await uploadAsset(file)
    message.value = '图片已上传'
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
      <h1>{{ isNew ? '新安利' : '编辑安利' }}</h1>
      <p>添加封面、分享图、详情说明和外部链接。</p>
    </section>

    <section class="section-wrap">
      <div v-if="loading" class="empty-state">
        <h2>正在加载编辑器</h2>
        <p>稍等一下。</p>
      </div>
      <div v-else-if="!backend.configured" class="setup-panel">
        <h2>Supabase 未配置</h2>
        <p>配置 Supabase 后，安利编辑器会启用。</p>
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
              类型
              <select v-model="form.type">
                <option>番剧</option>
                <option>书籍</option>
                <option>专辑</option>
                <option>电影</option>
                <option>游戏</option>
                <option>工具</option>
                <option>其他</option>
              </select>
            </label>
            <label>
              作者 / 创作者
              <input v-model="form.creator" type="text" />
            </label>
          </div>
          <label>
            推荐说明
            <textarea v-model="form.note" rows="5" required></textarea>
          </label>
          <div class="editor-inline-fields">
            <label>
              标签
              <input v-model="form.tags" type="text" placeholder="番剧，奇幻，旅行" />
            </label>
            <label>
              排序
              <input v-model.number="form.sortOrder" type="number" min="0" step="1" />
            </label>
          </div>
          <div class="editor-inline-fields">
            <label>
              外部链接
              <input v-model="form.linkUrl" type="url" placeholder="https://..." />
            </label>
            <label>
              链接按钮文字
              <input v-model="form.linkLabel" type="text" />
            </label>
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
            封面色
            <select v-model="form.tone">
              <option value="moss">moss</option>
              <option value="ink">ink</option>
              <option value="teal">teal</option>
              <option value="blue">blue</option>
              <option value="sun">sun</option>
              <option value="plum">plum</option>
            </select>
          </label>
          <label class="check-row">
            <input v-model="form.featured" type="checkbox" />
            设为精选
          </label>
          <label>
            封面 URL
            <input v-model="form.cover" type="url" />
          </label>
          <div v-if="form.cover" class="cover-preview">
            <img :src="form.cover" alt="安利封面预览" />
          </div>
          <label class="upload-control">
            <Upload :size="18" />
            上传封面
            <input type="file" accept="image/*" @change="uploadImage($event, 'cover')" />
          </label>
          <label>
            分享图 URL
            <input v-model="form.shareImage" type="url" />
          </label>
          <div v-if="form.shareImage" class="cover-preview">
            <img :src="form.shareImage" alt="分享图预览" />
          </div>
          <label class="upload-control">
            <Upload :size="18" />
            上传分享图
            <input type="file" accept="image/*" @change="uploadImage($event, 'shareImage')" />
          </label>
          <button class="primary-action" type="submit" :disabled="saving">
            {{ saving ? '保存中' : '保存安利' }}
          </button>
          <p v-if="message" class="form-note">{{ message }}</p>
        </aside>
      </form>
    </section>
  </main>
</template>
