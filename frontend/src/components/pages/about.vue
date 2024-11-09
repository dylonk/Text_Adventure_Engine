<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'

function goToAbout() {
      this.$router.push('/about')
}
</script>
<template>
<body>
    <globalNavBar/>
    <div id="content">
        <div id="title">
            <p>MagiQuill is a site based around text adventure games.</p>
        </div>
        <div id="about-text">
        <p>It includes free, web-based tools to play or create text adventure games as well as the ability to export games to standalone versions.</p>
        </div>
        <div id="about-text">
            <p>Additional Features Go Here.</p>
        </div>
        <div id="about-text">
            <p>Some can go here too.</p>
        </div>
        <div id="credits">
            <p>Created by:</p>
            <div id="creditsNames">
                <p>Timothy Erbert, Jean Affa, Carson Viator, Dylan Snyder, Kyle Youngquist</p>
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

#content {
    font-size: 24px;
    text-align: center;
}

#title {
    color:white;
    font-size: 48px;
    margin-top: 5%;
}

#about-text{
    color:rgb(172, 172, 172);
    margin-top: 5%;
}

#credits {
    position: fixed;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 100%;
    background-color: rgba(128, 128, 128, 0.534);
}

#creditsNames p {
    margin-top: 0px;
    display: inline-block;
}

</style>