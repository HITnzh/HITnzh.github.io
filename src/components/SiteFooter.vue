<script setup>
import { Github, Mail, Rss } from 'lucide-vue-next'
</script>

<template>
  <footer class="site-footer">
    <div>
      <strong>HITnzh Blog</strong>
      <p>把学习、项目和生活里值得留下的东西写清楚。</p>
    </div>
    <div class="footer-links">
      <a href="https://github.com/HITnzh" target="_blank" rel="noreferrer" aria-label="GitHub">
        <Github :size="18" />
      </a>
      <a href="mailto:hello@example.com" aria-label="邮箱">
        <Mail :size="18" />
      </a>
      <RouterLink to="/posts" aria-label="文章">
        <Rss :size="18" />
      </RouterLink>
    </div>
  </footer>
</template>
