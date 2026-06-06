<script setup>
import { FileText, Settings } from 'lucide-vue-next'
import { getBackendStatus } from '../services/adminService'

const backend = getBackendStatus()
</script>

<template>
  <main class="page-shell admin-shell">
    <section class="page-hero compact-hero">
      <p class="eyebrow">Admin</p>
      <h1>后台</h1>
      <p>管理文章、项目、图片和站点配置。</p>
    </section>

    <section class="section-wrap admin-grid">
      <RouterLink class="admin-action-card" to="/admin/posts">
        <FileText :size="24" />
        <strong>文章管理</strong>
        <span>新建、编辑、发布和查看草稿。</span>
      </RouterLink>
      <div class="admin-action-card">
        <Settings :size="24" />
        <strong>后端状态</strong>
        <span>{{ backend.configured ? 'Supabase 已配置' : '等待 Supabase 配置' }}</span>
      </div>
    </section>

    <section v-if="!backend.configured" class="section-wrap">
      <div class="setup-panel">
        <h2>还没有连接 Supabase</h2>
        <p>先在 Supabase 创建项目，然后把项目 URL 和 anon key 写入本地 `.env.local`。配置完成后，后台登录和文章保存会自动启用。</p>
        <pre><code>VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_STORAGE_BUCKET=blog-assets</code></pre>
      </div>
    </section>
  </main>
</template>
