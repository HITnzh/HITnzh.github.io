<script setup>
import { Calendar, Clock3, Sparkles } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { moments } from '../data/moments'

const items = ref(moments)
const activeYear = ref('all')
const visibleIds = ref(new Set())

const years = computed(() => {
  const ys = [...new Set(items.value.map((i) => i.date.slice(0, 4)))]
  return ys.sort((a, b) => b.localeCompare(a))
})

const filteredItems = computed(() => {
  if (activeYear.value === 'all') return items.value
  return items.value.filter((i) => i.date.startsWith(activeYear.value))
})

const featuredQuote = computed(() => {
  const withImages = items.value.filter((i) => i.text.length > 30 && i.text.length < 120)
  if (withImages.length === 0) return items.value[0]
  return withImages[Math.floor(Math.random() * Math.min(withImages.length, 20))]
})

// Scroll-reveal via IntersectionObserver
let observer = null

function reveal(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      visibleIds.value.add(entry.target.dataset.momentId)
    }
  }
}

onMounted(() => {
  observer = new IntersectionObserver(reveal, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  for (const el of document.querySelectorAll('[data-moment-id]')) {
    observer.observe(el)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

function monthDay(dateStr) {
  const parts = dateStr.slice(5).split('-')
  return parts[0] + '.' + parts[1]
}

function formatTime(timeStr) {
  return timeStr.slice(0, 5)
}
</script>

<template>
  <main class="page-shell">
    <!-- Hero -->
    <section class="moments-hero">
      <div class="moments-hero-inner">
        <p class="eyebrow">Moments</p>
        <h1>说说</h1>
        <p class="moments-hero-desc">
          从QQ空间迁移的零散文字，时间跨度从2023年至今。它们是深夜叹息、回忆切片、心动残影。
        </p>
        <div class="moments-hero-quote" v-if="featuredQuote">
          <span class="quote-mark">&ldquo;</span>
          <p>{{ featuredQuote.text }}</p>
          <time>{{ featuredQuote.date }}</time>
        </div>
      </div>
    </section>

    <!-- Year filter -->
    <section class="section-wrap">
      <div class="moments-filter">
        <button
          v-for="y in ['all', ...years]"
          :key="y"
          :class="{ active: activeYear === y }"
          @click="activeYear = y"
        >
          {{ y === 'all' ? '全部' : y }}
        </button>
      </div>

      <div class="moments-count">{{ filteredItems.length }} 条记录</div>

      <!-- Timeline -->
      <div class="timeline">
        <div class="timeline-line" aria-hidden="true"></div>

        <article
          v-for="(item, idx) in filteredItems"
          :key="item.id"
          :data-moment-id="String(item.id)"
          :class="[
            'timeline-item',
            { 'is-visible': visibleIds.has(String(item.id)) },
            idx % 2 === 0 ? 'tl-left' : 'tl-right',
          ]"
        >
          <div class="tl-dot" aria-hidden="true">
            <Sparkles v-if="item.images.length" :size="10" />
          </div>

          <div class="tl-card">
            <div class="tl-card-head">
              <time :datetime="item.dateTime">
                <Calendar :size="13" />
                {{ monthDay(item.date) }}
                <span class="tl-time"><Clock3 :size="11" />{{ formatTime(item.time) }}</span>
              </time>
            </div>

            <p class="tl-text">{{ item.text }}</p>

            <div v-if="item.images.length" class="tl-images">
              <img
                v-for="(img, i) in item.images.slice(0, 3)"
                :key="i"
                :src="img.src"
                :alt="img.alt"
                loading="lazy"
              />
            </div>

            <div v-if="item.comments && item.comments.length" class="tl-comments">
              <div v-for="(c, ci) in item.comments" :key="ci" class="tl-comment">
                <strong>{{ c.author }}</strong>
                <time>{{ c.time }}</time>
                <p>{{ c.text }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-state">
        <h2>没有匹配的记录</h2>
        <p>换个年份试试。</p>
      </div>
    </section>
  </main>
</template>
