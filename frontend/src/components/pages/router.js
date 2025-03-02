// Responsible for creating html like page navigation
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './home.vue'
import AboutView from './about.vue'
import ExploreView from './explore.vue'
import CreateView from './create.vue'
import LoginView from './login.vue'
import ProfileView from './profile.vue'
import GamePage from './GamePage.vue'
import gamePageView from './gamePage.vue'
import ProjectView from './project.vue'



const routes = [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/explore', component: ExploreView },
    { path: '/create', component: CreateView },
    { path: '/auth', component: LoginView },
    { path: '/user', component: ProfileView },
    { path: '/game', component: GamePage },
    { path: '/gamePage', component: gamePageView },
    { path: '/project', component: ProjectView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: '/', name: 'Home', component: HomeView },
        { path: '/about', name: 'About', component: AboutView },
        { path: '/explore', name: 'Explore', component: ExploreView },
        { path: '/create', name: 'Create', component: CreateView },
        { path: '/auth', name: 'Auth', component: LoginView },
        { path: '/user', name: 'User', component: ProfileView },
        { path: '/project', component: ProjectView },
        { path: '/gamePage/:info', name: 'GamePage', component: gamePageView },
    ],
    scrollBehavior(to, from, savedPosition){

    }
})

export default router
