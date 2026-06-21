import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AwardDetail from '../views/AwardDetail.vue'

const routes = [
  { path: '/',              component: Home },
  { path: '/awards/:id',   component: AwardDetail },
]

export default createRouter({
  history: createWebHistory('/3D_SP/'),
  routes,
})