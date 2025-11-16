<script setup>
import { ref, onMounted, defineProps,computed } from 'vue';
import { useRouter } from 'vue-router';
import {fetchUserData} from '@/components/standardjs/fetchUserData'

const loggedIn = computed(() => !!displayUsername.value);//if it's displaying the username, it means you're logged in.
const props = defineProps({
    warnOnExit: false,
})


// Reactive state to store the username
const displayUsername = ref('');
const allDataLoaded = ref(false); // this is so the v-if logged ins dont dissappear briefly when a new page loads, rather no navbar until all data is loaded


// Function to log out the user
function logOut() {
    localStorage.removeItem('token'); // Remove token from localStorage
    displayUsername.value = ''; // Clear the username immediately
    router.push('/auth'); // Redirect to the login page
}

// Function to fetch the user's username
async function refreshUserData() {
    displayUsername.value = await fetchUserData('username');
    allDataLoaded.value = true; //whether there's a username or not, we have all the data we need now to display the taskbar.
}

// Call fetchUserData on mounted
onMounted(async() => {           //on mounted (whenever a new page loads, properly set the displyed username)
    await refreshUserData();
})

// Expose the refresh function so parent components can call it
defineExpose({
    refreshUserData
})

const router = useRouter(); // Access the Vue Router for navigation
</script>

<template>
    <div class="navbar">
        <div v-if="allDataLoaded" style="display:contents;">
            <RouterLink class="nav_btn" to="/" active-class="active">Home</RouterLink>
            <RouterLink class="nav_btn" to="/explore" active-class="active">Explore</RouterLink> 
            <RouterLink class="nav_btn" to="/project" active-class="active" v-if="loggedIn">Create</RouterLink><!-- I think they should be rendered conditionally-->
            <RouterLink class="nav_btn" to="/user" active-class="active" v-if="loggedIn">Profile</RouterLink>
            <RouterLink class="nav_btn" to="/about" active-class="active">Download</RouterLink>
            <div style="display:flex; width:fit-content; margin-left:auto; align-items: center;   flex-shrink: 0;">
                <div v-if="displayUsername">
                    <span class="hello-user">Hello {{ displayUsername || "ERROR NO USER. SHOULD NOT BE SEEN" }}!</span>
                    <button @click="logOut" class="login_btn">Log Out</button>
                </div>
                <RouterLink v-else class="login_btn" to="/auth">Login</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';

.navbar {
    position:sticky;
    display: flex;
    overflow-x:clip;
    align-self: flex-start;
    top: 0;
    width: 100vw;
    height: fit-content;
    padding: 10px;
    background-color: rgba(64, 64, 64,1);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    z-index: 100;
}


.nav_btn {
    font-family: "Scada", sans-serif;
    font-size: 1.5rem;
    margin-left: 10px;
    color: rgb(165, 165, 165);
    transition: color 0.2s;
}

.nav_btn:hover {
    color: #ffffff; /* Change color on hover */
}

.login_btn {
    font-family: "Scada";
    font-size: 1.5rem;
    min-width:max-content;
    margin-left: auto;
    display:inline-block;
    height:auto;
    background: #e0e0e0;
    border-radius: 5px;
    color: rgb(163, 163, 163);
    outline:none;
    border:none;
}

.hello-user {
    font-family: 'RetroQuill';
    align-items:center;
    font-size: 1.5rem;
    color: rgb(165, 165, 165);
    margin-left: auto;
    margin-right: 10px;
}


</style>
