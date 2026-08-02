import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AwardDetail from '../views/AwardDetail.vue'
import ProjectDetail from '../views/ProjectDetail.vue'

const routes = [
  { path: '/',              component: Home },
  { path: '/awards/:id',   component: AwardDetail },
  {
  path: '/projects/:id',
  name: 'ProjectDetail',
  component: ProjectDetail
}
]

export default createRouter({
  history: createWebHistory('/3D_SP/'),
  routes,
})