HITnzh Blog

基于 Vue 3 和 Vite 的 GitHub Pages 静态博客。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## Supabase 后端

本项目支持 GitHub Pages + Supabase：

- GitHub Pages 托管 Vue 前台
- Supabase 存文章、项目、图片和管理员登录
- 未配置 Supabase 时自动回退到本地示例数据

配置步骤见 [docs/supabase.md](docs/supabase.md)。
