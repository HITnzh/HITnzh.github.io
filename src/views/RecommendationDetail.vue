<script setup>
import { ArrowLeft, Copy, ExternalLink, ImageDown, Tag } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getRecommendationBySlug } from '../services/contentService'

const route = useRoute()
const recommendation = ref(null)
const loading = ref(true)
const message = ref('')

const displayImage = computed(() => recommendation.value?.shareImage || recommendation.value?.cover || '')
const pageUrl = computed(() => window.location.href)

async function loadRecommendation(slug) {
  loading.value = true
  message.value = ''
  recommendation.value = await getRecommendationBySlug(slug)
  loading.value = false
}

async function copyPageLink() {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    message.value = '页面链接已复制'
  } catch {
    message.value = '复制失败，可以手动复制浏览器地址'
  }
}

onMounted(() => loadRecommendation(route.params.slug))
watch(() => route.params.slug, (slug) => loadRecommendation(slug))
</script>

<template>
  <main v-if="loading" class="page-shell">
    <section class="empty-state">
      <h1>正在加载安利</h1>
      <p>稍等一下。</p>
    </section>
  </main>

  <main v-else-if="recommendation" class="recommend-detail-page">
    <section class="recommend-detail-hero">
      <div class="recommend-detail-copy">
        <RouterLink class="back-link" to="/recommendations"><ArrowLeft :size="16" /> 返回安利区</RouterLink>
        <p class="eyebrow">{{ recommendation.type }}</p>
        <h1>{{ recommendation.title }}</h1>
        <p>{{ recommendation.note }}</p>
        <div class="recommend-creator">{{ recommendation.creator }}</div>
        <div class="recommend-detail-actions">
          <a
            v-if="recommendation.linkUrl"
            class="primary-action"
            :href="recommendation.linkUrl"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink :size="18" />
            {{ recommendation.linkLabel }}
          </a>
          <button class="secondary-admin-action" type="button" @click="copyPageLink">
            <Copy :size="18" />
            复制分享链接
          </button>
        </div>
        <p v-if="message" class="form-note">{{ message }}</p>
      </div>

      <figure v-if="displayImage" class="recommend-detail-media">
        <img :src="displayImage" :alt="`${recommendation.title} 图片`" />
      </figure>
      <div v-else class="recommend-detail-media">
        <div class="recommend-cover" :class="`tone-${recommendation.tone}`">
          <span class="recommend-badge">{{ recommendation.type }}</span>
          <strong>{{ recommendation.title }}</strong>
          <em>{{ recommendation.creator }}</em>
        </div>
      </div>
    </section>

    <section class="section-wrap recommend-detail-grid">
      <div>
        <p class="eyebrow">Why</p>
        <h2>为什么推荐</h2>
        <p>{{ recommendation.note }}</p>
      </div>
      <aside class="recommend-info-panel">
        <div v-if="recommendation.tags.length" class="tag-list">
          <span v-for="tag in recommendation.tags" :key="tag"><Tag :size="14" />{{ tag }}</span>
        </div>
        <a
          v-if="displayImage"
          class="secondary-admin-action"
          :href="displayImage"
          target="_blank"
          rel="noreferrer"
        >
          <ImageDown :size="18" />
          打开分享图
        </a>
        <a
          v-if="recommendation.linkUrl"
          class="secondary-admin-action"
          :href="recommendation.linkUrl"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink :size="18" />
          {{ recommendation.linkLabel }}
        </a>
      </aside>
    </section>
  </main>

  <main v-else class="page-shell">
    <section class="empty-state">
      <h1>没有找到这条安利</h1>
      <p>可能是链接写错了，或者这条内容还没发布。</p>
      <RouterLink class="primary-action" to="/recommendations">返回安利区</RouterLink>
    </section>
  </main>
</template>
