<script setup>
import { computed } from 'vue'
import { posts } from '../data/posts'

const groups = computed(() => {
  return posts.reduce((result, post) => {
    const year = post.date.slice(0, 4)
    if (!result[year]) result[year] = []
    result[year].push(post)
    return result
  }, {})
})
</script>

<template>
  <main class="page-shell">
    <section class="page-hero compact-hero">
      <p class="eyebrow">Archive</p>
      <h1>归档</h1>
      <p>按时间把内容慢慢排成一条线。</p>
    </section>

    <section class="section-wrap archive-list">
      <div v-for="(items, year) in groups" :key="year" class="archive-year">
        <h2>{{ year }}</h2>
        <div class="archive-items">
          <RouterLink v-for="post in items" :key="post.slug" :to="`/posts/${post.slug}`">
            <time>{{ post.date.slice(5) }}</time>
            <strong>{{ post.title }}</strong>
            <span>{{ post.category }}</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
