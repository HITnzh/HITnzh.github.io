<script setup>
import { Mail, MailOpen, Shuffle, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { moments } from '../data/moments'

const items = ref(moments)
const selectedMoment = ref(null)

const envelopeSeed = [
  ['8%', '-6s', '30s', '0.54', '10vw', '-16deg'],
  ['16%', '-14s', '34s', '0.82', '-8vw', '12deg'],
  ['24%', '-2s', '28s', '0.66', '7vw', '28deg'],
  ['34%', '-20s', '38s', '0.48', '-12vw', '-8deg'],
  ['44%', '-10s', '32s', '0.76', '9vw', '18deg'],
  ['55%', '-4s', '36s', '0.58', '-7vw', '-28deg'],
  ['64%', '-18s', '31s', '0.72', '12vw', '6deg'],
  ['73%', '-8s', '39s', '0.5', '-10vw', '-20deg'],
  ['82%', '-1s', '29s', '0.88', '8vw', '15deg'],
  ['92%', '-16s', '35s', '0.62', '-12vw', '-12deg'],
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

function closeLetter() {
  selectedMoment.value = null
}

function fullTimestamp(item) {
  return [item.date, item.time].filter(Boolean).join(' ')
}

function isoTimestamp(item) {
  return `${item.date}T${item.time || '00:00:00'}`
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
  </main>
</template>
