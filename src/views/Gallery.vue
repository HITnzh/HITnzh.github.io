<script setup>
import { albums } from '../data/gallery'
</script>

<template>
  <main class="page-shell">
    <section class="page-hero">
      <p class="eyebrow">Gallery</p>
      <h1>相册。</h1>
      <p>图片分享区，按主题整理。来自QQ空间说说里的配图和随手拍，让那些视觉记忆不至于消失在时间线里。</p>
    </section>

    <section class="section-wrap">
      <div v-if="albums.length" class="gallery-grid">
        <RouterLink
          v-for="album in albums"
          :key="album.id"
          :to="`/gallery/${album.id}`"
          class="gallery-album-card"
        >
          <div class="gallery-album-cover">
            <img :src="album.cover" :alt="album.title" loading="lazy" />
          </div>
          <div class="gallery-album-info">
            <h3>{{ album.title }}</h3>
            <p>{{ album.description }}</p>
            <span class="gallery-album-count">{{ album.images.length }} 张照片</span>
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
