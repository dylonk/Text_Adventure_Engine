<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'

function goToProfile() {
      this.$router.push('/user')
}
</script>
<template>
    <globalNavBar/>
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
<style scoped>
h1 {
    font-size: 36px;
    border-bottom: 2px solid black;
    padding: 10%;
    padding-top: 0;
    padding-bottom: 0;
}

button {
    position: absolute;
    right: 1%;
    transform: scale(120%, 120%);
}

#user-infobox {
    font-size: 24px;
    border: 2px solid black;
    width: min-content;
    padding: 20px;
    padding-top: 10px;
    bottom: 1%;
}

#user-info {
    position: relative;
    display: flex;
    flex-direction: column;
}

.nickname {
    position: relative;
    margin-top: 5%;
}

.account-stats {
    position: relative;
    margin-top: 15%;
}

.account-stat1 {
    padding-bottom: 10px;
}

.account-stat2 {
    padding-bottom: 10px;
}

.account-stat3 {
    padding-bottom: 10px;
}
</style>