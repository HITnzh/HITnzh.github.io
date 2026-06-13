import { createRouter, createWebHashHistory } from 'vue-router'
import About from '../views/About.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import Moments from '../views/Moments.vue'
import Gallery from '../views/Gallery.vue'
import GalleryAlbum from '../views/GalleryAlbum.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminPostEditor from '../views/AdminPostEditor.vue'
import AdminPosts from '../views/AdminPosts.vue'
import AdminRecommendationEditor from '../views/AdminRecommendationEditor.vue'
import AdminRecommendations from '../views/AdminRecommendations.vue'
import Archive from '../views/Archive.vue'
import Home from '../views/Home.vue'
import PostDetail from '../views/PostDetail.vue'
import Posts from '../views/Posts.vue'
import Projects from '../views/Projects.vue'
import RecommendationDetail from '../views/RecommendationDetail.vue'
import Recommendations from '../views/Recommendations.vue'

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
    path: '/recommendations',
    name: 'recommendations',
    component: Recommendations,
  },
  {
    path: '/recommendations/:slug',
    name: 'recommendation-detail',
    component: RecommendationDetail,
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
    path: '/fragments',
    name: 'fragments',
    component: Moments,
  },
  {
    path: '/moments',
    redirect: '/fragments',
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: Gallery,
  },
  {
    path: '/gallery/:albumId',
    name: 'gallery-album',
    component: GalleryAlbum,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin,
  },
  {
    path: '/admin/posts',
    name: 'admin-posts',
    component: AdminPosts,
  },
  {
    path: '/admin/posts/new',
    name: 'admin-post-new',
    component: AdminPostEditor,
  },
  {
    path: '/admin/posts/:id/edit',
    name: 'admin-post-edit',
    component: AdminPostEditor,
  },
  {
    path: '/admin/recommendations',
    name: 'admin-recommendations',
    component: AdminRecommendations,
  },
  {
    path: '/admin/recommendations/new',
    name: 'admin-recommendation-new',
    component: AdminRecommendationEditor,
  },
  {
    path: '/admin/recommendations/:id/edit',
    name: 'admin-recommendation-edit',
    component: AdminRecommendationEditor,
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
