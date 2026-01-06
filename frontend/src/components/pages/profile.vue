<script setup>
import { ref, onMounted, inject } from 'vue';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import wizardPfp from '@/assets/Images/wizardpfp.png';
import loadCircle from '@/assets/Images/loading.gif';
import { fetchUserData } from '@/components/standardjs/fetchUserData';
import { HContainer } from '../editor/nodes/node_assets/n-component-imports';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Inject the refresh function from App.vue
const refreshNavbar = inject('refreshNavbar', null);
const username = ref('Felix');  // I  'Felix' as the default username for the avatar nothing to do with anyones name
const showChangePassword = ref(false);
const currentPassword = ref('defaultPassword');
const profileImage = ref("")
const profileImageField = ref("")
const newPassword = ref('');
const confirmNewPassword = ref('');
const email=ref('');
const showAvatarModal = ref(false); // Modal state for changing avatars
const selectedAvatar = ref('Felix');
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite
const myGames = ref([]);
const userID=ref('');
const router = useRouter();
const activeTab = ref('user'); // Track which tab is active: 'user', 'games', 'settings'


async function fetchMyGames() {
    try {
        userID.value=await fetchUserData("_id");    //gets your id
        const response = await axios.get(`${API_BASE_URL}/games/?userId=${userID.value}`);//response is any games that mtch the userid
        myGames.value = response.data.map(game => ({
        id: game.id,
        title: game.title,
        thumbnail: game.thumbnail
        }));
    } catch (error) {
        console.warn('Error fetching games:', error);
    }
}

//deletes the game from the backend. Probably want to add a confirmation.
async function deleteGame(gameId) {
    // Prompt user for confirmation before deleting
    if (!confirm("Are you sure you would like to delete this work? It cannot be recovered.")) {
        return; // User cancelled the deletion
    }

    try {
        const token = localStorage.getItem('token');  // Get the token from localStorage
        await axios.post(`${API_BASE_URL}/games/delete`, {id:gameId}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        // Refresh the games list after successful deletion
        fetchMyGames();
    }
    catch (error) {
        console.error('Error deleting game:', error);
    }
}

//we open games by title to make the links pretty. 
async function openGame(title) {
    router.push('/game/' + title);//takes you to the player screen
};


// Function to change the password
async function changePassword() {

try {
    const token = localStorage.getItem('token');  // Get the token from localStorage
    const response = await fetch(`${API_BASE_URL}/auth/changePassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            currentPassword: currentPassword.value,
            newPassword: newPassword.value,
            confirmNewPassword: confirmNewPassword.value
        })
    });

    if (response.ok) {
        console.log('password updated successfully');
    } else {
        console.error('Failed to update password');
    }
} catch (error) {
    console.error('Error updating password:', error);
}
}


// Function to save the profile
async function saveProfile() {

    try {
        const token = localStorage.getItem('token');  // Get the token from localStorage
        const response = await fetch(`${API_BASE_URL}/auth/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                profileImage: profileImage.value
            })
        });

        if (response.ok) {

            console.log('Profile updated successfully, profile info image=', profileImage.value);
            Toastify({
                text: "Profile successfully updated!",
                duration: 3000,
                gravity: 'top',
                position: 'right',
                backgroundColor: '#27ae60',// Green for success, Red for error
                stopOnFocus: true,
            }).showToast();
        } else {
            console.error('Failed to update profile');
            Toastify({
                text: "Failed to update profile!",
                duration: 3000,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'red',// Green for success, Red for error
                stopOnFocus: true,
            }).showToast();
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
    }

// Function to change avatar
function selectAvatar(seed) {
    selectedAvatar.value = seed;
    showAvatarModal.value = false;
}
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function updatePFP(){
    if (isValidURL(profileImageField.value)) {
    profileImage.value = profileImageField.value;
  } else {
    alert("Invalid image URL");
  }
}

// Function to log out the user
function logOut() {
    localStorage.removeItem('token'); // Remove token from localStorage
    // Refresh the navbar before navigating
    if (refreshNavbar) {
        refreshNavbar();
    }
    router.push('/auth'); // Redirect to the login page
}
// Fetch user profile when the component is mounted
const isMounted = ref(false);
const isLoggedIn = ref(false);

