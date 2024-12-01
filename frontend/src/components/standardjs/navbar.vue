<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Reactive state to store the username
const username = ref('');

// Function to log out the user
function logOut() {
    localStorage.removeItem('token'); // Remove token from localStorage
    router.push('/auth'); // Redirect to the login page
}

// Function to fetch the user's username
async function fetchUserProfile() {
    const token = localStorage.getItem('token');  // Get the token from localStorage

    if (!token) {
        return; // If no token, do not proceed
    }

    try {
        const response = await fetch('http://localhost:5000/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the JWT token in the Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        username.value = data.username;  // Store the username in the reactive variable
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Call fetchUserProfile on mounted
onMounted(fetchUserProfile);

const router = useRouter(); // Access the Vue Router for navigation
</script>

<template>
    <p class="navbar">
        <RouterLink class="nav_btn" to="/" active-class="active">Home</RouterLink>
        <RouterLink class="nav_btn" to="/explore" active-class="active">Explore</RouterLink>
        <RouterLink class="nav_btn" to="/create" active-class="active">Create</RouterLink>
        <RouterLink class="nav_btn" to="/user" active-class="active">Profile</RouterLink>
        <RouterLink class="nav_btn" to="/about" active-class="active">About</RouterLink>

        <!-- Conditional rendering based on whether the user is logged in -->
        <template v-if="username">
            <span class="hello-user">Hello {{ username }}!</span>
            <button @click="logOut" class="logout-btn">Log Out</button>
        </template>
        <template v-else>
            <RouterLink class="login_btn" to="/auth" active-class="active">Login</RouterLink>
        </template>
    </p>
</template>

<style>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';

.navbar {
    display: flex;
    margin-top: 0;
    position: sticky;
    width: 100vw;
    height: min-content;
    padding: 10px 0px;
    background-color: rgb(64, 64, 64);
    min-height: max-content;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
}

.nav_btn {
    font-family: 'Syne Mono', monospace;
    font-size:22px;
    height: calc(min-content + 10px);
    margin-left: 10px;
    color: rgb(165, 165, 165);
}

.login_btn {
    font-family: 'Syne Mono', monospace;
    font-size:22px;

    height: calc(min-content + 10px);
    margin-left: 10px;
    margin-left: auto;
    margin-right: 10px;
    background: rgb(255, 255, 255);
    border-radius: 5px;
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
    border-radius: 5px;
    color: rgb(188, 188, 188);
}
</style>
