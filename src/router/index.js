import { createRouter, createWebHashHistory } from 'vue-router'
import About from '../views/About.vue'
import Archive from '../views/Archive.vue'
import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
import Posts from '../views/Posts.vue'
import Projects from '../views/Projects.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/posts',
    name: 'posts',
    component: Posts,
  },
  {
    path: '/posts/:slug',
    name: 'post-detail',
    component: PostDetail,
  },
  {
    path: '/archive',
    name: 'archive',
    component: Archive,
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
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
