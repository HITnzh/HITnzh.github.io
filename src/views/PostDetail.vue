<script setup>
import { CalendarDays, Clock3, Tag } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { posts } from '../data/posts'

const route = useRoute()
const post = computed(() => posts.find((item) => item.slug === route.params.slug))
const postIndex = computed(() => posts.findIndex((item) => item.slug === route.params.slug))
const previousPost = computed(() => (postIndex.value > 0 ? posts[postIndex.value - 1] : null))
const nextPost = computed(() => (postIndex.value >= 0 && postIndex.value < posts.length - 1 ? posts[postIndex.value + 1] : null))
const toc = computed(() => post.value?.content.filter((block) => block.heading).map((block) => block.heading) ?? [])
</script>

<template>
  <main v-if="post" class="article-page">
    <article>
      <header class="article-header">
        <img :src="post.cover" :alt="post.title" />
        <div class="article-title">
          <RouterLink class="category-chip" :to="`/posts?category=${post.category}`">
            {{ post.category }}
          </RouterLink>
          <h1>{{ post.title }}</h1>
          <p>{{ post.excerpt }}</p>
          <div class="post-meta">
            <span><CalendarDays :size="16" />{{ post.date }}</span>
            <span><Clock3 :size="16" />{{ post.readTime }}</span>
          </div>
        </div>
      </header>

      <div class="article-layout">
        <aside class="toc-panel">
          <strong>目录</strong>
          <a v-for="item in toc" :key="item" :href="`#${item}`">{{ item }}</a>
        </aside>

        <div class="article-body">
          <section v-for="block in post.content" :key="block.heading" :id="block.heading">
            <h2>{{ block.heading }}</h2>
            <p v-for="paragraph in block.paragraphs" :key="paragraph">{{ paragraph }}</p>
            <pre v-if="block.code"><code>{{ block.code }}</code></pre>
          </section>

          <div class="tag-list">
            <span v-for="tag in post.tags" :key="tag"><Tag :size="14" />{{ tag }}</span>
          </div>

          <nav class="article-nav" aria-label="文章导航">
            <RouterLink v-if="previousPost" :to="`/posts/${previousPost.slug}`">
              <span>上一篇</span>
              <strong>{{ previousPost.title }}</strong>
            </RouterLink>
            <RouterLink v-if="nextPost" :to="`/posts/${nextPost.slug}`">
              <span>下一篇</span>
              <strong>{{ nextPost.title }}</strong>
            </RouterLink>
          </nav>
        </div>
      </div>
    </article>
  </main>

  <main v-else class="page-shell">
    <section class="empty-state">
      <h1>文章不存在</h1>
      <p>可能是链接写错了，或者这篇文章还没发布。</p>
      <RouterLink class="primary-action" to="/posts">返回文章列表</RouterLink>
    </section>
  </main>
</template>
