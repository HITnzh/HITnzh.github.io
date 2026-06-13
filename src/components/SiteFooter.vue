<script setup>
import { ArrowUpRight, Github, Mail } from 'lucide-vue-next'

const footerLinks = [
  { label: '文章', to: '/posts' },
  { label: '安利', to: '/recommendations' },
  { label: '碎笔', to: '/fragments' },
  { label: '相册', to: '/gallery' },
  { label: '归档', to: '/archive' },
  { label: '项目', to: '/projects' },
  { label: '关于', to: '/about' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col footer-brand">
        <RouterLink class="brand" to="/" aria-label="HITnzh 首页">
          <span class="brand-mark footer-mark">H</span>
        </RouterLink>
        <p>记录技术学习、研究笔记、项目复盘和一些生活的普通片段。像花园一样慢慢生长。</p>
      </div>

      <div class="footer-col footer-nav">
        <strong>导航</strong>
        <nav>
          <RouterLink v-for="link in footerLinks" :key="link.to" :to="link.to">
            {{ link.label }}
            <ArrowUpRight :size="12" />
          </RouterLink>
        </nav>
      </div>

      <div class="footer-col footer-connect">
        <strong>连接</strong>
        <div class="footer-social">
          <a href="https://github.com/HITnzh" target="_blank" rel="noreferrer">
            <Github :size="16" />
            GitHub
          </a>
          <a href="mailto:hello@example.com">
            <Mail :size="16" />
            Email
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <span>&copy; {{ new Date().getFullYear() }} HITnzh. Built with Vue &amp; Vite.</span>
    </div>
  </footer>
</template>
