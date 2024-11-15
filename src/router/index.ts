import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StatsView from '../views/StatsView.vue'
import RevenueView from '@/views/RevenueView.vue'
import ProductsView from '@/views/ProductsView.vue'
import VersionStatsView from '../views/VersionStatsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/user/:user',
      name: 'userStat',
      component: StatsView
    },
    {
      path: '/org/:org',
      name: 'orgStat',
      component: StatsView
    },
    {
      path: '/revenue',
      name: 'revenueStats',
      component: RevenueView
    },
    {
      path: '/products',
      name: 'productStats',
      component: ProductsView
    },
    {
      path: '/downloads/:project',
      name: 'versionStats',
      component: VersionStatsView
    }
  ]
})

export default router
