import { createApp } from 'vue'
import 'lenis/dist/lenis.css'

import App from '@/App.vue'
import router from '@/router'
import '@/assets/styles/main.css'
import '@/lib/lenis'

createApp(App).use(router).mount('#app')
