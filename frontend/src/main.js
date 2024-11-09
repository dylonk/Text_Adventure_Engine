import './assets/main.css'


import { createApp } from 'vue'
import App from './App.vue'
import router from './components/pages/router.js'


createApp(App)
    .use(router)
    .mount('#app')
