<script setup>
import { ArrowUpRight, BookOpen, Folder, Library, MapPinned, PenLine, Sprout } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import PostCard from '../components/PostCard.vue'
import { getProjects, getPublishedPosts } from '../services/contentService'

const posts = ref([])
const projects = ref([])

const featuredPosts = computed(() => posts.value.filter((post) => post.featured).slice(0, 3))
const latestPosts = computed(() => posts.value.slice(0, 5))
const topicCards = computed(() => [
  { name: '技术', label: 'Essays', description: '前端、工程化、部署和工具链', count: posts.value.filter((post) => ['技术', '前端', '工程'].includes(post.category)).length },
  { name: '研究', label: 'Notes', description: '信号处理、实验记录和论文笔记', count: posts.value.filter((post) => post.category === '研究').length },
  { name: '项目', label: 'Projects', description: '作品复盘、设计取舍和迭代记录', count: posts.value.filter((post) => post.category === '项目').length },
  { name: '生活', label: 'Smidgeons', description: '阅读、日常和一些安静的瞬间', count: posts.value.filter((post) => post.category === '生活').length },
])

const gardenDoors = computed(() => [
  { title: '文章', text: `${posts.value.length} 篇长文、教程和复盘`, to: '/posts', icon: BookOpen },
  { title: '归档', text: '按时间回看内容如何长出来', to: '/archive', icon: Library },
  { title: '项目', text: `${projects.value.length} 个正在整理的实践`, to: '/projects', icon: Folder },
])

onMounted(async () => {
  const [postData, projectData] = await Promise.all([getPublishedPosts(), getProjects()])
  posts.value = postData
  projects.value = projectData
})
</script>

<template>
  <main class="garden-home">
    <section class="garden-hero">
      <div class="garden-hero-copy">
        <p class="eyebrow">HITnzh's Garden</p>
        <h1>
          <span>把技术、研究、项目</span><span>和生活慢慢写成</span><span>一座可以回访的花园。</span>
        </h1>
        <p>
          <span>这里不是一次性写完的作品集，</span><span>而是一个持续生长的个人知识库。</span><span>文章会被修订，笔记会被串起来，</span><span>项目也会留下当时为什么这么做。</span>
        </p>
      </div>
      <figure class="garden-portrait">
        <img src="/images/cover-notes.jpg" alt="桌面上的笔记与光影" />
        <figcaption>
          <span>Now tending</span>
          Vue、Supabase、信号处理笔记，以及这个博客自己的形状。
        </figcaption>
      </figure>
    </section>

    <section class="section-wrap doorway-grid" aria-label="站点入口">
      <RouterLink v-for="door in gardenDoors" :key="door.title" :to="door.to" class="doorway-card">
        <component :is="door.icon" :size="22" />
        <strong>{{ door.title }}</strong>
        <span>{{ door.text }}</span>
        <ArrowUpRight :size="17" />
      </RouterLink>
    </section>

    <section class="section-wrap garden-index">
      <div class="section-heading">
        <span><MapPinned :size="18" /> Garden Index</span>
        <h2>内容不是按栏目关起来，而是按问题慢慢长成几条路径。</h2>
      </div>
      <div class="topic-grid">
        <RouterLink v-for="topic in topicCards" :key="topic.name" class="topic-card" :to="`/posts?category=${topic.name}`">
          <span>{{ topic.label }}</span>
          <strong>{{ topic.name }}</strong>
          <p>{{ topic.description }}</p>
          <em>{{ topic.count }} 篇</em>
        </RouterLink>
      </div>
    </section>

    <section class="section-wrap">
      <div class="section-heading">
        <span><Sprout :size="18" /> Featured</span>
        <h2>适合先读的几篇。</h2>
      </div>
      <div class="featured-grid">
        <PostCard v-for="post in featuredPosts" :key="post.slug" :post="post" />
      </div>
    </section>

    <section class="section-band">
      <div class="section-wrap split-list">
        <div class="essay-feed">
          <div class="section-heading">
            <span><PenLine :size="18" /> Recently</span>
            <h2>最近写下的东西。</h2>
          </div>
          <div class="latest-list">
            <PostCard v-for="post in latestPosts" :key="post.slug" :post="post" compact />
          </div>
        </div>
        <aside class="note-panel garden-now">
          <p class="eyebrow">Now</p>
          <h2>先把写作系统做成会呼吸的地方。</h2>
          <p>
            前台用 Vue 保持轻盈，后端用 Supabase 管理文章、登录和图片。它应该像笔记本一样容易打开，又像作品集一样经得起回看。
          </p>
          <RouterLink class="inline-link" to="/about">看看这个站想变成什么 <ArrowUpRight :size="16" /></RouterLink>
        </aside>
      </div>
    </section>

    <section class="section-wrap project-ledger">
      <div>
        <div class="section-heading">
          <span>Projects</span>
          <h2>项目近况。</h2>
        </div>
        <div class="project-strip">
          <a v-for="project in projects.slice(0, 3)" :key="project.name" :href="project.link" class="project-row">
            <span>{{ project.status }}</span>
            <strong>{{ project.name }}</strong>
            <ArrowUpRight :size="17" />
          </a>
        </div>
      </div>
    </section>
  </main>
</template>
