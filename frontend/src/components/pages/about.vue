<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'

function goToAbout() {
      this.$router.push('/about')
}
</script>
<template>
<body>
    <globalNavBar/>
    <div class="content">
    <div class="text-container">
        <div id="title">
            <p>Forge your next adventure with MagiQuill!</p>
        </div>
        <div id="about-text">
        <p>MagiQuill is a web based app focused on the creation and sharing of text based adventures</p>
        </div>
        <div id="about-text">
            <p>Construct your adventure visually with nodes in our comprehensive editing suite and export your game as a standalone project</p>
        </div>
        <div id="about-text">
            <p>Play from a wide variety of user generated adventures</p>
        </div>
        <div id="credits">
            <p>Created by:</p>
            <div id="creditsNames">
                <p>Timothy Erbert, Jean Affa, Carson Viator, Dylan Snyder, Kyle Youngquist</p>
            </div>
        </div>
</div>
    </div>

</body>
</template>

<style scoped>
@import 'https://fonts.googleapis.com/css?family=Pixelify Sans';

*{
    font-family: 'Pixelify Sans';
}


.content {
    height:100%;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    text-align: center;
    backdrop-filter:blur(8px);
    background-image:url(https://i.pinimg.com/564x/b0/2a/04/b02a04ffa8cd69e58435d7da7cae7979.jpg);
    background-size: cover;
}

.text-container{
    height:100%;
    width:100%;
        backdrop-filter:blur(4px);
}


#title {
    color:white;
    font-size: 48px;
    margin-top: 5%;
}

#about-text{
    color:rgb(255, 255, 255);
    margin:2.5%;
}

#credits {
    color:rgb(255, 255, 255);
    margin-top:auto;
    margin-bottom:20%;
    text-align:center;
    width: 100%;
}

#creditsNames p {

    margin-top: 0px;
    display: inline-block;
}

</style>