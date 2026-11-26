<script setup>
import { ChevronUp } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PetalEffect from './components/PetalEffect.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'

const route = useRoute()
const isResearch = computed(() => route.name === 'home')
const isGarden = computed(() => route.name === 'garden')
const scrolled = ref(false)
const showBackTop = ref(false)

onMounted(() => {
  updateScroll()
  window.addEventListener('scroll', updateScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', updateScroll))

function updateScroll() {
  scrolled.value = window.scrollY > 20
  showBackTop.value = window.scrollY > 450
}

function scrollToTop() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
}
</script>

<template>
  <div :class="{ 'research-shell': isResearch, 'journal-shell': isGarden }">
    <template v-if="route.name && !isResearch && !isGarden">
      <PetalEffect v-if="route.name !== 'fragments'" />
      <div class="side-decor side-decor-left" aria-hidden="true"></div>
      <div class="side-decor side-decor-right" aria-hidden="true"></div>
    </template>
    <SiteHeader :research="isResearch" :garden="isGarden" :scrolled="scrolled" />
    <RouterView />
    <SiteFooter :research="isResearch" :garden="isGarden" />
    <button v-if="(!isResearch && !isGarden) || showBackTop" class="back-top" type="button" aria-label="回到顶部" @click="scrollToTop">
      <ChevronUp :size="18" />
    </button>
  </div>
</template>

<style scoped>
.journal-shell {
  --journal-gutter: clamp(22px, 5vw, 76px);
  --journal-width: min(1240px, calc(100% - var(--journal-gutter) * 2));
  --shell-width: var(--journal-width);
  --shell-gutter: var(--journal-gutter);
  --shell-paper: #f8f8f2;
  --shell-ink: #294e40;
  --shell-line: #d8ded3;
  --shell-muted: #596459;
  --shell-hover: #e8ede3;
  background: #f8f8f2;
}

.research-shell {
  --shell-gutter: clamp(22px, 5vw, 70px);
  --shell-width: min(1080px, calc(100% - var(--shell-gutter) * 2));
  --shell-paper: #faf9f6;
  --shell-ink: #285e63;
  --shell-line: #d8dedc;
  --shell-muted: #526268;
  --shell-hover: #e7efeb;
  background: var(--shell-paper);
}

:is(.journal-shell, .research-shell) .back-top {
  border: 1px solid var(--shell-line);
  border-radius: 50%;
  background: var(--shell-paper);
  color: var(--shell-ink);
  box-shadow: 0 3px 12px rgb(41 78 64 / 6%);
}

:is(.journal-shell, .research-shell) .back-top:hover {
  background: var(--shell-hover);
}

:is(.journal-shell, .research-shell) .back-top:focus-visible {
  outline: 2px solid var(--shell-ink);
  outline-offset: 3px;
}
</style>
