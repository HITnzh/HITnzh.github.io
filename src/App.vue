<script setup>
import { ChevronUp } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PetalEffect from './components/PetalEffect.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'

const route = useRoute()
const showPetals = computed(() => route.name !== 'fragments')

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <PetalEffect v-if="showPetals" />
  <div class="side-decor side-decor-left" aria-hidden="true"></div>
  <div class="side-decor side-decor-right" aria-hidden="true"></div>
  <SiteHeader />
  <RouterView />
  <SiteFooter />
  <button class="back-top" type="button" aria-label="回到顶部" @click="scrollToTop">
    <ChevronUp :size="18" />
  </button>
</template>
