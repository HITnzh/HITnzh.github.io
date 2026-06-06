<script setup>
import { Edit3, LogOut, Plus } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getBackendStatus, getSession, listAdminPosts, signOut } from '../services/adminService'

const router = useRouter()
const backend = getBackendStatus()
const posts = ref([])
const loading = ref(true)
const message = ref('')

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

  try {
    posts.value = await listAdminPosts()
  } catch (error) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}

async function logout() {
  await signOut()
  router.push('/admin/login')
}

onMounted(load)
</script>

<template>
  <main class="page-shell admin-shell">
    <section class="page-hero compact-hero admin-title-row">
      <div>
        <p class="eyebrow">Admin</p>
        <h1>文章管理</h1>
        <p>管理草稿和已发布文章。</p>
      </div>
      <div class="admin-title-actions">
        <RouterLink class="primary-action" to="/admin/posts/new"><Plus :size="18" /> 新文章</RouterLink>
        <button class="secondary-admin-action" type="button" @click="logout"><LogOut :size="18" /> 退出</button>
      </div>
    </section>

    <section class="section-wrap">
      <div v-if="loading" class="empty-state">
        <h2>正在加载文章</h2>
        <p>稍等一下。</p>
      </div>
      <div v-else-if="!backend.configured" class="setup-panel">
        <h2>Supabase 未配置</h2>
        <p>配置 `.env.local` 并运行数据库脚本后，文章管理会启用。</p>
      </div>
      <div v-else-if="message" class="empty-state">
        <h2>加载失败</h2>
        <p>{{ message }}</p>
      </div>
      <div v-else class="admin-table">
        <RouterLink v-for="post in posts" :key="post.id" :to="`/admin/posts/${post.id}/edit`" class="admin-row">
          <span>{{ post.status }}</span>
          <strong>{{ post.title }}</strong>
          <time>{{ post.published_at ? post.published_at.slice(0, 10) : '未发布' }}</time>
          <Edit3 :size="17" />
        </RouterLink>
        <div v-if="!posts.length" class="empty-state">
          <h2>还没有文章</h2>
          <p>从第一篇草稿开始。</p>
        </div>
      </div>
    </section>
  </main>
</template>
