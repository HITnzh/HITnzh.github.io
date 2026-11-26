<script setup>
import { Menu, PenLine, Search, Sprout, X } from 'lucide-vue-next'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getBackendStatus, getSession, onSessionChange } from '../services/adminService'

defineProps({ home: Boolean, scrolled: Boolean })

const route = useRoute()
const router = useRouter()
const backend = getBackendStatus()
const isOpen = ref(false)
const searchOpen = ref(false)
const query = ref('')
const session = ref(null)
const searchInput = ref(null)
const searchButton = ref(null)
const menuButton = ref(null)
const navigation = ref(null)
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
})

onUnmounted(() => stopSessionWatch())

function submitSearch() {
  const q = query.value.trim()
  if (q) router.push({ path: '/posts', query: { q } })
  searchOpen.value = false
  query.value = ''
}

async function toggleSearch() {
  isOpen.value = false
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    await nextTick()
    searchInput.value.focus()
  } else {
    query.value = ''
  }
}

async function toggleMenu() {
  searchOpen.value = false
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    navigation.value.querySelector('a').focus()
  }
}

function closePanels() {
  if (searchOpen.value) {
    searchOpen.value = false
    searchButton.value.focus()
  } else if (isOpen.value) {
    isOpen.value = false
    menuButton.value.focus()
  }
}
</script>

<template>
  <header class="site-header" :class="{ scrolled, 'journal-header': home }" @keydown.esc="closePanels">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="HITnzh 首页" @click="closePanels">
        <span class="brand-mark">
          <Sprout v-if="home" :size="22" :stroke-width="1.5" aria-hidden="true" />
          <template v-else>H</template>
        </span>
        <span class="brand-text">HITnzh</span>
        <span v-if="home" class="brand-note">个人手记</span>
      </RouterLink>

      <nav id="site-navigation" ref="navigation" class="nav-links" :class="{ open: isOpen }" aria-label="主导航" @click="isOpen && closePanels()">
        <RouterLink v-if="home" to="/">首页</RouterLink>
        <RouterLink v-for="link in links" :key="link.to" :to="link.to">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <button ref="searchButton" class="header-icon" type="button" :aria-label="searchOpen ? '关闭搜索' : '搜索'" :aria-expanded="searchOpen" aria-controls="site-search" @click="toggleSearch">
          <Search v-if="!searchOpen" :size="18" />
          <X v-else :size="18" />
        </button>

        <RouterLink v-if="showAdminTools" class="header-icon" to="/admin/posts/new" aria-label="写文章">
          <PenLine :size="17" />
        </RouterLink>

        <button ref="menuButton" class="header-icon menu-toggle" type="button" :aria-label="isOpen ? '关闭导航' : '打开导航'" :aria-expanded="isOpen" aria-controls="site-navigation" @click="toggleMenu">
          <component :is="menuIcon" :size="20" />
        </button>
      </div>
    </div>

    <Transition name="search-drop">
      <form v-if="searchOpen" id="site-search" class="header-search-bar" role="search" @submit.prevent="submitSearch">
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

<style scoped>
.journal-header {
  --header-height: 70px;
  background: rgb(248 248 242 / 96%);
  border-bottom: 1px solid #d8ded3;
}

.journal-header.scrolled {
  border-color: #ccd5c9;
  box-shadow: none;
}

.journal-header .header-inner,
.journal-header .header-search-bar {
  width: var(--journal-width);
  max-width: none;
  padding-inline: 0;
}

.journal-header .header-inner {
  gap: clamp(16px, 2vw, 32px);
}

.journal-header .brand {
  gap: 9px;
  color: #213d32;
}

.journal-header .brand-mark {
  width: 32px;
  height: 34px;
  border-radius: 7px;
  background: #294e40;
  color: #f4f4de;
}

.journal-header .brand-text {
  display: inline;
  font: 600 25px/1 Georgia, 'Times New Roman', serif;
  letter-spacing: -1.2px;
}

.brand-note {
  margin-left: 6px;
  padding-left: 14px;
  border-left: 1px solid #c8cfbf;
  color: #606e60;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .1em;
}

.journal-header .nav-links {
  flex: 0 1 auto;
  margin-left: auto;
  gap: clamp(10px, 1.5vw, 24px);
}

.journal-header .nav-links a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 4px 1px;
  color: #596459;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .045em;
}

.journal-header .nav-links a:is(:hover, .router-link-active) {
  background: transparent;
  color: #294e40;
}

.journal-header .nav-links a.router-link-exact-active {
  font-weight: 650;
}

.journal-header .nav-links a.router-link-exact-active::after {
  position: absolute;
  right: 1px;
  bottom: 2px;
  left: 1px;
  height: 2px;
  background: #476c58;
  content: '';
}

.journal-header .header-actions {
  gap: 4px;
  padding-left: 14px;
  border-left: 1px solid #d2d9cd;
}

.journal-header .header-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: #294e40;
}

.journal-header .header-icon:hover {
  border-color: transparent;
  background: #e8ede3;
}

.journal-header .header-search-bar {
  padding-block: 13px;
  border-color: #d8ded3;
  background: transparent;
}

.journal-header .header-search-bar input {
  padding: 5px 7px;
}

.journal-header :is(a, button, input):focus-visible {
  outline: 2px solid #476c58;
  outline-offset: 3px;
}

@media (max-width: 980px) {
  .journal-header .header-actions {
    margin-left: auto;
    border: 0;
    padding: 0;
  }

  .journal-header .header-icon {
    width: 44px;
    height: 44px;
  }

  .journal-header .nav-links {
    position: absolute;
    top: 100%;
    justify-content: flex-start;
    align-items: stretch;
    gap: 4px;
    padding: 10px var(--journal-gutter) 16px;
    border-color: #d8ded3;
    background: #f8f8f2;
  }

  .journal-header .nav-links.open {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .journal-header .nav-links a {
    justify-content: center;
    padding: 8px;
  }

  .journal-header .nav-links a.router-link-exact-active {
    background: #e6ece1;
  }

  .journal-header .nav-links a.router-link-exact-active::after {
    display: none;
  }
}

@media (max-width: 640px) {
  .journal-header {
    --header-height: 62px;
  }
}

@media (max-width: 420px) {
  .brand-note {
    display: none;
  }
}
</style>
