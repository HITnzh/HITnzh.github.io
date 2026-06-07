<script setup>
import { Menu, PenLine, Search, X } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getBackendStatus, getSession, onSessionChange } from '../services/adminService'

const route = useRoute()
const router = useRouter()
const backend = getBackendStatus()
const isOpen = ref(false)
const query = ref('')
const session = ref(null)
let stopSessionWatch = () => {}

const links = [
  { label: '首页', to: '/' },
  { label: '文章', to: '/posts' },
  { label: '归档', to: '/archive' },
  { label: '项目', to: '/projects' },
  { label: '关于', to: '/about' },
]

const menuIcon = computed(() => (isOpen.value ? X : Menu))
const showAdminTools = computed(() => backend.configured && session.value)

watch(
  () => route.fullPath,
  () => {
    isOpen.value = false
    query.value = typeof route.query.q === 'string' ? route.query.q : ''
  },
  { immediate: true },
)

onMounted(async () => {
  session.value = await getSession()
  stopSessionWatch = onSessionChange((nextSession) => {
    session.value = nextSession
  })
})

onUnmounted(() => {
  stopSessionWatch()
})

function submitSearch() {
  const q = query.value.trim()
  router.push(q ? { path: '/posts', query: { q } } : { path: '/posts' })
}
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="HITnzh Blog 首页">
      <span class="brand-mark">H</span>
      <span class="brand-text">HITnzh Blog</span>
    </RouterLink>

    <nav class="nav-links" :class="{ open: isOpen }" aria-label="主导航">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to">
        {{ link.label }}
      </RouterLink>
    </nav>

    <form class="header-search" role="search" @submit.prevent="submitSearch">
      <Search :size="18" aria-hidden="true" />
      <input v-model="query" type="search" placeholder="搜索文章" aria-label="搜索文章" />
    </form>

    <RouterLink v-if="showAdminTools" class="admin-write-link" to="/admin/posts/new">
      <PenLine :size="17" />
      <span>写文章</span>
    </RouterLink>

    <button class="icon-button menu-toggle" type="button" aria-label="打开导航" @click="isOpen = !isOpen">
      <component :is="menuIcon" :size="20" />
    </button>
  </header>
</template>
