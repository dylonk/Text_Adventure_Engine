<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'

function goToAbout() {
      this.$router.push('/about')
}
</script>
<template>
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

</template>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';

*{
    font-family: 'Syne Mono', monospace;
}

.content {
    width: 100vw;
    flex:1;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    text-align: center;
    backdrop-filter:blur(20px);
    background-image:url(https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg);
    background-size: 100% 100%;
}

.text-container{
    height:100%;
    width:100vw;
    backdrop-filter:blur(3px);
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
    text-align:center;
}

#creditsNames p {
    margin-top: 0px;
    display: inline-block;
}

</style>