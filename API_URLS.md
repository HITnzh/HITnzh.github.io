# HITnzh Blog 可用 URL 与接口清单

## 站点地址

| 用途 | URL |
| --- | --- |
| 博客首页 | `https://hitnzh.github.io/` |
| 文章列表 | `https://hitnzh.github.io/#/posts` |
| 安利区 | `https://hitnzh.github.io/#/recommendations` |
| 安利详情 | `https://hitnzh.github.io/#/recommendations/:slug` |
| 归档 | `https://hitnzh.github.io/#/archive` |
| 项目 | `https://hitnzh.github.io/#/projects` |
| 关于 | `https://hitnzh.github.io/#/about` |

## 管理后台页面

| 用途 | URL |
| --- | --- |
| 后台登录 | `https://hitnzh.github.io/#/admin/login` |
| 后台首页 | `https://hitnzh.github.io/#/admin` |
| 文章管理 | `https://hitnzh.github.io/#/admin/posts` |
| 新建文章 | `https://hitnzh.github.io/#/admin/posts/new` |
| 编辑文章 | `https://hitnzh.github.io/#/admin/posts/:id/edit` |
| 安利管理 | `https://hitnzh.github.io/#/admin/recommendations` |
| 新建安利 | `https://hitnzh.github.io/#/admin/recommendations/new` |
| 编辑安利 | `https://hitnzh.github.io/#/admin/recommendations/:id/edit` |

## Supabase 基础地址

| 用途 | URL |
| --- | --- |
| Supabase 项目地址 | `https://lzpdxyosldlqeppkmbww.supabase.co` |
| REST API 基础地址 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1` |
| Auth API 基础地址 | `https://lzpdxyosldlqeppkmbww.supabase.co/auth/v1` |
| Storage API 基础地址 | `https://lzpdxyosldlqeppkmbww.supabase.co/storage/v1` |

## 数据表 REST 接口

这些接口通常需要请求头：

```http
apikey: VITE_SUPABASE_ANON_KEY
Authorization: Bearer 用户登录后的 access_token
Content-Type: application/json
```

| 数据 | URL |
| --- | --- |
| 文章 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/posts` |
| 分类 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/categories` |
| 标签 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/tags` |
| 文章-标签关联 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/post_tags` |
| 项目 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/projects` |
| 资源记录 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/assets` |
| 站点设置 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/site_settings` |
| 管理员资料 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/profiles` |

## 常用查询示例

| 用途 | URL |
| --- | --- |
| 获取已发布文章 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/posts?status=eq.published&select=*` |
| 按 slug 获取文章 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/posts?slug=eq.你的-slug&select=*` |
| 获取分类列表 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/categories?select=*&order=name.asc` |
| 获取标签列表 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/tags?select=*&order=name.asc` |
| 获取项目列表 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/projects?select=*&order=sort_order.asc` |
| 获取安利设置 | `https://lzpdxyosldlqeppkmbww.supabase.co/rest/v1/site_settings?key=eq.recommendations&select=value` |

## 登录与用户接口

| 用途 | URL |
| --- | --- |
| 邮箱密码登录 | `https://lzpdxyosldlqeppkmbww.supabase.co/auth/v1/token?grant_type=password` |
| 获取当前用户 | `https://lzpdxyosldlqeppkmbww.supabase.co/auth/v1/user` |
| 退出登录 | `https://lzpdxyosldlqeppkmbww.supabase.co/auth/v1/logout` |

## 文件上传与公开访问

当前 Storage bucket：

```text
blog-assets
```

| 用途 | URL |
| --- | --- |
| 上传文件 | `https://lzpdxyosldlqeppkmbww.supabase.co/storage/v1/object/blog-assets/你的文件路径` |
| 公开访问文件 | `https://lzpdxyosldlqeppkmbww.supabase.co/storage/v1/object/public/blog-assets/你的文件路径` |

例子：

```text
https://lzpdxyosldlqeppkmbww.supabase.co/storage/v1/object/public/blog-assets/2026-06-07/example.jpg
```

## 注意事项

- 前端网页里只能使用 Supabase anon key。
- 不要把 service role key 放到网页、GitHub 仓库或公开文档里。
- 文章后台保存、上传图片、改分类标签时，需要先登录管理员账号。
- 目前网站使用 Hash 路由，所以页面路径里会有 `#/`。
