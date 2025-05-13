<script setup>
import { ref, onMounted } from 'vue';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import globalNavBar from '@/components/standardjs/navbar.vue';
import wizardPfp from '@/assets/Images/wizardpfp.png';
import loadCircle from '@/assets/Images/loading.gif';
import { fetchUserData } from '@/components/standardjs/fetchUserData';
import { HContainer } from '../editor/nodes/node_assets/n-component-imports';
import { useRouter } from 'vue-router';
import axios from 'axios';
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

    try {
        const token = localStorage.getItem('token');  // Get the token from localStorage
        axios.post(`${API_BASE_URL}/games/delete`, {id:gameId}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
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
// Fetch user profile when the component is mounted
const isMounted = ref(false);

onMounted(async() => {
        username.value = await fetchUserData('username');
        currentPassword.value = await fetchUserData('password');
        email.value = await fetchUserData('email');
        profileImage.value = await fetchUserData('profileImage');
        isMounted.value = true;        
        fetchMyGames(); 
});
</script>
<template>
    <div class="profile-container">
        <globalNavBar/>
        <div class="profile-content">
            <div class="profile-picture-container">
                    <img v-if="!isMounted" :src="loadCircle"  style="width:20%; height:20%; position: relative; top:38%; left:38%;" alt="Profile Picture">
                    <img v-else-if="profileImage!=''&&profileImage!=null" :src="profileImage" alt="Profile Picture" />
                    <img v-else :src="wizardPfp" alt="Profile Picture" />

                </div>
            <div class="profile-header">

                <h1>Profile Settings</h1>
            </div>
            <div class="profile-info">
                
                <div class="form-group">
                    <label for="profile-image-url">Profile Image URL</label>

                    <HContainer>
                    <input type="text" id="profile-image-url" v-model="profileImageField" placeholder="Enter image URL" />
                    <button @click="updatePFP">Update PFP</button>
                    </HContainer>
                </div>
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="username" />
                </div>  
                <div class="form-group">
                    <label for="email">Email</label>
                    <!-- Displaying the email instead of an input box -->
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
                <div class="form-group">
                    <button @click="saveProfile">Save Profile</button>
                </div>
            </div>
     <div class="user-games">
      <h2 class="section-title">Your Games</h2>
      <div class="games-grid">
        <div 
          v-for="game in myGames" 
          :key="game.id" 
          class="game-box"
        >
          <div class="game-title">{{ game.title }}</div>
          <img :src="game.thumbnail" alt="Game image" class="game-image" />
          <div class="game-actions">
            <button class="action-button" @click="openGame(game.title)">Play</button>
            <button class="action-button delete" @click="deleteGame(game.id)">Delete</button>
          </div>
        </div>
      </div>
    </div> 
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pixelify Sans', sans-serif;
}

body {
    background-color: #181818;
    color: #f1f1f1;
}

.profile-container{
    background:#181818;
    flex:1;
}

.profile-content {
    width: 50%; /* Keep the content half the page */
    margin: 0 auto; /* Center the content horizontally */
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.profile-header {
    text-align: center; /* Center the content of the header */
    margin-bottom: 2rem;
    border-bottom: 3px solid #f1f1f1;
    padding-bottom: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center; /* Center elements within the header */
}

.profile-picture-container {
    width: 300px;
    height: 300px;
    overflow: hidden;
    border-radius: 0;
    margin: 0 auto 1rem; /* Center the avatar */
    margin-top: 15px;
    border: 3px solid #f1f1f1;
    background:rgb(25, 51, 184);
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
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: #181818;
    border: 2px solid #f1f1f1;
    padding: 10px;
}

.form-group label {
    font-weight: bold;
    font-size: 14px;
}

/* New style for email display */
.email-display {
    padding: 10px;
    border: 2px solid #181818;
    background-color: #f1f1f1;
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
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: bold;
    font-size: 14px;
}

.form-group button:hover {
    background-color: #f1f1f1;
    color: #181818;
}

/* Avatar Modal Styles */
.avatar-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-modal-content {
    background-color: #181818;
    padding: 20px;
    border: 5px solid #f1f1f1;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #f1f1f1;
}

.avatar-modal-content::-webkit-scrollbar {
    width: 12px;
}

.avatar-modal-content::-webkit-scrollbar-track {
    background: #181818;
    border: 3px solid #f1f1f1;
}

.avatar-modal-content::-webkit-scrollbar-thumb {
    background: #f1f1f1;
    border: 3px solid #181818;
    cursor: pointer;
}

.avatars-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px 0;
    width: 100%;
}

.avatar-item {
    cursor: pointer;
    border: 2px solid #f1f1f1;
    padding: 5px;
    transition: background-color 0.2s;
}

.avatar-item img {
    width: 100%;
    height: 80px;
    object-fit: cover;
}

.avatar-item:hover {
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










.my-games {
  background: rgba(44, 47, 51, 0.9);
  border: 2px solid #e0e0e0;
  box-shadow: 6px 6px 0 #000;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  width: 70%;
  margin-top: 50px;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #e0e0e0;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.game-box {
  background: #e74c3c;
  border: 2px solid #e0e0e0;
  box-shadow: 4px 4px 0 #000;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.game-box:hover {
  transform: translateY(-5px);
  box-shadow: 6px 6px 0 #000;
}

.game-title {
  font-size: 1rem;
  margin-bottom: 10px;
  padding: 6px;
  background: #c0392b;
  color: #fff;
  border: 2px solid #e0e0e0;
  box-shadow: 2px 2px 0 #000;
}

.game-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border: 2px solid #e0e0e0;
  box-shadow: inset 2px 2px 0 #000;
}

.game-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}

.action-button {
  font-size: 0.9rem;
  padding: 5px 10px;
  border: 2px solid white;
  background: #c0392b;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 2px 2px 0 #000;
}
</style>
