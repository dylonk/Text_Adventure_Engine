
// Responsible for creating html like page navigation
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './home.vue'
import AboutView from './about.vue'
import ExploreView from './explore.vue'
import CreateView from './create.vue'
import LoginView from './login.vue'
import ProfileView from './profile.vue'


const routes = [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/explore', component: ExploreView },
    { path: '/create', component: CreateView },
    { path: '/auth', component: LoginView },
    { path: '/user', component: ProfileView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
    scrollBehavior(to, from, savedPosition){

    }
})

export default router