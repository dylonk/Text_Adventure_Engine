<script setup>

</script>


<template>
            <p class="navbar">
                <RouterLink class="nav_btn" to="/" active-class="active">Home</RouterLink>
                <RouterLink class="nav_btn" to="/explore" active-class="active">Explore</RouterLink>
                <RouterLink class="nav_btn" to="/create" active-class="active">Create</RouterLink>
                <RouterLink class="nav_btn" to="/user" active-class="active">Profile</RouterLink>
                <RouterLink class="nav_btn"to="/about" active-class="active">About</RouterLink>
                <RouterLink class="login_btn" to="/auth" active-class="active">Login</RouterLink>
            </p>
</template>
<style>
    @import 'https://fonts.googleapis.com/css?family=Pixelify Sans';

            body{
                margin:0px;
            }
            .navbar{
                display:flex;
                margin-top:0;
                position:sticky;
                width:100vw;
                height:min-content;
                padding:10px 0px;
                background-color:rgb(64, 64, 64);
                min-height: max-content;
                font-family: Arial, Helvetica, sans-serif;
                font-weight:bold;
            }
            .nav_btn{
                font-family: 'Pixelify Sans';font-size: 22px;
                height:calc(min-content+10px);
                margin-left:10px;
                color:rgb(237, 181, 155);
            }
            .login_btn{
                font-family: 'Pixelify Sans';font-size: 22px;
                height:calc(min-content+10px);
                margin-left:10px;
                margin-left:auto;
                margin-right:10px;
                background: rgb(255, 255, 255);
                border-radius: 5px;
                color:rgb(164, 143, 255);
            }

</style>