<script setup>
import { ChevronUp } from 'lucide-vue-next'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <SiteHeader />
  <RouterView />
  <SiteFooter />
  <button class="back-top" type="button" aria-label="回到顶部" @click="scrollToTop">
    <ChevronUp :size="18" />
  </button>
</template>
