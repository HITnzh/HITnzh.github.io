<script setup>
import { Menu, PenLine, Search, X } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getBackendStatus, getSession, onSessionChange } from '../services/adminService'

const route = useRoute()
const router = useRouter()
const backend = getBackendStatus()
const isOpen = ref(false)
const searchOpen = ref(false)
const query = ref('')
const session = ref(null)
const scrolled = ref(false)
let stopSessionWatch = () => {}

const links = [
  { label: '文章', to: '/posts' },
  { label: '安利', to: '/recommendations' },
  { label: '碎笔', to: '/fragments' },
  { label: '相册', to: '/gallery' },
  { label: '关于', to: '/about' },
]

const menuIcon = computed(() => (isOpen.value ? X : Menu))
const showAdminTools = computed(() => backend.configured && session.value)

watch(
  () => route.fullPath,
  () => {
    isOpen.value = false
    searchOpen.value = false
    query.value = typeof route.query.q === 'string' ? route.query.q : ''
  },
  { immediate: true },
)

onMounted(async () => {
  session.value = await getSession()
  stopSessionWatch = onSessionChange((nextSession) => {
    session.value = nextSession
  })
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  stopSessionWatch()
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  scrolled.value = window.scrollY > 20
}

function submitSearch() {
  const q = query.value.trim()
  if (q) router.push({ path: '/posts', query: { q } })
  searchOpen.value = false
  query.value = ''
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) query.value = ''
}
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="HITnzh 首页">
        <span class="brand-mark">H</span>
        <span class="brand-text">HITnzh</span>
      </RouterLink>

      <nav class="nav-links" :class="{ open: isOpen }" aria-label="主导航">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <button class="header-icon" type="button" :aria-label="searchOpen ? '关闭搜索' : '搜索'" @click="toggleSearch">
          <Search v-if="!searchOpen" :size="18" />
          <X v-else :size="18" />
        </button>

        <RouterLink v-if="showAdminTools" class="header-icon" to="/admin/posts/new" aria-label="写文章">
          <PenLine :size="17" />
        </RouterLink>

        <button class="header-icon menu-toggle" type="button" aria-label="打开导航" @click="isOpen = !isOpen">
          <component :is="menuIcon" :size="20" />
        </button>
      </div>
    </div>

    <Transition name="search-drop">
      <form v-if="searchOpen" class="header-search-bar" role="search" @submit.prevent="submitSearch">
        <Search :size="17" aria-hidden="true" />
        <input
          ref="searchInput"
          v-model="query"
          type="search"
          placeholder="搜索文章..."
          aria-label="搜索文章"
        />
      </form>
    </Transition>
  </header>
</template>
