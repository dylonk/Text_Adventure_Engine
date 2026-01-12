<script setup>
import { ref, onMounted, defineProps,computed } from 'vue';
import { useRouter } from 'vue-router';
import {fetchUserData} from '@/components/standardjs/fetchUserData'
import wizardPfp from '@/assets/Images/wizardpfp.png';
import swordHilt from '@/assets/Images/selectionSword/selectionSwordHilt.png';
import swordCenter from '@/assets/Images/selectionSword/selectionSwordCenter.png';
import swordTip from '@/assets/Images/selectionSword/selectionSwordTip.png';

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
            <RouterLink class="nav_btn" to="/" active-class="active">
                <span>Home</span>
                <div class="sword-container">
                    <div class="sword-hilt"></div>
                    <div class="sword-raised"></div>
                    <div class="sword-raised-right"></div>
                    <div class="sword-tip"></div>
                </div>
            </RouterLink>
            <RouterLink class="nav_btn" to="/explore" active-class="active">
                <span>Explore</span>
                <div class="sword-container">
                    <div class="sword-hilt"></div>
                    <div class="sword-raised"></div>
                    <div class="sword-raised-right"></div>
                    <div class="sword-tip"></div>
                </div>
            </RouterLink> 
            <RouterLink class="nav_btn" to="/project" active-class="active" v-if="loggedIn">
                <span>Create</span>
                <div class="sword-container">
                    <div class="sword-hilt"></div>
                    <div class="sword-raised"></div>
                    <div class="sword-raised-right"></div>
                    <div class="sword-tip"></div>
                </div>
            </RouterLink><!-- I think they should be rendered conditionally-->
            <RouterLink class="nav_btn" to="/about" active-class="active">
                <span>Download</span>
                <div class="sword-container">
                    <div class="sword-hilt"></div>
                    <div class="sword-raised"></div>
                    <div class="sword-raised-right"></div>
                    <div class="sword-tip"></div>
                </div>
            </RouterLink>
            <div style="display:flex; width:fit-content; margin-left:auto; align-items: center;   flex-shrink: 0;">
                <div v-if="displayUsername" style="display: flex; align-items: center; gap: 10px;">
                    <RouterLink to="/user" class="hello-user">
                        {{ displayUsername || "userError" }}
                        <div class="sword-container">
                            <div class="sword-hilt"></div>
                            <div class="sword-raised"></div>
                            <div class="sword-raised-right"></div>
                            <div class="sword-tip"></div>
                        </div>
                    </RouterLink>
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
@import 'https://fonts.googleapis.com/css2?family=Cascadia+Mono&display=swap';

.navbar {
    position:sticky;
    display: flex;
    align-items: center;
    overflow-x: visible;
    overflow-y: visible;
    align-self: flex-start;
    top: 0;
    width: 100vw;
    height: 4rem;
    padding: 0.625rem;
    padding-left: 2rem; /* Extra padding on left to accommodate hilt */
    background-color: #181818;
    font-family: 'Arial', Helvetica, sans-serif;
    font-weight: bold;
    z-index: 100;
}


.nav_btn {
    font-family: 'RetroQuill';
    font-size: 1.5rem;
    margin-left: 1rem;
    height:min-content;
    color: #cfcfcf;
    line-height: 0;
    display: flex;
    align-items: center;
    position: relative;
    text-decoration: none;
    transition: none;
    text-shadow: 
        -2px -2px 0 #181818,
        2px -2px 0 #181818,
        -2px 2px 0 #181818,
        2px 2px 0 #181818,
        0 -2px 0 #181818,
        0 2px 0 #181818,
        -2px 0 0 #181818,
        2px 0 0 #181818,
        -1px -1px 0 #181818,
        1px -1px 0 #181818,
        -1px 1px 0 #181818,
        1px 1px 0 #181818; /* Thicker black outline on all sides */
}

.nav_btn span {
    position: relative;
    z-index: 2; /* Ensure text content appears above sword pseudo-elements */
}

.nav_btn:hover {
    color: #ffffff; /* Change color on hover */
    transform: translateY(-0.125rem); /* Raise button slightly */
}

/* Sword container with flex layout */
.sword-container {
    display: none;
    position: absolute;
    bottom: -1.375rem;
    left: 0;
    right: 0;
    height: 1rem;
    align-items: flex-end;
    pointer-events: none;
    z-index: 0;
    background-image: url('@/assets/Images/selectionSword/selectionSwordCenter.png');
    background-repeat: repeat-x;
    background-position: left bottom;
    background-size: auto 1rem;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
}

.nav_btn:hover .sword-container {
    display: flex;
}

.hello-user:hover .sword-container {
    display: flex;
}

.sword-hilt {
    width: 1rem;
    height: 1rem;
    background-image: url('@/assets/Images/selectionSword/selectionSwordHilt.png');
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: contain;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    flex-shrink: 0;
    z-index: 1;
}

.sword-raised {
    width:12.5%;
    height: 1rem;
    background-image: url('@/assets/Images/selectionSword/selectionSwordRaised.png');
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: 100% 1rem;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    flex-shrink: 0;
    z-index: 1;
}

.sword-raised-right {
    margin-left: auto;
    width:37.5%;
    height: 1rem;
    background-image: url('@/assets/Images/selectionSword/selectionSwordRaised.png');
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: 100% 1rem;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    flex-shrink: 0;
    z-index: 1;
}

.sword-tip {
    position: absolute;
    right: 0;
    height: 1rem;
    width: auto;
    min-width: 1rem;
    background-image: url('@/assets/Images/selectionSword/selectionSwordTip.png');
    background-repeat: no-repeat;
    background-position: right bottom;
    background-size: auto 1rem;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    flex-shrink: 0;
    z-index: 1;
}

.login_btn {
    font-family: "Scada";
    font-size: 1.25rem;
    font-weight: 400;
    padding:0.3rem 0.75rem;
    margin-left: auto;
    margin-right:0.75;
    display:inline-block;
    height:auto;
    border: solid white 1px;
    border-radius: 5px;
    color: rgb(255, 255, 255);
    outline:none;
}
.login_btn:hover{
    background:rgb(90, 97, 131);
}
.hello-user {
    font-family: 'RetroQuill';
    align-items:center;
    font-size: 1.5rem;
    color: #cfcfcf;
    margin-left: auto;
    margin-right: 0.25rem;
    line-height: 0;
    display: flex;
    position: relative;
    text-decoration: none;
    transition: none;
    text-shadow: 
        -2px -2px 0 #181818,
        2px -2px 0 #181818,
        -2px 2px 0 #181818,
        2px 2px 0 #181818,
        0 -2px 0 #181818,
        0 2px 0 #181818,
        -2px 0 0 #181818,
        2px 0 0 #181818,
        -1px -1px 0 #181818,
        1px -1px 0 #181818,
        -1px 1px 0 #181818,
        1px 1px 0 #181818; /* Thicker black outline on all sides */
}
.hello-user:hover{
    color: #ffffff;
    text-decoration: none;
    transform: translateY(-0.125rem); /* Raise button slightly */
}

.profile-picture-link {
    display: inline-block;
    transition: all 400ms;
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
    display: block;
}
@media (max-width: 768px) {
    .hello-user{
        display:none;
    }
}

</style>
