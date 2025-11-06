<script setup>
import windowsLogo from '@/assets/Images/windows.png'


</script>
<template>
    <div class="content">
    <div class="text-container">
        <div id="title">
            <p>Forge your next adventure with MagiQuill!</p>
        </div>
        <hr style="margin:15px;margin-left:30px;margin-right:30px;color:white;">
        <div id="about-text">
        <p>MagiQuill is a web based app focused on the creation and sharing of text based adventures</p>
        </div>
        <div id="about-text">
            <p>Or play from a wide variety of user generated adventures, or construct your adventure visually with nodes in our comprehensive editing suite and export your game as a standalone project</p>
        </div>
        <div id="about-text">
            <p></p>
        </div>
        <a class="download-container" href=https://github.com/dylonk/Text_Adventure_Engine/releases/download/v1.0.1/Text.Adventure.Electron.Setup.1.0.1.exe download>
            Download the Offline Player for Windows
            <img style="height:36px; position: relative; top:10px; right:-5px" :src="windowsLogo">
        </a>
        <div id="credits" style="margin-top:30px;">
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
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap');
@import 'https://fonts.googleapis.com/css2?family=Hurricane';


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

.download-container{
    font-size:24px;
    color:rgb(255, 255, 255);
    
    background: rgb(18, 21, 95);
    outline:white solid 1px;
    padding:10px;
    border-radius: 5px;
    font-family:'Pixelify Sans';

}

.text-container{
    height:fit-content;

    
    width:60%;
    backdrop-filter:blur(5px);
    border: 2px white solid;
    background:rgba(71, 71, 71, 0.8);
    padding:10px;
    margin:30px;
    filter:blur(0.7)

}


#title {
    color:rgb(255, 255, 255);
    font-family:'Pixelify Sans';
    font-size: 48px;
    margin-top: 10px;
}

#about-text{
    font-family:'Syne Mono';
    font-size: 25px;
    color:rgb(255, 255, 255);
    margin:2.5%;
}

#credits {
    font-size: 25px;
    color:rgb(200, 200, 200);
    margin:2.5%;
}

#creditsNames p {
    margin-top: 0px;
    display: inline-block;
}

</style>