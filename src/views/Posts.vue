<script setup>
import { Search } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import { getCategories, getPublishedPosts } from '../services/contentService'

const route = useRoute()
const router = useRouter()
const selectedCategory = ref('全部')
const searchText = ref('')
const posts = ref([])
const categories = ref(['全部'])
const loading = ref(true)

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
  return posts.value.filter((post) => {
    const categoryMatch = selectedCategory.value === '全部' || post.category === selectedCategory.value
    const searchMatch =
      !q ||
      [post.title, post.excerpt, post.category, ...post.tags].some((item) => item.toLowerCase().includes(q))
    return categoryMatch && searchMatch
  })
})

onMounted(async () => {
  posts.value = await getPublishedPosts()
  categories.value = await getCategories(posts.value)
  loading.value = false
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
      <p class="eyebrow">The Garden</p>
      <h1>文章与笔记。</h1>
      <p>长文、教程、研究记录和一些还在生长的想法。它们会被搜索、重读、改写，也会在归档里留下时间。</p>
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

      <div v-if="loading" class="empty-state">
        <h2>正在加载文章</h2>
        <p>稍等一下，内容正在回来。</p>
      </div>
      <div v-else-if="filteredPosts.length" class="post-index-list">
        <PostCard v-for="post in filteredPosts" :key="post.slug" :post="post" compact />
      </div>
      <div v-else class="empty-state">
        <h2>没有找到匹配的文章</h2>
        <p>换个关键词或分类试试。</p>
      </div>
    </section>
  </main>
</template>
