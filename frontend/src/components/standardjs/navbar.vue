<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {fetchUserData} from '@/components/standardjs/fetchUserData'

// Reactive state to store the username
const displayUsername = ref('');

// Function to log out the user
function logOut() {
    localStorage.removeItem('token'); // Remove token from localStorage
    router.push('/auth'); // Redirect to the login page
}

// Function to fetch the user's username


// Call fetchUserProfile on mounted


onMounted(async() => {           //on mounted (whenever a new page loads, properly set the displyed username)
    displayUsername.value = await fetchUserData('username');
})

const router = useRouter(); // Access the Vue Router for navigation
</script>

<template>
    <div class="navbar">
        <RouterLink class="nav_btn" to="/" active-class="active">Home</RouterLink>
        <RouterLink class="nav_btn" to="/explore" active-class="active">Explore</RouterLink> 
        <RouterLink class="nav_btn" to="/project" active-class="active">Create</RouterLink><!-- I think they should be rendered conditionally-->
        <RouterLink class="nav_btn" to="/user" active-class="active">Profile</RouterLink>
        <RouterLink class="nav_btn" to="/about" active-class="active">About</RouterLink>



        <!-- Conditional rendering based on whether the user is logged in -->
        <template v-if="displayUsername">
            <span class="hello-user">Hello {{ displayUsername || "ERROR NO USER. SHOULD NOT BE SEEN" }}!</span>
            <button @click="logOut" class="logout-btn">Log Out</button>
        </template>
        <template v-else>
            <RouterLink class="login_btn" to="/auth" active-class="active">Login</RouterLink>
        </template>
    </div>
</template>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';

.navbar {
    position:sticky;
    display: flex;
    top: 0;
    width: 100vw;
    height: fit-content;
    padding: 10px;
    background-color: rgba(64, 64, 64,1);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    z-index: 100;
}


.nav_btn:first-child {
    margin-left: auto; 
}   
.nav_btn {
    font-family: 'Syne Mono', monospace;
    font-size: 22px;
    margin-left: 10px;
    color: rgb(165, 165, 165);
    transition: color 0.2s;
}

.nav_btn:hover {
    color: #e74c3c; /* Change color on hover */
}

.login_btn {
    font-family: 'Syne Mono', monospace;
    font-size: 22px;
    margin-left: auto;
    margin-right: 10px;
    background: rgb(255, 255, 255);
    border: 2px solid #e0e0e0; /* Added for consistency */
    border-radius: 5px;
    box-shadow: 2px 2px 0 #000; /* Added for brutal morphic style */
    color: rgb(188, 188, 188);
}

.hello-user {
    font-family: 'Pixelify Sans';
    font-size: 22px;
    color: rgb(165, 165, 165);
    margin-left: auto;
    margin-right: 10px;
}

.logout-btn {
    font-family: 'Pixelify Sans';
    font-size: 22px;
    height: calc(min-content + 10px);
    margin-left: 10px;
    background: rgb(255, 255, 255);
    border: 2px solid #e0e0e0; /* Added for consistency */
    border-radius: 5px;
    box-shadow: 2px 2px 0 #000; /* Added for brutal morphic style */
    color: rgb(188, 188, 188);
}
</style>
