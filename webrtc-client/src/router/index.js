import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 * @type {import('vue-router').RouteConfig}
 */
const routes = [
  {
    path: '/',
    name: 'home',
    redirect: "meeting",
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/meeting',
    name: 'meeting',
    component: () => import(/* webpackChunkName: "meeting" */ '../views/Meeting.vue'),
  },
  {
    path: '/room/:id',
    name: 'room',
    component: () => import(/* webpackChunkName: "room" */ '../views/Room.vue'),
  },
  {
    path: '*',
    name: '404',
    redirect: "/"
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let userInfo = null
  try {
    userInfo = JSON.parse(localStorage.getItem("userInfo"))
  } catch (error) {
    userInfo = null
  }

  if (!userInfo && to.name !== "login") {
    return next("/login")
  }

  if (!!userInfo && to.name === "login") {
    return next("/")
  }

  next()
})

export default router
