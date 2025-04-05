import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

import HomeView from '../views/HomeView.vue'
import AdView from '@/views/Ads/AdView.vue'
import AdListView from '@/views/Ads/AdListView.vue'
import NewAdView from '@/views/Ads/NewAdView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegistrationView from '@/views/Auth/RegistrationView.vue'
import OrdersView from '@/views/User/OrdersView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/ad/:id',
    props: true,
    name: 'ad',
    component: AdView,
    meta: { requiresAuth: true }
  },
  {
    path: '/list',
    name: 'list',
    component: AdListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/new',
    name: 'newAd',
    component: NewAdView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/registration',
    name: 'registration',
    component: RegistrationView
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Защита маршрутов
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login');
  } else {
      next();
  }
});

export default router

// Теперь страницы "Новый товар" и "Заказы" доступны только авторизованным юзерам!
// Если юзер не залогинен, его перенесёт на страницу логина 🔒