<script setup>
import { ref, onMounted } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue'

const username = ref('');  // To store the username

// Function to log out the user
function logOut() {
    localStorage.removeItem('token');  // Remove token from localStorage
    this.$router.push('/');  // Redirect to the login page
}

// Function to fetch the user's profile data
async function fetchUserProfile() {
    const token = localStorage.getItem('token');  // Get the token from localStorage

    if (!token) {
        console.log('No token found. Please log in again.');
        this.$router.push('/login');  // Redirect to login page if no token
        return;
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
        username.value = data.username;  // Set the username from the response data
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Fetch user profile when the component is mounted
onMounted(fetchUserProfile);
</script>

<template>
    <div class="profile-container">
        <globalNavBar/>
        <div class="profile-sidebar">
            <div class="profile-side-btn">User Profile</div>
            <hr>
            <div class="profile-side-btn">Settings</div>
            <hr>
        </div>
    </div>
</template>

<style scoped>
.profile-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
}
.profile-sidebar {
    color: rgb(165, 165, 165);
    font-size: larger;
    background: rgb(255, 255, 255);
    height: 100%;
    display: flex;
    width: max-content;
    overflow: scroll;
    flex-direction: column;
}
hr {
    border-color: rgb(190, 190, 190);
}
.profile-side-btn {
    padding: 10px;
}
.profile-sidebar > button {
    padding: 10px;
    margin-top: auto;
}
#user-info {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-left: 20px;
}
.nickname {
    position: relative;
    margin-top: 5%;
}
.account-stats {
    position: relative;
    margin-top: 15%;
}
</style>
