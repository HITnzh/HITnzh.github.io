<script setup>
import { ArrowRight, ArrowUpRight, BookOpen, BookOpenText, Clapperboard, Disc3, Feather, Library, PenLine } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import GardenCover from '../components/GardenCover.vue'
import { moments } from '../data/moments'
import { getPublishedPosts, getPublishedRecommendations } from '../services/contentService'

const posts = ref([])
const recommendations = ref([])
const loading = ref(true)
const activeView = ref('精选')
const views = ['精选', '最新', '研究与日常', '技术专栏']
const recentMoments = [...moments].sort((a, b) => b.dateTime.localeCompare(a.dateTime)).slice(0, 4)
const momentIndex = ref(0)
const currentMoment = computed(() => recentMoments[momentIndex.value])
const shelfIcons = { 番剧: Clapperboard, 书籍: BookOpen, 专辑: Disc3 }

const visiblePosts = computed(() => {
  const all = posts.value
  switch (activeView.value) {
    case '精选': return all.filter(post => post.featured).slice(0, 4)
    case '研究与日常': return all.filter(post => ['研究', '生活', '前端'].includes(post.category)).slice(0, 5)
    case '技术专栏': return all.filter(post => ['技术', '工程', '项目', '前端'].includes(post.category)).slice(0, 8)
    default: return all.slice(0, 4)
  }
})

onMounted(async () => {
  const [articles, picks] = await Promise.all([getPublishedPosts(), getPublishedRecommendations()])
  posts.value = articles
  recommendations.value = picks
  if (!articles.some(post => post.featured)) activeView.value = '最新'
  loading.value = false
})
</script>

<template>
  <main class="journal-home">
    <div class="journal-wrap">
      <section class="journal-hero" aria-labelledby="journal-title">
        <div class="hero-copy">
          <p class="byline" lang="en">Field notes by HITnzh</p>
          <h1 id="journal-title" lang="en">Digital <em>Garden.</em></h1>
          <p class="intro">在这里写信号处理、前端和做项目的心得，<br class="wide-break" />也收下喜欢的作品与日常的只言片语。</p>
          <div class="hero-actions">
            <RouterLink class="primary-link" to="/posts">阅读文章 <ArrowRight :size="16" /></RouterLink>
            <RouterLink class="quiet-link" to="/about">关于我 <ArrowUpRight :size="15" /></RouterLink>
          </div>
        </div>
        <GardenCover />
      </section>

      <div class="reading-desk">
        <section class="writing" aria-labelledby="writing-title">
          <header class="section-title">
            <h2 id="writing-title"><BookOpenText aria-hidden="true" />文章手记</h2>
            <RouterLink class="text-link" to="/posts">全部文章<template v-if="!loading"> · {{ posts.length }}</template> <ArrowUpRight :size="14" /></RouterLink>
          </header>
          <div class="view-switch" role="group" aria-label="选择文章栏目">
            <button v-for="view in views" :key="view" type="button" :aria-pressed="activeView === view" @click="activeView = view">{{ view }}</button>
          </div>
          <p v-if="loading" class="list-status" role="status">正在读取文章…</p>
          <div v-else-if="visiblePosts.length" class="entries">
            <article v-for="post in visiblePosts" :key="post.slug">
              <RouterLink class="entry" :to="`/posts/${post.slug}`">
                <span class="entry-art"><img :src="post.cover" alt="" loading="lazy" /></span>
                <div class="entry-copy">
                  <p class="entry-meta">
                    <span>{{ post.category }}</span><i aria-hidden="true">/</i>
                    <time :datetime="post.date">{{ post.date }}</time>
                    <template v-if="post.readTime"><i aria-hidden="true">·</i>{{ post.readTime }}</template>
                  </p>
                  <h3>{{ post.title }}</h3>
                  <p class="entry-excerpt">{{ post.excerpt }}</p>
                </div>
                <ArrowUpRight class="entry-arrow" :size="17" aria-hidden="true" />
              </RouterLink>
            </article>
          </div>
          <p v-else class="list-status">这个栏目还没有文章。</p>
        </section>

        <aside class="margin-notes" aria-label="花园札记">
          <section v-if="currentMoment" class="fragment" aria-labelledby="fragment-title">
            <header class="fragment-heading"><Feather :size="17" aria-hidden="true" /><h2 id="fragment-title">最近碎笔</h2></header>
            <span class="quote-mark" aria-hidden="true">“</span>
            <figure class="fragment-quote" aria-live="polite">
              <blockquote>{{ currentMoment.text }}</blockquote>
              <figcaption><span aria-hidden="true"></span><time :datetime="currentMoment.date">{{ currentMoment.date.replaceAll('-', '.') }}</time></figcaption>
            </figure>
            <div class="fragment-links">
              <RouterLink class="text-link" to="/fragments">全部 {{ moments.length }} 则 <ArrowUpRight :size="14" /></RouterLink>
              <button v-if="recentMoments.length > 1" class="next-fragment" type="button" @click="momentIndex = (momentIndex + 1) % recentMoments.length">换一则 <ArrowRight :size="14" /></button>
            </div>
          </section>
          <section class="now" aria-labelledby="now-title">
            <h2 id="now-title"><PenLine :size="15" />近况</h2>
            <p>最近在整理博客的写作流程，让改稿、配图和发布都更顺手。</p>
            <RouterLink class="text-link" :to="{ path: '/posts', query: { category: '技术' } }">技术文章 <ArrowUpRight :size="14" /></RouterLink>
          </section>
        </aside>
      </div>

      <section class="shelf" aria-labelledby="shelf-title">
        <header class="section-title">
          <h2 id="shelf-title"><Library aria-hidden="true" />私心推荐</h2>
          <RouterLink class="text-link" to="/recommendations">全部安利<template v-if="!loading"> · {{ recommendations.length }}</template> <ArrowUpRight :size="14" /></RouterLink>
        </header>
        <p v-if="loading" class="list-status" role="status">正在读取安利…</p>
        <div v-else-if="recommendations.length" class="shelf-grid">
          <RouterLink v-for="item in recommendations.slice(0, 6)" :key="item.slug" class="shelf-item" :to="`/recommendations/${item.slug}`">
            <span class="shelf-meta"><component :is="shelfIcons[item.type] || BookOpen" :size="15" />{{ item.type }}</span>
            <img v-if="item.cover" class="shelf-cover" :src="item.cover" alt="" loading="lazy" />
            <h3>{{ item.title }}</h3>
            <span class="creator">{{ item.creator }}</span>
            <p>{{ item.note }}</p>
          </RouterLink>
        </div>
        <p v-else class="list-status">书架上还没有公开的推荐。</p>
      </section>
    </div>
  </main>
</template>

<style scoped src="../styles/journal.css"></style>
