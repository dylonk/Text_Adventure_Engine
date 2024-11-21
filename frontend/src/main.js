import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './components/pages/router.js'
import { createPinia } from 'pinia'
console.log('Starting app...'); // Log to confirm main.js is executed
const pinia = createPinia()//creaes pinia store
console.log('Pinia store created.');
createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
    console.log('App mounted to #app.');