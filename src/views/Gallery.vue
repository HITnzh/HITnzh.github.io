<script setup>
import { ArrowRight, ImageIcon } from 'lucide-vue-next'
import { albums } from '../data/gallery'

const totalPhotos = albums.reduce((sum, a) => sum + a.images.length, 0)
</script>

<template>
  <main class="page-shell">
    <section class="gallery-hero">
      <p class="eyebrow">Gallery</p>
      <h1>相册</h1>
      <p>图片分享区，按主题整理。来自QQ空间说说里的配图和随手拍，让视觉记忆不至于消失在时间线里。</p>
      <span class="gallery-stat">{{ albums.length }} 个相册 · {{ totalPhotos }} 张照片</span>
    </section>

    <section class="section-wrap">
      <div v-if="albums.length" class="gallery-grid-v2">
        <RouterLink
          v-for="album in albums"
          :key="album.id"
          :to="`/gallery/${album.id}`"
          class="gallery-card-v2"
        >
          <div class="gallery-card-visual">
            <img :src="album.cover" :alt="album.title" loading="lazy" />
            <div class="gallery-card-overlay">
              <span class="gallery-card-action">
                浏览相册
                <ArrowRight :size="16" />
              </span>
            </div>
          </div>
          <div class="gallery-card-body">
            <h3>{{ album.title }}</h3>
            <p>{{ album.description }}</p>
            <span class="gallery-card-count">
              <ImageIcon :size="14" />
              {{ album.images.length }} 张
            </span>
          </div>
        </RouterLink>
      </div>

      <div v-else class="empty-state">
        <h2>还没有相册</h2>
        <p>相册正在整理中。</p>
      </div>
    </section>
  </main>
</template>
