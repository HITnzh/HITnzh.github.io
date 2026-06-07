<script setup>
import { ArrowRight, ArrowUpRight, BookOpen, Feather, Heart, NotebookPen, Shapes } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { getPublishedPosts, getPublishedRecommendations } from '../services/contentService'

const posts = ref([])
const recommendations = ref([])

const essayPosts = computed(() => posts.value.filter((post) => post.featured).slice(0, 4))
const notePosts = computed(() => posts.value.filter((post) => ['研究', '生活', '前端'].includes(post.category)).slice(0, 5))
const columnPosts = computed(() => {
  const focusedPosts = posts.value.filter((post) => ['技术', '工程', '项目', '前端'].includes(post.category))
  return (focusedPosts.length ? focusedPosts : posts.value).slice(0, 8)
})
const latestPosts = computed(() => posts.value.slice(0, 4))

const gardenStats = computed(() => [
  { label: 'Essays', value: posts.value.length, text: '文章和长笔记', to: '/posts' },
  { label: 'Recs', value: recommendations.value.length, text: '番剧、书籍、专辑', to: '/recommendations' },
  { label: 'Notes', value: notePosts.value.length, text: '研究和日常记录', to: '/posts' },
])

onMounted(async () => {
  const [postData, recommendationData] = await Promise.all([getPublishedPosts(), getPublishedRecommendations()])
  posts.value = postData
  recommendations.value = recommendationData.slice(0, 6)
})
</script>

<template>
  <main class="garden-home">
    <section class="appleton-hero">
      <p class="eyebrow">HITnzh's digital garden</p>
      <h1>Visual notes on technology, signals, projects, and ordinary life.</h1>
      <p>
        <span>这里整理的是技术学习、研究笔记、</span>
        <span>项目复盘和一些生活片段。</span>
        <span>它会像花园一样慢慢长大：</span>
        <span>文章会被修订，想法会互相连接。</span>
      </p>
      <div class="garden-stats" aria-label="内容概览">
        <RouterLink v-for="item in gardenStats" :key="item.label" :to="item.to">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
          <em>{{ item.text }}</em>
        </RouterLink>
      </div>
    </section>

    <section class="appleton-grid" aria-label="花园索引">
      <section class="garden-block essays-section">
        <RouterLink class="section-header-link" to="/posts">
          <h2><Feather :size="21" /> Essays <ArrowRight :size="18" /></h2>
        </RouterLink>
        <p class="subheader">Longer pieces on building, learning, and making technical things readable.</p>
        <div class="essay-card-grid">
          <RouterLink v-for="post in essayPosts" :key="post.slug" class="essay-tile" :to="`/posts/${post.slug}`">
            <img :src="post.cover" :alt="post.title" loading="lazy" />
            <span>{{ post.category }} · {{ post.readTime }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
          </RouterLink>
        </div>
      </section>

      <section class="garden-block notes-section">
        <RouterLink class="section-header-link" to="/posts">
          <h2><NotebookPen :size="21" /> Notes <ArrowRight :size="18" /></h2>
        </RouterLink>
        <p class="subheader">Shorter field notes, research fragments, and ideas still under revision.</p>
        <div class="note-list">
          <RouterLink v-for="post in notePosts" :key="post.slug" :to="`/posts/${post.slug}`" class="note-row">
            <BookOpen :size="18" />
            <span>{{ post.title }}</span>
          </RouterLink>
        </div>
      </section>

      <section class="garden-block columns-section">
        <RouterLink class="section-header-link" to="/posts?category=技术">
          <h2><Shapes :size="21" /> 专栏文章 <ArrowRight :size="18" /></h2>
        </RouterLink>
        <p class="subheader">按主题沉淀下来的文章和系列笔记，偏技术、工程实践和项目复盘。</p>
        <div class="column-list">
          <RouterLink v-for="post in columnPosts" :key="post.slug" :to="`/posts/${post.slug}`" class="column-row">
            <span class="column-mark" aria-hidden="true"></span>
            <span class="column-copy">
              <em>{{ post.category }} · {{ post.readTime }}</em>
              <strong>{{ post.title }}</strong>
              <small>{{ post.excerpt }}</small>
            </span>
          </RouterLink>
        </div>
      </section>

      <section class="garden-block recommend-section">
        <RouterLink class="section-header-link" to="/recommendations">
          <h2><Heart :size="21" /> 安利区 <ArrowRight :size="18" /></h2>
        </RouterLink>
        <p class="subheader">一些私心推荐：番剧、书籍、专辑，以及那些值得反复回来的东西。</p>
        <div class="recommend-grid">
          <RouterLink
            v-for="item in recommendations"
            :key="`${item.type}-${item.title}`"
            class="recommend-card"
            :to="`/recommendations/${item.slug}`"
          >
            <div class="recommend-cover" :class="[{ 'has-image': item.cover }, `tone-${item.tone}`]">
              <span class="recommend-badge">{{ item.type }}</span>
              <img
                v-if="item.cover"
                :src="item.cover"
                :alt="`${item.title} 封面`"
                loading="lazy"
              />
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
      </section>
    </section>

    <section class="now-ledger">
      <div>
        <p class="eyebrow">Now</p>
        <h2>正在把博客从“展示页面”改成真正能长期写作的系统。</h2>
        <p>前台负责阅读体验，Supabase 负责文章、图片和登录。接下来会继续补 Markdown 编辑、标签和项目管理。</p>
      </div>
      <div class="recent-links">
        <RouterLink v-for="post in latestPosts" :key="post.slug" :to="`/posts/${post.slug}`">
          <span>{{ post.date }}</span>
          <strong>{{ post.title }}</strong>
          <ArrowUpRight :size="16" />
        </RouterLink>
      </div>
    </section>
  </main>
</template>
