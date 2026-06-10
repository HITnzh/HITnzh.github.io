<script setup>
import { computed, ref } from 'vue'
import { moments } from '../data/moments'

const items = ref(moments)

const groupedByYear = computed(() => {
  const map = new Map()
  for (const item of items.value) {
    const year = item.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(item)
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
})

function shareableText(item) {
  return `${item.text}\n\n— ${item.date}`
}
</script>

<template>
  <main class="page-shell">
    <section class="page-hero">
      <p class="eyebrow">Moments</p>
      <h1>说说。</h1>
      <p>从QQ空间迁移过来的零散文字，时间跨度从2023年至今。它们是某个夜晚的叹息、某段回忆的切片、某次心动的残影。</p>
    </section>

    <section class="section-wrap">
      <div v-for="[year, yearItems] in groupedByYear" :key="year" class="moment-year-group">
        <h2 class="moment-year-label">{{ year }}</h2>
        <div class="moment-list">
          <article v-for="item in yearItems" :key="item.id" class="moment-card">
            <time class="moment-time" :datetime="item.dateTime">
              <span class="moment-date">{{ item.date.slice(5) }}</span>
              <span class="moment-clock">{{ item.time.slice(0, 5) }}</span>
            </time>

            <div class="moment-body">
              <p class="moment-text">{{ item.text }}</p>

              <div v-if="item.images.length" class="moment-images">
                <img
                  v-for="(img, idx) in item.images"
                  :key="idx"
                  :src="img.src"
                  :alt="img.alt"
                  loading="lazy"
                />
              </div>

              <div v-if="item.comments && item.comments.length" class="moment-comments">
                <div v-for="(c, ci) in item.comments" :key="ci" class="moment-comment">
                  <span class="comment-author">{{ c.author }}</span>
                  <time>{{ c.time }}</time>
                  <p>{{ c.text }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-if="items.length === 0" class="empty-state">
        <h2>还没有说说</h2>
        <p>数据正在加载中。</p>
      </div>
    </section>
  </main>
</template>
