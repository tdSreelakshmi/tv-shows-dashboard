import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShowDetails from '@/views/ShowDetails.vue'
import SearchShow from '@/views/SearchShow.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/show/:id',
    name: 'ShowDetails',
    component: ShowDetails,
    props: true
  },
  {
    path: '/search',
    name: 'SearchShow',
    component: SearchShow
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
