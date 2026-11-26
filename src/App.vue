<script setup>
import { ChevronUp } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PetalEffect from './components/PetalEffect.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'

const route = useRoute()
const isHome = computed(() => route.name === 'home')
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
  <div :class="{ 'journal-shell': isHome }">
    <template v-if="route.name && !isHome">
      <PetalEffect v-if="route.name !== 'fragments'" />
      <div class="side-decor side-decor-left" aria-hidden="true"></div>
      <div class="side-decor side-decor-right" aria-hidden="true"></div>
    </template>
    <SiteHeader :home="isHome" :scrolled="scrolled" />
    <RouterView />
    <SiteFooter :home="isHome" />
    <button v-if="!isHome || showBackTop" class="back-top" type="button" aria-label="回到顶部" @click="scrollToTop">
      <ChevronUp :size="18" />
    </button>
  </div>
</template>

<style scoped>
.journal-shell {
  --journal-gutter: clamp(22px, 5vw, 76px);
  --journal-width: min(1240px, calc(100% - var(--journal-gutter) * 2));
  background: #f8f8f2;
}

.journal-shell .back-top {
  border: 1px solid #c6d0c5;
  border-radius: 50%;
  background: #f8f8f2;
  color: #294e40;
  box-shadow: 0 3px 12px rgb(41 78 64 / 6%);
}

.journal-shell .back-top:hover {
  background: #e8ede2;
}

.journal-shell .back-top:focus-visible {
  outline: 2px solid #294e40;
  outline-offset: 3px;
}
</style>