onMounted(async() => {
        const fetchedUsername = await fetchUserData('username');
        if (fetchedUsername) {
            isLoggedIn.value = true;
            username.value = fetchedUsername;
            currentPassword.value = await fetchUserData('password');
            email.value = await fetchUserData('email');
            profileImage.value = await fetchUserData('profileImage');
            fetchMyGames();
        } else {
            // User is not logged in - clear token and redirect to login
            localStorage.removeItem('token');
            if (refreshNavbar) {
                refreshNavbar();
            }
            router.push('/auth');
        }
        isMounted.value = true;
});
</script>
<template>
    <div class="profile-container">
        <div class="profile-navigator">
            <h3>Profile</h3>
            <hr></hr>
            <nav class="nav-menu">
                <button 
                    class="nav-item" 
                    :class="{ active: activeTab === 'user' }"
                    @click="activeTab = 'user'"
                >
                    User
                </button>
                <button 
                    class="nav-item" 
                    :class="{ active: activeTab === 'games' }"
                    @click="activeTab = 'games'"
                >
                    My Games
                </button>
                <!-- <button 
                    class="nav-item" 
                    :class="{ active: activeTab === 'settings' }"
                    @click="activeTab = 'settings'"
                >
                    Settings
                </button> -->
                <button @click="logOut" class="nav-item logout">Log Out</button>

            </nav>
        </div>
        <div class="profile-content">
            <!-- User Page -->
            <div v-if="activeTab === 'user'" class="tab-content">
                <div class="profile-header">
                    <h1>Profile Settings</h1>
                </div>
                <div class="profile-picture-container" v-if="isLoggedIn">
                    <img v-if="!isMounted" :src="loadCircle"  style="width:20%; height:20%; position: relative; top:38%; left:38%;" alt="Profile Picture">
                    <img v-else-if="profileImage!=''&&profileImage!=null" :src="profileImage" alt="Profile Picture" />
                    <img v-else :src="wizardPfp" alt="Profile Picture" />
                </div>

                <div class="profile-info" v-if="isLoggedIn">
                    <div class="form-group">
                        <label for="profile-image-url">Profile Image URL</label>
                        <HContainer>
                            <input type="text" id="profile-image-url" v-model="profileImageField" placeholder="Enter image URL" />
                            <button @click="updatePFP">Save Image</button>
                        </HContainer>
                    </div>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input style="max-width:30rem;" type="text" id="username" v-model="username" />
                    </div>  
                    <div class="form-group">
                        <label for="email">Email</label>
                        <div class="email-display">{{ email }}</div>
                    </div>
                    <div class="form-group">
                        <button @click="showChangePassword = true">Change Password</button>
                    </div>
                    <div class="form-group" v-if="showChangePassword">
                        <label for="current-password">Current Password</label>
                        <input type="password" id="current-password" v-model="currentPassword" />
                        <label for="new-password">New Password</label>
                        <input type="password" id="new-password" v-model="newPassword" />
                        <label for="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" v-model="confirmNewPassword" />
                        <button @click="changePassword">Update Password</button>
                    </div>
                    <div class="form-group" v-if="isLoggedIn">
                        <button @click="saveProfile">Save Profile</button>
                    </div>
                </div>
                <div v-else class="not-logged-in-message">
                    <p>Please log in to view and edit your profile.</p>
                </div>
            </div>

            <!-- My Games Page -->
            <div v-if="activeTab === 'games'" class="tab-content">
                <div class="profile-header">
                    <h1>My Published Games</h1>
                </div>
                <hr style="border-color:black;">
                <div class="user-games" v-if="isLoggedIn">
                    <div class="games-grid">
                        <div 
                            v-for="game in myGames" 
                            :key="game.id" 
                            class="game-box"
                        >
                            <div class="game-title">{{ game.title }}</div>
                            <div class="game-image-container">
                                <img :src="game.thumbnail" alt="Game image" class="game-image" />
                            </div>
                            <div class="game-actions">
                                <button class="action-button" @click="openGame(game.title)">Play</button>
                                <button class="action-button delete" @click="deleteGame(game.id)">Delete</button>
                            </div>
                        </div>
                    </div>
                    <div v-if="myGames.length === 0" class="no-games-message">
                        <p>You haven't published any games yet.</p>
                    </div>
                </div>
                <div v-else class="not-logged-in-message">
                    <p>Please log in to view your games.</p>
                </div>
            </div>

            <!-- Settings Page -->
            <div v-if="activeTab === 'settings'" class="tab-content">
                <div class="profile-header">
                    <h1>Settings</h1>
                </div>
                <div class="settings-content" v-if="isLoggedIn">
                    <p>Settings page coming soon...</p>
                </div>
                <div v-else class="not-logged-in-message">
                    <p>Please log in to access settings.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
