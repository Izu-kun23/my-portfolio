import { createApp } from 'vue'
import 'lenis/dist/lenis.css'

import App from '@/App.vue'
import router from '@/router'
import '@/assets/styles/main.css'
import { initializeGoogleAnalytics, trackPageView } from '@/lib/googleAnalytics'
import '@/lib/lenis'

initializeGoogleAnalytics()

router.afterEach((to) => {
  trackPageView(to.fullPath)
})

createApp(App).use(router).mount('#app')
