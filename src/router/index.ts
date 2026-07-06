import { createRouter, createWebHistory } from 'vue-router'

import {
  beginCaseStudyNavigation,
  enforceCaseStudyHomeScroll,
} from '@/lib/homeScrollPreserve'
import { lenis } from '@/lib/lenis'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Home.vue'),
    },
    {
      path: '/work/:id',
      name: 'work-case-study',
      component: () => import('@/pages/WorkCaseStudy.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.name === 'work-case-study' || from.name === 'work-case-study') {
      return false
    }

    if (savedPosition) {
      lenis.scrollTo(savedPosition.top, { immediate: true })
      return false
    }

    if (!to.hash) {
      lenis.scrollTo(0, { immediate: true })
    }

    return false
  },
})

export default router

router.beforeEach((to) => {
  if (to.name === 'work-case-study') {
    beginCaseStudyNavigation()
  }
})

router.afterEach((to) => {
  if (to.name === 'work-case-study') {
    enforceCaseStudyHomeScroll()
  }
})
