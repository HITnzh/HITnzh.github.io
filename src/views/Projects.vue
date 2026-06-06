<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { projects } from '../data/projects'
</script>

<template>
  <main class="page-shell">
    <section class="page-hero compact-hero">
      <p class="eyebrow">Projects</p>
      <h1>项目</h1>
      <p>把正在做、已经完成、值得复盘的东西放在这里。</p>
    </section>

    <section class="section-wrap project-grid">
      <article v-for="project in projects" :key="project.name" class="project-card">
        <div>
          <span>{{ project.status }}</span>
          <h2>{{ project.name }}</h2>
          <p>{{ project.description }}</p>
        </div>
        <div class="stack-list">
          <span v-for="item in project.stack" :key="item">{{ item }}</span>
        </div>
        <a :href="project.link" target="_blank" rel="noreferrer">
          查看 <ArrowUpRight :size="16" />
        </a>
      </article>
    </section>
  </main>
</template>
