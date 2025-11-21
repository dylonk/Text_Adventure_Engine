<script setup>
import { ref, onMounted, defineProps,computed } from 'vue';
import { useRouter } from 'vue-router';
import {fetchUserData} from '@/components/standardjs/fetchUserData'
import wizardPfp from '@/assets/Images/wizardpfp.png';

const loggedIn = computed(() => !!displayUsername.value);//if it's displaying the username, it means you're logged in.
const props = defineProps({
    warnOnExit: false,
})


// Reactive state to store the username
const displayUsername = ref('');
const profileImage = ref('');
const allDataLoaded = ref(false); // this is so the v-if logged ins dont dissappear briefly when a new page loads, rather no navbar until all data is loaded



// Function to fetch the user's username
async function refreshUserData() {
    displayUsername.value = await fetchUserData('username');
    profileImage.value = await fetchUserData('profileImage');
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
            <RouterLink class="nav_btn" to="/about" active-class="active">Download</RouterLink>
            <div style="display:flex; width:fit-content; margin-left:auto; align-items: center;   flex-shrink: 0;">
                <div v-if="displayUsername" style="display: flex; align-items: center; gap: 10px;">
                    <RouterLink to="/user" class="hello-user">{{ displayUsername || "userError" }}</RouterLink>
                    <RouterLink to="/user" class="profile-picture-link">
                        <img 
                            :src="profileImage && profileImage != '' ? profileImage : wizardPfp" 
                            alt="Profile Picture" 
                            class="profile-picture"
                        />
                    </RouterLink>
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
    padding: 0.625rem;
    background-color: #182030;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    z-index: 100;
}


.nav_btn {
    font-family: "Scada", sans-serif;
    font-size: 1.5rem;
    margin-left: 0.625rem;
    color: rgb(212, 218, 222);
}

.nav_btn:hover {
    color: #ffffff; /* Change color on hover */
    text-decoration: underline;
}

.login_btn {
    font-family: "Scada";
    font-size: 1.25rem;
    font-weight: 400;
    min-width:max-content;
    padding:0.3rem 0.5rem;
    margin-left: auto;
    display:inline-block;
    height:auto;
    background:rgb(37, 121, 204);
    border-radius: 5px;
    color: rgb(255, 255, 255);
    outline:none;
    border:none;
}
.login_btn:hover{
    background:rgb(94, 123, 240);
}
.hello-user {
    font-family: 'RetroQuill';
    align-items:center;
    font-size: 1.5rem;
    color: rgb(212, 218, 222);
    margin-left: auto;
    margin-right: 0.25rem;
}
.hello-user:hover{
    text-decoration: underline;
}

.profile-picture-link {
    display: inline-block;
    cursor: pointer;
}

.profile-picture-link:hover {
    transform: scale(1.1);
}

.profile-picture {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
    background:rgb(206, 203, 21);
    border: 2px solid rgb(206, 203, 21);
    display: block;
}
@media (max-width: 768px) {
    .hello-user{
        display:none;
    }
}

</style>
