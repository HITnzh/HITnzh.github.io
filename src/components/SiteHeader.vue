<script setup>
import { Menu, PenLine, Search, Sprout, X } from 'lucide-vue-next'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getBackendStatus, getSession, onSessionChange } from '../services/adminService'

defineProps({ research: Boolean, garden: Boolean, scrolled: Boolean })

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

const researchSections = [
  { label: '研究方向', hash: '#research' },
  { label: '近期动态', hash: '#activity' },
  { label: '站点索引', hash: '#directory' },
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
  <header class="site-header" :class="{ scrolled, 'reading-header': garden || research, 'journal-header': garden, 'research-header': research }" @keydown.esc="closePanels">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="HITnzh 首页" @click="closePanels">
        <span v-if="!research" class="brand-mark">
          <Sprout v-if="garden" :size="22" :stroke-width="1.5" aria-hidden="true" />
          <template v-else>H</template>
        </span>
        <span class="brand-text">HITnzh</span>
        <span v-if="garden" class="brand-note">个人手记</span>
        <template v-if="research">
          <span class="research-slash" aria-hidden="true">/</span>
          <span class="research-label" lang="en">Research</span>
        </template>
      </RouterLink>

      <nav id="site-navigation" ref="navigation" class="nav-links" :class="{ open: isOpen }" aria-label="主导航" @click="isOpen && closePanels()">
        <template v-if="research">
          <RouterLink v-for="section in researchSections" :key="section.hash" v-slot="{ href, navigate }" :to="{ path: '/', hash: section.hash }" custom>
            <a :href="href" :aria-current="route.hash === section.hash ? 'location' : undefined" @click="navigate">{{ section.label }}</a>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink v-if="garden" to="/garden">博客首页</RouterLink>
          <RouterLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
        </template>
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
.reading-header {
  --header-height: 70px;
  background: var(--shell-paper);
  border-bottom: 1px solid var(--shell-line);
}

.reading-header.scrolled {
  border-color: var(--shell-line);
  box-shadow: none;
}

.reading-header .header-inner,
.reading-header .header-search-bar {
  width: var(--shell-width);
  max-width: none;
  padding-inline: 0;
}

.reading-header .header-inner {
  gap: clamp(16px, 2vw, 32px);
}

.reading-header .brand {
  gap: 9px;
  color: #213d32;
}

.reading-header .brand-mark {
  width: 32px;
  height: 34px;
  border-radius: 7px;
  background: var(--shell-ink);
  color: #f4f4de;
}

.reading-header .brand-text {
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

.research-header .brand {
  gap: 13px;
  color: #202b35;
}

.research-slash {
  color: #a4ada9;
  font: 400 19px/1 Georgia, serif;
}

.research-label {
  color: var(--shell-ink);
  font: 400 18px/1 Georgia, 'Times New Roman', serif;
}

.reading-header .nav-links {
  flex: 0 1 auto;
  margin-left: auto;
  gap: clamp(10px, 1.5vw, 24px);
}

.reading-header .nav-links a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 4px 1px;
  color: var(--shell-muted);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .045em;
}

.reading-header .nav-links a:is(:hover, .router-link-active) {
  background: transparent;
  color: var(--shell-ink);
}

.reading-header .nav-links a:is(.router-link-exact-active, [aria-current="location"]) {
  font-weight: 650;
}

.reading-header .nav-links a:is(.router-link-exact-active, [aria-current="location"])::after {
  position: absolute;
  right: 1px;
  bottom: 2px;
  left: 1px;
  height: 2px;
  background: var(--shell-ink);
  content: '';
}

.reading-header .header-actions {
  gap: 4px;
  padding-left: 14px;
  border-left: 1px solid var(--shell-line);
}

.reading-header .header-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: var(--shell-ink);
}

.reading-header .header-icon:hover {
  border-color: transparent;
  background: var(--shell-hover);
}

.reading-header .header-search-bar {
  padding-block: 13px;
  border-color: var(--shell-line);
  background: transparent;
}

.reading-header .header-search-bar input {
  padding: 5px 7px;
}

.reading-header :is(a, button, input):focus-visible {
  outline: 2px solid var(--shell-ink);
  outline-offset: 3px;
}

@media (max-width: 980px) {
  .reading-header .header-actions {
    margin-left: auto;
    border: 0;
    padding: 0;
  }

  .reading-header .header-icon {
    width: 44px;
    height: 44px;
  }

  .reading-header .nav-links {
    position: absolute;
    top: 100%;
    justify-content: flex-start;
    align-items: stretch;
    gap: 4px;
    padding: 10px var(--shell-gutter) 16px;
    border-color: var(--shell-line);
    background: var(--shell-paper);
  }

  .reading-header .nav-links.open {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .reading-header .nav-links a {
    justify-content: center;
    padding: 8px;
  }

  .reading-header .nav-links a:is(.router-link-exact-active, [aria-current="location"]) {
    background: var(--shell-hover);
  }

  .reading-header .nav-links a:is(.router-link-exact-active, [aria-current="location"])::after {
    display: none;
  }
}

@media (max-width: 640px) {
  .reading-header {
    --header-height: 62px;
  }
}

@media (max-width: 420px) {
  .brand-note {
    display: none;
  }
}

@media (max-width: 360px) {
  .research-header .brand {
    display: grid;
    gap: 2px;
  }

  .research-slash {
    display: none;
  }

  .research-label {
    font-size: 13px;
    letter-spacing: .03em;
  }
}
</style>
