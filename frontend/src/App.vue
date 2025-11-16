<script setup>
import { ref, provide, watch } from 'vue';
import { useRouter } from 'vue-router';
import globalNavBar from '@/components/standardjs/navbar.vue';

const router = useRouter();
const navbarRef = ref(null);

// Function to refresh the navbar
function refreshNavbar() {
    if (navbarRef.value && navbarRef.value.refreshUserData) {
        navbarRef.value.refreshUserData();
    }
}

// Provide the refresh function to child components
provide('refreshNavbar', refreshNavbar);

// Watch for route changes to detect login redirects
watch(() => router.currentRoute.value.path, (newPath, oldPath) => {
    // If navigating from /auth to /user, it's likely a successful login
    if (oldPath === '/auth' && newPath === '/user') {
        refreshNavbar();
    }
});
</script>

<template>
<div id="app">
    <main>
        <globalNavBar ref="navbarRef"></globalNavBar>
        <RouterView />
    </main>
</div>
</template>
<style>
    main{
        height:100dvh;
        display:flex;
        flex-direction: column;
    }

	@media (max-width: 768px) {
        html { font-size: 12px; }
    }
</style>