<script setup>
import { computed, onMounted, ref } from 'vue'
import { getPublishedPosts } from '../services/contentService'

const posts = ref([])
const loading = ref(true)

const groups = computed(() => {
  return posts.value.reduce((result, post) => {
    const year = post.date.slice(0, 4)
    if (!result[year]) result[year] = []
    result[year].push(post)
    return result
  }, {})
})

onMounted(async () => {
  posts.value = await getPublishedPosts()
  loading.value = false
})
</script>

<template>
  <main class="page-shell">
    <section class="page-hero compact-hero">
      <p class="eyebrow">Archive</p>
      <h1>归档</h1>
      <p>按时间把内容慢慢排成一条线。</p>
    </section>

    <section v-if="loading" class="section-wrap">
      <div class="empty-state">
        <h2>正在加载归档</h2>
        <p>稍等一下，内容正在回来。</p>
      </div>
    </section>

    <section v-else class="section-wrap archive-list">
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
