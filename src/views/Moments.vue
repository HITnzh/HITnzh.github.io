<script setup>
import { Calendar, Clock3, Mail, MailOpen, Shuffle, Sparkles, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { moments } from '../data/moments'

const items = ref(moments)
const activeYear = ref('all')
const selectedMoment = ref(null)

const envelopeSeed = [
  ['6%', '-6s', '22s', '0.74', '12vw', '-16deg'],
  ['12%', '-14s', '26s', '1.08', '-9vw', '12deg'],
  ['18%', '-2s', '19s', '0.9', '8vw', '28deg'],
  ['24%', '-20s', '31s', '0.64', '-14vw', '-8deg'],
  ['31%', '-10s', '24s', '1.18', '10vw', '18deg'],
  ['38%', '-4s', '28s', '0.82', '-7vw', '-28deg'],
  ['44%', '-18s', '21s', '1.02', '15vw', '6deg'],
  ['51%', '-8s', '30s', '0.7', '-12vw', '-20deg'],
  ['58%', '-1s', '23s', '1.22', '9vw', '15deg'],
  ['64%', '-16s', '27s', '0.86', '-10vw', '-12deg'],
  ['70%', '-12s', '20s', '1', '13vw', '32deg'],
  ['77%', '-5s', '29s', '0.68', '-8vw', '-24deg'],
  ['83%', '-22s', '25s', '1.14', '7vw', '10deg'],
  ['90%', '-9s', '32s', '0.8', '-14vw', '-18deg'],
  ['96%', '-3s', '24s', '1.28', '-18vw', '22deg'],
  ['3%', '-18s', '34s', '1.3', '20vw', '8deg'],
  ['36%', '-24s', '35s', '0.58', '16vw', '-34deg'],
  ['67%', '-27s', '36s', '0.54', '-17vw', '35deg'],
]

const envelopes = envelopeSeed.map(([left, delay, duration, scale, drift, rotation], index) => ({
  id: index,
  style: {
    '--x': left,
    '--delay': delay,
    '--duration': duration,
    '--scale': scale,
    '--drift': drift,
    '--rotation': rotation,
  },
}))

const readableItems = computed(() => items.value.filter((item) => item.text?.trim()))

const years = computed(() => {
  const ys = [...new Set(items.value.map((item) => item.date.slice(0, 4)))]
  return ys.sort((a, b) => b.localeCompare(a))
})

const filteredItems = computed(() => {
  if (activeYear.value === 'all') return items.value
  return items.value.filter((item) => item.date.startsWith(activeYear.value))
})

function pickRandomMoment() {
  const source = readableItems.value
  if (!source.length) return null
  if (source.length === 1) return source[0]

  let next = source[Math.floor(Math.random() * source.length)]
  while (selectedMoment.value && next.id === selectedMoment.value.id) {
    next = source[Math.floor(Math.random() * source.length)]
  }
  return next
}

function openRandomLetter() {
  selectedMoment.value = pickRandomMoment()
}

function openLetter(item) {
  selectedMoment.value = item
}

function closeLetter() {
  selectedMoment.value = null
}

function fullTimestamp(item) {
  return [item.date, item.time].filter(Boolean).join(' ')
}

function isoTimestamp(item) {
  return `${item.date}T${item.time || '00:00:00'}`
}

function shortPreview(text) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.length > 86 ? `${normalized.slice(0, 86)}...` : normalized
}
</script>

