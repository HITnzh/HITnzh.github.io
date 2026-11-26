<script setup>
import { ArrowRight, ArrowUpRight, Github, Mail } from 'lucide-vue-next'

defineProps({ research: Boolean, garden: Boolean })

const footerLinks = [
  { label: '文章', title: '文章与笔记', to: '/posts' },
  { label: '安利', title: '作品推荐', to: '/recommendations' },
  { label: '碎笔', title: '日常碎笔', to: '/fragments' },
  { label: '相册', title: '个人相册', to: '/gallery' },
  { label: '归档', title: '文章归档', to: '/archive' },
  { label: '项目', title: '项目记录', to: '/projects' },
  { label: '关于', title: '关于我', to: '/about' },
]

const directoryLinks = [{ title: '博客首页', to: '/garden' }, ...footerLinks]
</script>

<template>
  <footer v-if="research" id="directory" class="research-directory">
    <div class="directory-inner">
      <div class="directory-heading">
        <h2 id="directory-title">站点索引</h2>
        <a href="https://github.com/HITnzh" target="_blank" rel="noreferrer">GitHub <ArrowUpRight :size="14" aria-hidden="true" /></a>
      </div>
      <nav aria-labelledby="directory-title">
        <RouterLink class="directory-paper" to="/posts/signal-notes">
          <span>研究笔记</span>
          <strong>低旁瓣非连续谱信号的一点学习笔记</strong>
          <ArrowRight :size="14" aria-hidden="true" />
        </RouterLink>
        <RouterLink v-for="link in directoryLinks" :key="link.to" :to="link.to">
          {{ link.title }} <ArrowRight :size="14" aria-hidden="true" />
        </RouterLink>
      </nav>
      <small>© {{ new Date().getFullYear() }} HITnzh</small>
    </div>
  </footer>
  <footer v-else-if="garden" class="journal-footer">
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
.research-directory {
  border-top: 1px solid var(--shell-line);
  background: #f1f3ef;
  color: #202b35;
}

.directory-inner {
  width: var(--shell-width);
  margin-inline: auto;
  padding-block: clamp(32px, 4vw, 52px) 24px;
}

.directory-heading,
.directory-heading a,
.research-directory nav a {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.directory-heading h2 {
  margin: 0;
  font: 600 clamp(20px, 2.2vw, 26px)/1.35 var(--font-display);
  letter-spacing: .03em;
}

.directory-heading a {
  gap: 4px;
  color: var(--shell-ink);
  font-size: 13px;
}

.research-directory nav {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: clamp(20px, 3.2vw, 46px);
  margin-block: 18px 24px;
}

.research-directory nav a {
  gap: 8px;
  min-height: 47px;
  border-bottom: 1px solid var(--shell-line);
  color: #334749;
  font-size: 14px;
}

.research-directory nav svg {
  color: #73847f;
}

.research-directory .directory-paper {
  grid-column: 1 / -1;
  justify-content: flex-start;
  gap: 12px;
  padding-block: 10px;
}

.directory-paper span {
  flex: none;
  color: var(--shell-muted);
  font-size: 12px;
}

.directory-paper strong {
  font-weight: 550;
}

.directory-paper svg {
  flex: none;
  margin-left: auto;
}

.research-directory a:hover {
  color: var(--shell-ink);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.research-directory a:focus-visible {
  outline: 2px solid var(--shell-ink);
  outline-offset: 3px;
}

.research-directory small {
  color: var(--shell-muted);
  font-size: 12px;
}

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
  .research-directory nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .journal-footer-inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    padding: 24px 34px 26px 0;
  }
}
</style>
