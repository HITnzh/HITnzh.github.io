<script setup>
import { ArrowRight, ArrowUpRight, BookOpen, Feather, Folder, Library, NotebookPen, Shapes } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { getProjects, getPublishedPosts } from '../services/contentService'

const posts = ref([])
const projects = ref([])

const essayPosts = computed(() => posts.value.filter((post) => post.featured).slice(0, 4))
const notePosts = computed(() => posts.value.filter((post) => ['研究', '生活', '前端'].includes(post.category)).slice(0, 5))
const patternPosts = computed(() => posts.value.filter((post) => ['技术', '工程', '项目'].includes(post.category)).slice(0, 4))
const latestPosts = computed(() => posts.value.slice(0, 4))

const gardenStats = computed(() => [
  { label: 'Essays', value: posts.value.length, text: '文章和长笔记' },
  { label: 'Projects', value: projects.value.length, text: '正在整理的实践' },
  { label: 'Notes', value: notePosts.value.length, text: '研究和日常记录' },
])

onMounted(async () => {
  const [postData, projectData] = await Promise.all([getPublishedPosts(), getProjects()])
  posts.value = postData
  projects.value = projectData
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
        <RouterLink v-for="item in gardenStats" :key="item.label" to="/posts">
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

      <section class="garden-block patterns-section">
        <RouterLink class="section-header-link" to="/posts?category=技术">
          <h2><Shapes :size="21" /> Patterns <ArrowRight :size="18" /></h2>
        </RouterLink>
        <p class="subheader">Reusable choices, checklists, and engineering habits I want to remember.</p>
        <div class="pattern-list">
          <RouterLink v-for="post in patternPosts" :key="post.slug" :to="`/posts/${post.slug}`" class="pattern-row">
            <span>{{ post.category }}</span>
            <strong>{{ post.title }}</strong>
          </RouterLink>
        </div>
      </section>

      <section class="garden-block library-section">
        <RouterLink class="section-header-link" to="/projects">
          <h2><Library :size="21" /> Library <ArrowRight :size="18" /></h2>
        </RouterLink>
        <p class="subheader">Projects, references, and things I keep returning to while building this site.</p>
        <div class="library-grid">
          <a v-for="project in projects.slice(0, 4)" :key="project.name" :href="project.link" class="library-tile">
            <span>{{ project.status }}</span>
            <strong>{{ project.name }}</strong>
            <p>{{ project.description }}</p>
            <em>{{ project.stack.join(' · ') }}</em>
          </a>
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
