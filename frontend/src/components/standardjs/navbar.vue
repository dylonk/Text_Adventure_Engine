<script setup>

</script>


<template>
            <p class="navbar">
                <RouterLink to="/" active-class="active">Home</RouterLink>
                <RouterLink to="/explore" active-class="active">Explore</RouterLink>
                <RouterLink to="/create" active-class="active">Create</RouterLink>
                <RouterLink to="/user" active-class="active">Profile</RouterLink>
                <RouterLink to="/about" active-class="active">About</RouterLink>
                <RouterLink to="/auth" active-class="active">Login</RouterLink>
            </p>
</template>
<style>
    @import 'https://fonts.googleapis.com/css?family=Pixelify Sans';

            body{
                margin:0px;
            }
            .navbar{
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
            p.navbar>a{

                font-family: 'Pixelify Sans';font-size: 22px;
                margin:5px;
                height:calc(min-content+10px);
                color:rgb(237, 181, 155);
            }

</style>