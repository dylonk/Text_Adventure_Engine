<script setup>
import { ref, onMounted } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';
import { fetchUserData } from '@/components/standardjs/fetchUserData';
const username = ref('Felix');  // I  'Felix' as the default username for the avatar nothing to do with anyones name
const showChangePassword = ref(false);
const currentPassword = ref('defaultPassword');
const newPassword = ref('');
const confirmPassword = ref('');
const email=ref('');
const showAvatarModal = ref(false); // Modal state for changing avatars
const selectedAvatar = ref('Felix');



// Function to change the password
async function changePassword() {

try {
    const token = localStorage.getItem('token');  // Get the token from localStorage
    const response = await fetch('http://localhost:5000/auth/changePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            currentPassword: currentPassword.value,
            newPassword: newPassword.value,
            confirmNewPassword: confirmPassword.value
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
        const response = await fetch('http://localhost:5000/auth/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value
            })
        });

        if (response.ok) {
            console.log('Profile updated successfully');
        } else {
            console.error('Failed to update profile');
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

// Fetch user profile when the component is mounted
onMounted(async() => {
        username.value = await fetchUserData('username');
        console.log("fetched username", username.value);
        currentPassword.value = await fetchUserData('password');
        console.log("fetched password", currentPassword.value);
        email.value = await fetchUserData('email');
        console.log("fetched email", email.value);

});
</script>
<template>
    <div class="profile-container">
        <globalNavBar/>
        <div class="profile-content">
            <div class="profile-header">
                <div class="profile-picture-container">
                    <img :src="`https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${selectedAvatar}`" alt="Profile Picture" />
                </div>
                <button class="change-avatar-btn" @click="showAvatarModal = true">Change Avatar</button>
                <h1>Profile Settings</h1>
            </div>
            <div class="profile-info">
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
                    <input type="password" id="confirm-password" v-model="confirmPassword" />
                    <button @click="changePassword">Update Password</button>
                </div>
                <div class="form-group">
                    <button @click="saveProfile">Save Profile</button>
                </div>
            </div>
        </div>

        <!-- Avatar Selection Modal -->
        <div v-if="showAvatarModal" class="avatar-modal">
            <div class="avatar-modal-content">
                <h2>Select Avatar</h2>
                <div class="avatars-grid">
                    <div v-for="seed in ['Felix', 'Max', 'Charlie', 'Luna', 'Milo', 'Oscar', 'Bella', 'Daisy', 'Toby']"
                         :key="seed"
                         class="avatar-item"
                         @click="selectAvatar(seed)">
                        <img :src="`https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${seed}`" :alt="seed" />
                    </div>
                </div>
                <button class="close-modal-btn" @click="showAvatarModal = false">Close</button>
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
    height: 100dvh;
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
    width: 150px;
    height: 150px;
    overflow: hidden;
    border-radius: 0;
    margin: 0 auto 1rem; /* Center the avatar */
    margin-top: 15px;
    border: 3px solid #f1f1f1;
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
</style>
