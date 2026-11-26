<script setup>
import { ArrowUpRight, Github, Mail } from 'lucide-vue-next'

defineProps({ home: Boolean })

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
  <footer v-if="home" class="journal-footer">
    <div class="journal-footer-inner">
      <div class="journal-signature">
        <RouterLink to="/" aria-label="HITnzh 首页">HITnzh</RouterLink>
        <span>© {{ new Date().getFullYear() }}</span>
      </div>
      <nav aria-label="页脚导航">
        <RouterLink v-for="link in footerLinks" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
        <a class="journal-github" href="https://github.com/HITnzh" target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight :size="13" aria-hidden="true" />
        </a>
      </nav>
    </div>
  </footer>
  <footer v-else class="site-footer">
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

<style scoped>
.journal-footer {
  border-top: 1px solid #d8ded3;
  background: #f1f3eb;
  color: #526255;
}

.journal-footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 32px;
  width: var(--journal-width);
  margin-inline: auto;
  padding-block: 25px;
}

.journal-signature,
.journal-footer nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.journal-signature {
  gap: 14px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.journal-signature a {
  color: #294e40;
  font: 600 23px/1 Georgia, 'Times New Roman', serif;
  letter-spacing: -1px;
}

.journal-footer nav {
  gap: 2px clamp(15px, 1.55vw, 25px);
  font-size: 13px;
}

.journal-footer nav a {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  min-height: 38px;
}

.journal-footer a:hover {
  color: #294e40;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.journal-footer a:focus-visible {
  outline: 2px solid #476c58;
  outline-offset: 3px;
}

.journal-github {
  color: #294e40;
  font-weight: 600;
}

@media (max-width: 640px) {
  .journal-footer-inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    padding: 24px 34px 26px 0;
  }
}
</style>
