import { Component } from 'vue'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import OAuthSuccess from '@/components/OAuthSuccess.vue'
import NotFound from '@/components/common/NotFound.vue'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    name: 'home',
    component: (): Promise<Component> => import('../views/HomeView.vue'),
  },
  {
    path: '/oauth-success',
    name: 'oauth-success',
    component: (): Promise<Component> => Promise.resolve(OAuthSuccess),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: (): Promise<Component> => import('../views/DashboardView.vue'),
  },
  {
    path: '/upgrade',
    name: 'upgrade',
    component: (): Promise<Component> => import('../views/UpgradeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: (): Promise<Component> => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: (): Promise<Component> => import('../views/RegisterView.vue'),
  },
  {
    path: '/articles',
    name: 'articles',
    component: (): Promise<Component> => import('../views/ArticlesView.vue'),
  },
  {
    path: '/articles/view/:id',
    name: 'article-detail',
    component: () => import('../views/ArticlesDetailView.vue'),
    props: true,
  },
  {
    path: '/videos',
    name: 'videos',
    component: (): Promise<Component> => import('../views/VideosView.vue'),
  },
  {
    path: '/videos/view/:id',
    name: 'video-detail',
    component: () => import('../views/VideosDetailView.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  {
    path: '/404',
    name: 'NotFound',
    component: (): Promise<Component> => Promise.resolve(NotFound),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
