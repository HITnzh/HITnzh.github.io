import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/posts',
    name: 'posts',
    component: () => import('../views/Posts.vue'),
  },
  {
    path: '/posts/:slug',
    name: 'post-detail',
    component: () => import('../views/PostDetail.vue'),
  },
  {
    path: '/archive',
    name: 'archive',
    component: () => import('../views/Archive.vue'),
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/Projects.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
