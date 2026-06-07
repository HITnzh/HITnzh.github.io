<script setup>
import { Heart, Search } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { getPublishedRecommendations } from '../services/contentService'

const recommendations = ref([])
const loading = ref(true)
const searchText = ref('')
const selectedType = ref('全部')

const types = computed(() => [
  '全部',
  ...Array.from(new Set(recommendations.value.map((item) => item.type).filter(Boolean))),
])

const filteredRecommendations = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  return recommendations.value.filter((item) => {
    const typeMatch = selectedType.value === '全部' || item.type === selectedType.value
    const searchMatch =
      !q ||
      [item.title, item.creator, item.note, item.type, ...item.tags].some((value) =>
        String(value || '').toLowerCase().includes(q),
      )
    return typeMatch && searchMatch
  })
})

onMounted(async () => {
  recommendations.value = await getPublishedRecommendations()
  loading.value = false
})
</script>

<template>
  <main class="page-shell">
    <section class="page-hero compact-hero">
      <p class="eyebrow">Recommendations</p>
      <h1>安利区。</h1>
      <p>番剧、书籍、专辑和一些值得反复回来的东西。这里会慢慢变成一面小小的私人书架。</p>
    </section>

    <section class="section-wrap">
      <div class="filter-bar">
        <form class="post-search" role="search" @submit.prevent>
          <Search :size="18" />
          <input v-model="searchText" type="search" placeholder="搜索标题、作者、标签" aria-label="搜索安利" />
        </form>
        <div class="category-tabs" aria-label="安利类型">
          <button
            v-for="type in types"
            :key="type"
            type="button"
            :class="{ active: selectedType === type }"
            @click="selectedType = type"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="empty-state">
        <h2>正在加载安利</h2>
        <p>稍等一下。</p>
      </div>
      <div v-else-if="filteredRecommendations.length" class="recommend-index-grid">
        <RouterLink
          v-for="item in filteredRecommendations"
          :key="item.id"
          class="recommend-card"
          :to="`/recommendations/${item.slug}`"
        >
          <div class="recommend-cover" :class="[{ 'has-image': item.cover }, `tone-${item.tone}`]">
            <span class="recommend-badge">{{ item.type }}</span>
            <img v-if="item.cover" :src="item.cover" :alt="`${item.title} 封面`" loading="lazy" />
            <template v-else>
              <strong>{{ item.title }}</strong>
              <em>{{ item.creator }}</em>
            </template>
          </div>
          <strong>{{ item.title }}</strong>
          <em>{{ item.creator }}</em>
          <p>{{ item.note }}</p>
        </RouterLink>
      </div>
      <div v-else class="empty-state">
        <Heart :size="24" />
        <h2>没有找到匹配的安利</h2>
        <p>换个关键词或类型试试。</p>
      </div>
    </section>
  </main>
</template>
