<script setup>
import { ArrowLeft, ChevronLeft, ChevronRight, Download, X } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { albums } from '../data/gallery'

const route = useRoute()
const album = computed(() => albums.find((a) => a.id === route.params.albumId) || null)
const lightboxIndex = ref(-1)
const lightboxOpen = ref(false)

const currentImage = computed(() => {
  if (!album.value || lightboxIndex.value < 0) return null
  return album.value.images[lightboxIndex.value] || null
})

function open(idx) {
  lightboxIndex.value = idx
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function close() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
  setTimeout(() => { lightboxIndex.value = -1 }, 300)
}

function prev() {
  if (!album.value) return
  lightboxIndex.value = (lightboxIndex.value - 1 + album.value.images.length) % album.value.images.length
}

function next() {
  if (!album.value) return
  lightboxIndex.value = (lightboxIndex.value + 1) % album.value.images.length
}

function onKey(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

let touchStartX = 0
function onTouchStart(e) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 60) { diff > 0 ? next() : prev() }
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

watch(() => route.params.albumId, () => { lightboxIndex.value = -1; lightboxOpen.value = false })
</script>

<template>
  <main class="page-shell">
    <section v-if="album" class="section-wrap">
      <RouterLink class="back-link" to="/gallery">
        <ArrowLeft :size="18" /> 返回相册
      </RouterLink>

      <header class="album-header">
        <div>
          <p class="eyebrow">{{ album.date }}</p>
          <h1>{{ album.title }}</h1>
          <p>{{ album.description }}</p>
        </div>
        <span class="album-photo-count">{{ album.images.length }} 张照片</span>
      </header>

      <div class="album-grid">
        <figure
          v-for="(img, idx) in album.images"
          :key="idx"
          class="album-photo"
          :class="{ 'photo-wide': idx === 0 }"
          @click="open(idx)"
        >
          <img :src="img.src" :alt="img.caption || img.date" loading="lazy" />
          <figcaption v-if="img.caption">{{ img.caption }}</figcaption>
        </figure>
      </div>
    </section>

    <section v-else class="section-wrap">
      <div class="empty-state">
        <h2>相册不存在</h2>
        <p>可能是链接写错了。</p>
        <RouterLink class="primary-action" to="/gallery">返回相册</RouterLink>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lb-fade">
        <div
          v-if="lightboxOpen && currentImage"
          class="lightbox"
          @click.self="close"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div class="lightbox-toolbar">
            <span>{{ lightboxIndex + 1 }} / {{ album?.images.length }}</span>
            <button @click="close" aria-label="关闭"><X :size="22" /></button>
          </div>

          <button class="lightbox-arrow lb-left" @click="prev" aria-label="上一张">
            <ChevronLeft :size="28" />
          </button>

          <div class="lightbox-stage">
            <Transition name="lb-slide" mode="out-in">
              <img
                :key="currentImage.src"
                :src="currentImage.src"
                :alt="currentImage.caption || ''"
              />
            </Transition>
            <p v-if="currentImage.caption" class="lightbox-caption">{{ currentImage.caption }}</p>
          </div>

          <button class="lightbox-arrow lb-right" @click="next" aria-label="下一张">
            <ChevronRight :size="28" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>
