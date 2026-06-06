export const posts = [
  {
    slug: 'start-from-static-blog',
    title: '从静态博客开始，给未来的系统留好位置',
    date: '2026-06-06',
    category: '技术',
    tags: ['Vue', 'GitHub Pages', '架构'],
    readTime: '6 min',
    cover: '/images/hero-mountain.jpg',
    featured: true,
    excerpt: '把博客先做成静态站，不是妥协，而是把阅读体验、内容结构和部署路径先打磨稳定。',
    content: [
      {
        heading: '先让内容站跑起来',
        paragraphs: [
          'GitHub Pages 的优势是简单、稳定、几乎不用维护。对于个人博客，第一阶段最重要的是让文章能够被舒服地阅读，而不是过早引入后台、权限和数据库。',
          'Vue 负责交互和页面组织，文章数据保持清晰的结构。等未来需要在线编辑、图片上传或评论系统时，再把 API 接进来，不会推翻前台。',
        ],
      },
      {
        heading: '为什么用 Hash 路由',
        paragraphs: [
          'GitHub Pages 不能像服务器应用一样自动把任意路径回退到 index.html。Hash 路由能保证刷新和直接打开页面都可用。',
          '这让部署更轻：构建产物丢给 Pages 就能跑，文章详情页也不会因为刷新变成 404。',
        ],
      },
    ],
  },
  {
    slug: 'vue-reading-experience',
    title: 'Vue 组件里可以认真打磨的阅读体验',
    date: '2026-06-04',
    category: '前端',
    tags: ['Vue', 'UI', '组件'],
    readTime: '8 min',
    cover: '/images/cover-notes.jpg',
    featured: true,
    excerpt: '一个博客不只是把字摆出来：间距、目录、列表、代码块和移动端触感都会影响读者愿不愿意继续看。',
    content: [
      {
        heading: '让页面承担节奏',
        paragraphs: [
          '首页适合展示精选和最近更新，文章页则应该安静下来。标题、时间、标签和正文之间的距离，会决定读者进入文章时的速度。',
          '组件化的好处是，每一种内容形态都能被稳定复用。文章卡片、目录、标签、归档项都不需要在页面里重复写。',
        ],
      },
      {
        heading: '保持交互克制',
        paragraphs: [
          '博客的交互应该服务阅读：搜索、筛选、跳转、返回顶部，这些已经足够。复杂动画和过多装饰反而会抢走内容的注意力。',
        ],
      },
      {
        heading: '一个最小数据模型',
        code: `{
  slug: 'vue-reading-experience',
  title: 'Vue 组件里可以认真打磨的阅读体验',
  category: '前端',
  tags: ['Vue', 'UI', '组件']
}`,
      },
    ],
  },
  {
    slug: 'signal-notes',
    title: '低旁瓣非连续谱信号的一点学习笔记',
    date: '2026-05-28',
    category: '研究',
    tags: ['信号处理', '优化', '笔记'],
    readTime: '7 min',
    cover: '/images/cover-signal.jpg',
    featured: true,
    excerpt: '把公式、实验和直觉分开记录，后面整理论文或答辩材料时会轻很多。',
    content: [
      {
        heading: '先写直觉，再写细节',
        paragraphs: [
          '研究笔记最容易卡在“要不要写完整”。我的经验是先保留关键直觉，再把推导、代码和图表逐步补上。',
          '博客里的研究文章不必和论文一样严肃，但需要让未来的自己能快速恢复上下文。',
        ],
      },
      {
        heading: '记录实验条件',
        paragraphs: [
          '每次实验至少写清楚目标函数、约束条件、参数范围和结果观察。哪怕图暂时没整理，也能避免之后重新猜一遍当时怎么跑的。',
        ],
      },
    ],
  },
  {
    slug: 'github-pages-checklist',
    title: 'GitHub Pages 发布前检查清单',
    date: '2026-05-21',
    category: '工程',
    tags: ['部署', 'GitHub', 'Vite'],
    readTime: '5 min',
    cover: '/images/hero-mountain.jpg',
    featured: false,
    excerpt: '构建、路由、资源路径、移动端布局和 Pages 设置，是静态站上线前最应该检查的五件事。',
    content: [
      {
        heading: '构建要先过',
        paragraphs: [
          '本地运行 npm run build，确认 dist 能生成。再用 npm run preview 看一次生产构建效果，很多资源路径问题会在这一步暴露。',
        ],
      },
      {
        heading: '部署来源要匹配',
        paragraphs: [
          '如果使用 GitHub Actions，需要在仓库 Pages 设置里选择 GitHub Actions 作为发布来源。之后每次推送 main 分支都会自动部署。',
        ],
      },
    ],
  },
  {
    slug: 'make-projects-visible',
    title: '项目页不只是链接列表',
    date: '2026-05-12',
    category: '项目',
    tags: ['作品集', '复盘', '设计'],
    readTime: '4 min',
    cover: '/images/cover-life.jpg',
    featured: false,
    excerpt: '一个好的项目页应该讲清楚目标、技术栈、你负责什么，以及最终做到了什么。',
    content: [
      {
        heading: '项目需要被解释',
        paragraphs: [
          '项目卡片里只放仓库链接是不够的。访问者更想知道你为什么做、解决了什么问题、有没有继续迭代。',
          '博客的项目页可以作为简历的补充，把工程能力、审美和表达能力放在同一个地方。',
        ],
      },
    ],
  },
  {
    slug: 'quiet-life-log',
    title: '给日常也留一点结构',
    date: '2026-04-30',
    category: '生活',
    tags: ['随笔', '记录', '阅读'],
    readTime: '3 min',
    cover: '/images/cover-notes.jpg',
    featured: false,
    excerpt: '技术之外的记录不必宏大，能帮你保存某个阶段的气味、秩序和心情就很好。',
    content: [
      {
        heading: '小记录也有用',
        paragraphs: [
          '博客不用每篇都像教程。读过的书、一次旅行、一个解决了很久的小问题，都值得被放进自己的时间线上。',
        ],
      },
    ],
  },
]

export const categories = ['全部', ...Array.from(new Set(posts.map((post) => post.category)))]
