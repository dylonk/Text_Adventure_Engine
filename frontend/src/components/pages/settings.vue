
<template>
    <div class="settings-container">
      <h1>Settings</h1>
      <div class="user-profile">
        <h2>User Profile</h2>
        <img :src="user.avatar" alt="User Avatar" class="avatar">
        <p>Username: {{ user.username }}</p>
        <p>Email: {{ user.email }}</p>
        <router-link to="/profile">View Profile</router-link>
      </div>
      </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {
          username: 'Jean Affa',
          email: 'john.doe@example.com',
          avatar: 'https://via.placeholder.com/50'
        }
      }
    }
  }
  </script>
  
  <style>
      @import './settings.css';
  </style>
  