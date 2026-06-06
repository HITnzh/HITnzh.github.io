<script setup>
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-vue-next'

defineProps({
  post: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <article class="post-card" :class="{ compact }">
    <RouterLink class="post-cover" :to="`/posts/${post.slug}`" :aria-label="post.title">
      <img :src="post.cover" :alt="post.title" loading="lazy" />
    </RouterLink>
    <div class="post-card-body">
      <div class="post-meta">
        <span><CalendarDays :size="15" />{{ post.date }}</span>
        <span><Clock3 :size="15" />{{ post.readTime }}</span>
      </div>
      <RouterLink class="post-title-link" :to="`/posts/${post.slug}`">
        <h3>{{ post.title }}</h3>
      </RouterLink>
      <p>{{ post.excerpt }}</p>
      <div class="post-card-bottom">
        <span class="category-chip">{{ post.category }}</span>
        <RouterLink class="read-link" :to="`/posts/${post.slug}`" :aria-label="`阅读 ${post.title}`">
          进入 <ArrowUpRight :size="16" />
        </RouterLink>
      </div>
    </div>
  </article>
</template>
