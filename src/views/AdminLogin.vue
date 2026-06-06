<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getBackendStatus, signIn } from '../services/adminService'

const router = useRouter()
const backend = getBackendStatus()
const email = ref('')
const password = ref('')
const message = ref('')
const loading = ref(false)

async function submit() {
  message.value = ''
  loading.value = true
  try {
    await signIn(email.value, password.value)
    router.push('/admin/posts')
  } catch (error) {
    message.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page-shell admin-shell">
    <section class="page-hero compact-hero">
      <p class="eyebrow">Admin</p>
      <h1>登录</h1>
      <p>只有管理员可以创建和编辑文章。</p>
    </section>

    <section class="section-wrap admin-form-wrap">
      <form class="admin-form" @submit.prevent="submit">
        <label>
          邮箱
          <input v-model="email" type="email" autocomplete="email" required />
        </label>
        <label>
          密码
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>
        <button class="primary-action" type="submit" :disabled="loading || !backend.configured">
          {{ loading ? '登录中' : '登录' }}
        </button>
        <p v-if="!backend.configured" class="form-note">Supabase 未配置，登录暂不可用。</p>
        <p v-if="message" class="form-error">{{ message }}</p>
      </form>
    </section>
  </main>
</template>