<template>
  <main class="fragments-page">
    <section class="fragments-hero" aria-label="碎笔信件">
      <div class="fragments-bg" aria-hidden="true"></div>

      <div class="envelope-field" aria-hidden="false">
        <button
          v-for="envelope in envelopes"
          :key="envelope.id"
          class="falling-envelope"
          type="button"
          :style="envelope.style"
          aria-label="拆开一封随机碎笔"
          @click="openRandomLetter"
        >
          <span class="envelope-shape" aria-hidden="true"></span>
        </button>
      </div>

      <div class="fragments-hero-stage">
        <div class="fragments-hero-copy">
          <p class="eyebrow">Fragments</p>
          <h1>碎笔</h1>
          <p>
            不够长到成为文章，也不想被丢掉的几行。旧日说说、生活切片和偶尔冒出来的句子，
            都被折进这些飘落的信封里。
          </p>
          <div class="fragments-actions">
            <button class="fragment-primary" type="button" @click="openRandomLetter">
              <MailOpen :size="18" />
              拆一封信
            </button>
            <span>{{ items.length }} 则碎笔正在缓慢飘落</span>
          </div>
        </div>

        <Transition name="letter-pop" mode="out-in">
          <aside v-if="selectedMoment" :key="selectedMoment.id" class="letter-panel" role="dialog" aria-label="随机碎笔信件">
            <button class="letter-close" type="button" aria-label="收起信件" @click="closeLetter">
              <X :size="18" />
            </button>
            <div class="letter-paper">
              <div class="letter-stamp">
                <Mail :size="18" />
                <span>opened</span>
              </div>
              <p class="letter-kicker">A letter from the old timeline</p>
              <time class="letter-time" :datetime="isoTimestamp(selectedMoment)">
                {{ fullTimestamp(selectedMoment) }}
              </time>
              <p class="letter-text">{{ selectedMoment.text }}</p>

              <div v-if="selectedMoment.images?.length" class="letter-images">
                <img
                  v-for="(img, index) in selectedMoment.images.slice(0, 2)"
                  :key="index"
                  :src="img.src"
                  :alt="img.alt || '碎笔图片'"
                  loading="lazy"
                />
              </div>

              <div v-if="selectedMoment.comments?.length" class="letter-comments">
                <div v-for="(comment, index) in selectedMoment.comments" :key="index">
                  <strong>{{ comment.author }}</strong>
                  <time>{{ comment.time }}</time>
                  <p>{{ comment.text }}</p>
                </div>
              </div>
            </div>
            <div class="letter-actions">
              <button type="button" @click="openRandomLetter">
                <Shuffle :size="16" />
                再拆一封
              </button>
              <button type="button" @click="closeLetter">收起</button>
            </div>
          </aside>

          <aside v-else class="letter-panel letter-placeholder">
            <MailOpen :size="26" />
            <strong>点开一封飘落的信。</strong>
            <p>每次都会随机抽出一则原来的说说，按信笺样式展开，并保留完整时间戳。</p>
          </aside>
        </Transition>
      </div>
    </section>

    <section class="section-wrap fragments-archive">
      <div class="fragments-archive-head">
        <div>
          <p class="eyebrow">Archive</p>
          <h2>全部碎笔</h2>
          <p>随机拆信之外，也可以按年份慢慢翻回去。</p>
        </div>
        <div class="moments-filter fragments-filter" aria-label="碎笔年份">
          <button
            v-for="year in ['all', ...years]"
            :key="year"
            type="button"
            :class="{ active: activeYear === year }"
            @click="activeYear = year"
          >
            {{ year === 'all' ? '全部' : year }}
          </button>
        </div>
      </div>

      <div class="fragments-count">{{ filteredItems.length }} 则碎笔</div>

      <div class="fragment-list">
        <article v-for="item in filteredItems" :key="item.id" class="fragment-note">
          <button type="button" @click="openLetter(item)">
            <span class="fragment-note-icon" aria-hidden="true"><Sparkles v-if="item.images?.length" :size="13" /></span>
            <span class="fragment-note-copy">
              <time :datetime="isoTimestamp(item)">
                <Calendar :size="13" />
                {{ fullTimestamp(item) }}
              </time>
              <strong>{{ shortPreview(item.text) }}</strong>
            </span>
            <span class="fragment-note-action">
              <Clock3 :size="13" />
              展开成信
            </span>
          </button>
        </article>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-state">
        <h2>没有匹配的碎笔</h2>
        <p>换个年份试试。</p>
      </div>
    </section>
  </main>
</template>