body {
    background-color: #ffffff;
    color: #000000;
}

.profile-container{
    background:#dbdbdb;
    flex:1;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
}

.profile-navigator {
    width: 250px;
    background: #f1f1f1;
    border-right: 1px solid #dbdbdb;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    position: sticky;
    top: 0;
    overflow-y: auto;
    justify-content: center;
    z-index: 10;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0 10px;
}

.nav-item {
    padding: 15px 20px;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 1rem;
    color: #000000;
    transition: box-shadow 0.2s, background 0.2s;
    border-radius: 4px;
    font-weight: normal;
}
.logout{
    color:red;
}
.nav-item:hover {
    background: #dbdbdb;
    color: #000000;
}

.nav-item.active {
    background: #181818;
    color: #f1f1f1;
    text-shadow: 0px 0px 1px #f1f1f1;
}

.nav-footer {
    padding: 20px 10px;
    border-top: 2px solid #dbdbdb;
}

.nav-logout-btn {
    width: 100%;
    padding: 15px 20px;
    background-color: #d4292e;
    color: #ffffff;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 4px;
}

.nav-logout-btn:hover {
    background-color: #b0201f;
    color: #ffffff;
}

.nav-login-btn {
    width: 100%;
    padding: 15px 20px;
    background-color: #27ae60;
    color: #ffffff;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 4px;
}

.nav-login-btn:hover {
    background-color: #229954;
    color: #ffffff;
}

