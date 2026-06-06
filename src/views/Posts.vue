<script setup>
import { Search } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import { categories, posts } from '../data/posts'

const route = useRoute()
const router = useRouter()
const selectedCategory = ref('全部')
const searchText = ref('')

watch(
  () => route.query,
  (query) => {
    searchText.value = typeof query.q === 'string' ? query.q : ''
    selectedCategory.value = typeof query.category === 'string' ? query.category : '全部'
  },
  { immediate: true },
)

const filteredPosts = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  return posts.filter((post) => {
    const categoryMatch = selectedCategory.value === '全部' || post.category === selectedCategory.value
    const searchMatch =
      !q ||
      [post.title, post.excerpt, post.category, ...post.tags].some((item) => item.toLowerCase().includes(q))
    return categoryMatch && searchMatch
  })
})

function selectCategory(category) {
  selectedCategory.value = category
  router.replace({
    path: '/posts',
    query: {
      ...(searchText.value.trim() ? { q: searchText.value.trim() } : {}),
      ...(category !== '全部' ? { category } : {}),
    },
  })
}

function submitSearch() {
  router.replace({
    path: '/posts',
    query: {
      ...(searchText.value.trim() ? { q: searchText.value.trim() } : {}),
      ...(selectedCategory.value !== '全部' ? { category: selectedCategory.value } : {}),
    },
  })
}
</script>

<template>
  <main class="page-shell">
    <section class="page-hero compact-hero">
      <p class="eyebrow">Articles</p>
      <h1>文章</h1>
      <p>技术、研究、项目和生活的长期记录。</p>
    </section>

    <section class="section-wrap">
      <div class="filter-bar">
        <form class="post-search" role="search" @submit.prevent="submitSearch">
          <Search :size="18" />
          <input v-model="searchText" type="search" placeholder="搜索标题、摘要或标签" aria-label="搜索文章" />
        </form>
        <div class="category-tabs" aria-label="文章分类">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="{ active: selectedCategory === category }"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div v-if="filteredPosts.length" class="post-grid">
        <PostCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
      </div>
      <div v-else class="empty-state">
        <h2>没有找到匹配的文章</h2>
        <p>换个关键词或分类试试。</p>
      </div>
    </section>
  </main>
</template>
