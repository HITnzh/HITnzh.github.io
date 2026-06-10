<script setup>
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { albums } from '../data/gallery'

const route = useRoute()
const album = computed(() => albums.find((a) => a.id === route.params.albumId) || null)
const lightboxIndex = ref(-1)

const currentImage = computed(() => {
  if (lightboxIndex.value < 0 || !album.value) return null
  return album.value.images[lightboxIndex.value] || null
})

function openLightbox(index) {
  lightboxIndex.value = index
}

function closeLightbox() {
  lightboxIndex.value = -1
}

function prevImage() {
  if (!album.value) return
  lightboxIndex.value = (lightboxIndex.value - 1 + album.value.images.length) % album.value.images.length
}

function nextImage() {
  if (!album.value) return
  lightboxIndex.value = (lightboxIndex.value + 1) % album.value.images.length
}

function onKeydown(e) {
  if (lightboxIndex.value < 0) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <main class="page-shell">
    <section v-if="album" class="section-wrap">
      <RouterLink class="back-link" to="/gallery">
        <ArrowLeft :size="18" />
        返回相册列表
      </RouterLink>

      <div class="page-hero" style="padding-top: 28px">
        <p class="eyebrow">{{ album.date }}</p>
        <h1>{{ album.title }}</h1>
        <p>{{ album.description }}</p>
      </div>

      <div class="gallery-photo-grid">
        <img
          v-for="(img, idx) in album.images"
          :key="idx"
          :src="img.src"
          :alt="img.caption || img.date"
          loading="lazy"
          @click="openLightbox(idx)"
        />
      </div>

      <div v-if="album.images.length === 0" class="empty-state">
        <h2>暂无照片</h2>
        <p>这个相册还是空的。</p>
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
      <div v-if="lightboxIndex >= 0 && currentImage" class="lightbox-overlay" @click.self="closeLightbox">
        <button class="lightbox-close" type="button" aria-label="关闭" @click="closeLightbox">
          <X :size="22" />
        </button>
        <button class="lightbox-nav lightbox-prev" type="button" aria-label="上一张" @click="prevImage">
          <ChevronLeft :size="26" />
        </button>
        <img :src="currentImage.src" :alt="currentImage.caption || ''" />
        <button class="lightbox-nav lightbox-next" type="button" aria-label="下一张" @click="nextImage">
          <ChevronRight :size="26" />
        </button>
        <p v-if="currentImage.caption" style="color: rgba(255,255,255,0.7); text-align: center; margin-top: 12px; position: absolute; bottom: 28px;">
          {{ currentImage.caption }}
        </p>
      </div>
    </Teleport>
  </main>
</template>
