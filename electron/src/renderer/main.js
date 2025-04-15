// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app.vue' // Make sure the path to your App.vue is correct

// Create the Vue app instance
const app = createApp(App)

// Create and install the Pinia instance
const pinia = createPinia()
app.use(pinia)

// Mount the app
app.mount('#app')