.profile-content {
    flex: 1;
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

/* Responsive styles for mobile */
@media (max-width: 768px) {
    .profile-container {
        flex-direction: column;
    }
    
    .profile-navigator {
        width: 100%;
        position: sticky;
        top: 0;
        border-right: none;
        border-bottom: 1px solid #dbdbdb;
        padding: 10px 0;
        height: auto;
        overflow-x: auto;
        overflow-y: visible;
    }
    
    .profile-navigator h3 {
        display: none;
    }
    
    .profile-navigator hr {
        display: none;
    }
    
    .nav-menu {
        flex-direction: row;
        gap: 5px;
        padding: 0 10px;
        overflow-x: auto;
        overflow-y: visible;
        white-space: nowrap;
        align-items: center;
    }
    
    .nav-item {
        padding: 10px 15px;
        text-align: center;
        white-space: nowrap;
        flex-shrink: 0;
        font-size: 0.9rem;
    }
    
    .nav-item.logout {
        margin-left: auto;
    }
    
    .profile-content {
        width: 100%;
        padding: 20px;
    }
}

.tab-content {
    width: 100%;
    max-width: 80rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
}

.profile-header {
    text-align: center; /* Center the content of the header */
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center; /* Center elements within the header */
}
.profile-header h1{
    width:100%;
    color:black;
    font-weight:600;
    text-align: left;
}

.profile-picture-container {
    width: 20rem;
    height: 20rem;
    overflow: hidden;
    border-radius: 20rem;
    border: 6px solid rgb(255, 255, 255);
    margin: 0 0 1rem; /* Center the avatar */
    margin-top: 15px;
    background:rgb(0, 0, 0);
}


.profile-picture-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.change-avatar-btn {
    background-color: #f1f1f1;
    color: #181818;
    border: 2px solid #f1f1f1;
    cursor: pointer;
    padding: 8px 12px;
    margin-bottom: 20px; /* Space below the button */
    transition: background-color 0.2s;
    font-weight: bold;
    font-size: 14px;
}

.change-avatar-btn:hover {
    background-color: #181818;
    color: #f1f1f1;
}

.profile-info {
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background:  #dbdbdb;
    padding: 10px;
}

.form-group label {
    font-weight: bold;
    color:black;
    font-size: 14px;
}

/* New style for email display */
.email-display {
    padding: 10px;
    color: #000000;
    font-size: 14px;
    font-weight: normal;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 2px solid #181818;
    background-color: #f1f1f1;
    color: #000000;
}

.form-group button {
    padding: 10px;
    background-color: #181818;
    color: #f1f1f1;
    border: 2px solid #f1f1f1;
    width:max-content;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
}

.form-group button:hover {
    background-color: #f1f1f1;
    color: #181818;
}
.close-modal-btn {
    background-color: #f1f1f1;
    color: #181818;
    border: 2px solid #f1f1f1;
    padding: 8px 12px;
    cursor: pointer;
    margin-top: 10px;
}





hr{
    border:none;
    border-bottom: solid #dbdbdb 1px;
    margin-bottom: 8px;
}


h3{
    padding:20px;
}

.user-games {
  background:  #dbdbdb00;
  padding: 25px;
  width: 100%;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #000000;
}

.games-grid {
  width:100%;
  display: grid;
  flex: 1;
  grid-template-columns: repeat(auto-fill, 20rem );
  grid-auto-rows: auto;
  grid-gap: 2rem;
  justify-content: start;
  position: relative;
  box-sizing: border-box;
  z-index: 10; /* Ensure games appear above clouds */
  overflow-y: visible;
  min-height: fit-content;
}

.game-box {
  background: #ffffff;
  width:20rem;
  height:23rem;
  border-radius: 0.25rem;
  padding: 12px;
  text-align: center;
  box-shadow: 2px 2px 5px rgba(36, 29, 29, 0.426),-2px -2px 5px rgba(36, 29, 29, 0.426);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.game-box:hover {
  box-shadow: 2px 2px 5px rgba(36, 29, 29, 0.426),-2px -2px 5px rgba(36, 29, 29, 0.426);
}

.game-title {
  font-size: 1rem;
  font-weight:600;
  text-align: left;
  margin-bottom: 10px;
  line-height: 1.3rem;
  padding: 1/4rem;
  background: #ffffff;
  color: #000000;
  flex-shrink: 0;
  min-height: fit-content;
}

.game-image-container {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
}

.game-image {
  width: 100%;
  max-width: 19rem;
  height: 100%;
  object-fit: cover;
  border-radius:0.5rem;
}

.game-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  flex-shrink: 0;
}

.action-button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  background: #ffffff;
  color: rgb(0, 0, 0);
  border-radius: 2px;
  cursor: pointer;
  transition:  box-shadow 0.2s, background 0.2s;
}
.delete {
  font-size: 1rem;
  padding: 5px 10px;
  border: none;
  background:white;
  color:#d4292e;

  border-radius: 4px;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
}

.action-button:hover {
  background:#dbdbdb;
}
.delete:hover   {
    background: #d4292e;
    color: rgb(255, 255, 255);
}

.logout-btn {
    background-color: #d4292e !important;
    color: #ffffff !important;
}

.logout-btn:hover {
    background-color: #b0201f !important;
    color: #ffffff !important;
}

.login-btn-link {
    text-decoration: none;
    display: block;
}

.login-btn {
    width: 100%;
    background-color: #27ae60 !important;
    color: #ffffff !important;
}

.login-btn:hover {
    background-color: #229954 !important;
    color: #ffffff !important;
}

.not-logged-in-message {
    text-align: center;
    padding: 2rem;
    background: #dbdbdb;
    margin-top: 2rem;
}

.not-logged-in-message p {
    font-size: 1.2rem;
    color: #000000;
}

.no-games-message {
    text-align: center;
    padding: 2rem;
    background: #dbdbdb;
    margin-top: 2rem;
}

.no-games-message p {
    font-size: 1.2rem;
    color: #000000;
}

.settings-content {
    background: #dbdbdb;
    padding: 25px;
    margin-top: 20px;
}

.settings-content p {
    font-size: 1.2rem;
    color: #000000;
    text-align: center;
}
</style>

