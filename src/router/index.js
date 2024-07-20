import { createRouter, createWebHistory } from 'vue-router'
import layOut from '../views/layout.vue'
import home from "@/views/home.vue"
import task from "@/views/task.vue"


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layOut,
      children: [
        {
          path: '',
          component: home,
        },
        {
          path: 'task',
          component: task,
        },
        {
          path: 'user',
          name: 'user',
          component: () => import("@/views/user.vue"),
        }
      ]
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import("@/views/signIn.vue"),
    },
    {
      path: '/team',
      name: 'team',
      component: () => import("@/views/team.vue"),
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import("@/views/settingUser.vue"),
    },

    {
      path: '/setLang',
      name: 'setLang',
      component: () => import("@/views/setLang.vue")
    },
  ]
})

export default router
