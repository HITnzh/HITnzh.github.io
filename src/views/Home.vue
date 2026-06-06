<script setup>
import { ArrowUpRight, BookOpen, Folder, Sparkles } from 'lucide-vue-next'
import PostCard from '../components/PostCard.vue'
import { posts } from '../data/posts'
import { projects } from '../data/projects'

const featuredPosts = posts.filter((post) => post.featured).slice(0, 3)
const latestPosts = posts.slice(0, 4)
const topicCards = [
  { name: '技术', description: '前端、工程化、部署和工具链', count: posts.filter((post) => ['技术', '前端', '工程'].includes(post.category)).length },
  { name: '研究', description: '信号处理、实验记录和论文笔记', count: posts.filter((post) => post.category === '研究').length },
  { name: '项目', description: '作品复盘、设计取舍和迭代记录', count: posts.filter((post) => post.category === '项目').length },
  { name: '生活', description: '阅读、日常和一些安静的瞬间', count: posts.filter((post) => post.category === '生活').length },
]
</script>

<template>
  <main>
    <section class="hero-section">
      <img src="/images/hero-mountain.jpg" alt="雪山日落" />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <p class="eyebrow">Personal blog · notes · projects</p>
        <h1>HITnzh Blog</h1>
        <p class="hero-copy">
          记录技术、研究、项目和生活。把复杂的东西写清楚，把值得回头看的东西留下来。
        </p>
        <div class="hero-actions">
          <RouterLink class="primary-action" to="/posts">
            <BookOpen :size="18" /> 阅读文章
          </RouterLink>
          <RouterLink class="secondary-action" to="/projects">
            <Folder :size="18" /> 查看项目
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section-wrap">
      <div class="section-heading">
        <span><Sparkles :size="18" /> Featured</span>
        <h2>精选文章</h2>
      </div>
      <div class="featured-grid">
        <PostCard v-for="post in featuredPosts" :key="post.slug" :post="post" />
      </div>
    </section>

    <section class="section-band">
      <div class="section-wrap two-column">
        <div>
          <div class="section-heading">
            <span>Topics</span>
            <h2>写作主题</h2>
          </div>
          <div class="topic-grid">
            <RouterLink v-for="topic in topicCards" :key="topic.name" class="topic-card" :to="`/posts?category=${topic.name}`">
              <strong>{{ topic.name }}</strong>
              <p>{{ topic.description }}</p>
              <span>{{ topic.count }} 篇</span>
            </RouterLink>
          </div>
        </div>
        <aside class="note-panel">
          <p class="eyebrow">Now</p>
          <h2>先把博客做成漂亮、稳定、可部署的静态站。</h2>
          <p>
            后续如果接外部后端，文章数据、分类、标签和图片资源都可以迁移，不需要重做整个前台。
          </p>
        </aside>
      </div>
    </section>

    <section class="section-wrap split-list">
      <div>
        <div class="section-heading">
          <span>Latest</span>
          <h2>最近更新</h2>
        </div>
        <div class="latest-list">
          <PostCard v-for="post in latestPosts" :key="post.slug" :post="post" compact />
        </div>
      </div>
      <div>
        <div class="section-heading">
          <span>Projects</span>
          <h2>项目近况</h2>
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
