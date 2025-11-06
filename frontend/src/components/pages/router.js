// Responsible for creating html like page navigation
import { createMemoryHistory, createWebHistory, createRouter } from 'vue-router'

import HomeView from './home.vue'
import AboutView from './about.vue'
import ExploreView from './explore.vue' 
import CreateView from './create.vue'
import LoginView from './login.vue'
import ProfileView from './profile.vue'
import Game from './game.vue'
import gamePageView from './GamePage.vue'
import ProjectView from './project.vue'
import Publish from './publish.vue'

// const routes = [
//     { path: '/', component: HomeView },
//     { path: '/about', component: AboutView },
//     { path: '/explore', component: ExploreView },
//     { path: '/create', component: CreateView },
//     { path: '/auth', component: LoginView },
//     { path: '/user', component: ProfileView },
//     { path: '/game', component: Game },
//     { path: '/gamePage', component: gamePageView },
//     { path: '/project', component: ProjectView },
//     { path: '/publish', component: Publish},
// ]

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home', component: HomeView },
        { path: '/about', name: 'About', component: AboutView },
        { path: '/explore', name: 'Explore', component: ExploreView },
        { path: '/create', name: 'Create', component: CreateView },
        { path: '/auth', name: 'Auth', component: LoginView },
        { path: '/user', name: 'User', component: ProfileView },
        { path: '/project', component: ProjectView },
        { path: '/game/:gameTitle', name: 'game', component: Game, props: true },
        { path: '/gamePage', component: gamePageView },
        { path: '/gamePage/:info', name: 'GamePage', component: gamePageView },
        { path: '/publish', component: Publish},
        {path:'/savegames', name:'Savegames'},
        // Catch-all route: redirect any unmatched paths to home
        { path: '/:pathMatch(.*)*', redirect: '/' }

    ],
    scrollBehavior(to, from, savedPosition){

    }
})

export default router
