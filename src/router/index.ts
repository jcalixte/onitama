import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/board/:id',
    name: 'Board',
    props: true,
    component: () =>
      import(/* webpackChunkName: "board" */ '@/views/Board/BoardView.vue')
  },
  {
    path: '/board-review/:id',
    name: 'BoardReview',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "board-review" */ '@/views/Board/BoardReview.vue'
      )
  },
  {
    path: '/board-training',
    name: 'BoardTraining',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "board-training" */ '@/views/Board/BoardTraining.vue'
      )
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  },
  {
    path: '/rules',
    name: 'PlayRules',
    component: () =>
      import(/* webpackChunkName: "play-rules" */ '@/views/PlayRules.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
