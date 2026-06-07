<script setup>
import { Edit3, LogOut, Plus } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getBackendStatus, getSession, listAdminRecommendations, signOut } from '../services/adminService'

const router = useRouter()
const backend = getBackendStatus()
const recommendations = ref([])
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
    recommendations.value = await listAdminRecommendations()
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
        <h1>安利管理</h1>
        <p>管理番剧、书籍、专辑和其他推荐内容。</p>
      </div>
      <div class="admin-title-actions">
        <RouterLink class="primary-action" to="/admin/recommendations/new"><Plus :size="18" /> 新安利</RouterLink>
        <button class="secondary-admin-action" type="button" @click="logout"><LogOut :size="18" /> 退出</button>
      </div>
    </section>

    <section class="section-wrap">
      <div v-if="loading" class="empty-state">
        <h2>正在加载安利</h2>
        <p>稍等一下。</p>
      </div>
      <div v-else-if="!backend.configured" class="setup-panel">
        <h2>Supabase 未配置</h2>
        <p>配置 Supabase 后，安利管理会启用。</p>
      </div>
      <div v-else-if="message" class="empty-state">
        <h2>加载失败</h2>
        <p>{{ message }}</p>
      </div>
      <div v-else class="admin-table">
        <RouterLink
          v-for="item in recommendations"
          :key="item.id"
          :to="`/admin/recommendations/${item.id}/edit`"
          class="admin-row"
        >
          <span>{{ item.status }}</span>
          <strong>{{ item.title }}</strong>
          <time>{{ item.type }} · {{ item.creator || '未填写' }}</time>
          <Edit3 :size="17" />
        </RouterLink>
        <div v-if="!recommendations.length" class="empty-state">
          <h2>还没有安利</h2>
          <p>从第一条推荐开始。</p>
        </div>
      </div>
    </section>
  </main>
</template>
