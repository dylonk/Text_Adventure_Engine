<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
function goToHome() {
      this.$router.push('/')
}
</script>

<template>
    <globalNavBar/>
    <form id="section-bar" action="placeholder" method="get">
        <input type="search" name="search-bar" placeholder="SEARCH">
    </form>
    <div class="games-section">
        <div class="game" v-for="i in 12" :key="i"> <!--lOOP FROM BACKEND -->
            <div class="gametitle">Fake Game {{ i }}</div>
            <div class="gamepic"><img src="https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg"> </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap');

#section-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    border-bottom: 2px solid #e0e0e0;
    padding-top: 20px;
    padding-bottom: 20px;
    justify-content: center;
    font-size: 36px;
    background-color: rgba(44, 47, 51, 0.9);
    color: #e0e0e0;
    letter-spacing: 2px;
}

input[type=search] {
    border: 2px solid #e0e0e0;
    padding: 10px;
    width: 40%;
    text-align: center;
    background-color: transparent;
    color: #e0e0e0;
    font-weight: bold;
}

input[type=search]:focus {
    outline: none;
    border-color: #e74c3c;
}

.games-section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);  /* Four items per row */
    gap: 20px;
    margin: 20px;
    justify-content: center;
    width: 100%;
    grid-auto-rows: minmax(250px, auto);  /* Adjust height dynamically */
}

.game {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 28px;
    width: 100%;
    height: 100%;
    background-color: #2c2f33;
    color: #e0e0e0;
    border: 2px solid #e0e0e0;
    margin: 5px;
    padding: 10px;
    position: relative;
    text-transform: uppercase;
    box-shadow: 6px 6px 0 #000;
}

.gametitle {
    font-weight: bold;
    font-size: 20px;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.gamepic img {
    border: 2px solid #e0e0e0;
    width: 150px;
    height: 150px;
    object-fit: cover;
    box-shadow: inset 2px 2px 0 #000;
    filter: brightness(0.85);
}

.game:hover {
    background-color: #e74c3c;
    color: #000;
    box-shadow: 0px 0px 15px rgba(255, 0, 0, 0.5);
    transform: scale(1.1);
    transition: all 0.3s ease-in-out;
}

.gamepic img:hover {
    transform: rotate(15deg);
}
</style>
