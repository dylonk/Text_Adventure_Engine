<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'

function goToProfile() {
      this.$router.push('/user')
}
</script>
<template>
    <globalNavBar/>
    <h1>Welcome to Your Dashboard</h1>
    <div id="user-infobox">
        <div id="user-info">
            <div class="profile-name">*Name*</div>
            <div class="nickname">*Optional Nickname*</div>
            <div class="account-stats">
                <div class="account-stat1">*Other Account Stats - 1*</div>
                <div class="account-stat2">*Other Account Stats - 2*</div>
                <div class="account-stat3">*Other Account Stats - 3*</div>
            </div>
        </div>
    </div>
    <button id="logout-button">Log Out</button>
</template>
<style>
@import '../../CSS/profile.css';
</style>