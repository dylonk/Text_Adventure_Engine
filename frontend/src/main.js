import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './components/pages/router.js'
import { createPinia } from 'pinia'

const pinia = createPinia()//creaes pinia store

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
