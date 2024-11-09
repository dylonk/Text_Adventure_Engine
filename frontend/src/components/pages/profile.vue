<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'

function goToProfile() {
      this.$router.push('/user')
}
</script>
<template>
    <div class="profile-container">
        <globalNavBar/>
        <div class="profile-sidebar">
                <div class="profile-side-btn">User Profile</div>
                <hr>
                <div class="profile-side-btn">Settings</div>
                <hr>
                <button>Log Out</button>
        </div>
    </div>
</template>

<style scoped>
.profile-container{
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction: column;
}
.profile-sidebar{
    color:rgb(165, 165, 165);
    font-size: larger;
    background:rgb(255, 255, 255);
    height:100%;
    display:flex;
    width:max-content;
    overflow:scroll;
    flex-direction:column;
}
hr{
    border-color:rgb(190, 190, 190);
}
.profile-side-btn{
    padding:10px;
}
.profile-sidebar>button{
    padding:10px;
    margin-top:auto;
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


</style>