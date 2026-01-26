<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Components and assets
import explorer from '@/assets/Images/defaultgameimage.jpg';
import splashpond from '@/assets/Images/splashpond.png';

const explorerImage = ref(explorer)

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const games = ref([]);

const fetchGames = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/games/`);
    games.value = response.data.map(game => ({
      id: game.id,
      title: game.title,
      thumbnail: game.thumbnail
    }));

    games.value.push({
      id: 'more',
      title: 'More Games?',
      image: explorer // or use static path string idk
    });
  } catch (error) {
    console.warn('Error fetching games:', error);
  }
};

function onGameClick(index) {
  const game = games.value[index];
  if (game.title === 'More Games?') {
    router.push('/explore');
  } else {
    router.push(`/game/${game.title}`);
  }
}

function goToExplore() {
  router.push('/explore');
}

onMounted(fetchGames);
</script>

<template>
  <div id="home-container">
    <div id="hero">
          <img class="splashpond-image" :src="splashpond" alt="Splash Pond" />
          <h1 class="hero-title">><a>MagiQuill</a>, a browser based text adventure engine and social platform</h1>
        </div>
      <div class="main-grid">
      <!-- Left Grid: Hero Section -->


      <!-- Right Grid: Popular Games Section -->
      <div class="popular-games-container">
        <div class="section-header">
          <h2 class="section-title">Popular Games</h2>
          <a class="explore-link" @click="goToExplore">Explore</a>
        </div>
        <div class="games-grid-wrapper">
          <div class="games-grid">
            <div
              v-for="(game, index) in games.slice(0, 6)"
              :key="game.id"
              class="game"
            >
              <div class="gametitle">{{ game.title }}</div>
              <div class="gamepic" @click="onGameClick(index)">
                <img class="thumbnail" :src="game.thumbnail|| explorerImage" alt="Game image" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="test-element">
        <p>.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans");

#home-container {
  position: relative;
  flex: 1;
  max-width:100dvw;
  overflow-y:scroll;
  overflow-x:clip;
  background: #b9b9bc;
}
/* Main Grid */
.main-grid {
  position:relative;
  margin:auto;
  top:120px;
  justify-content: center;
  display:flex;
  height:fit-content;
  gap: 10%;
  align-items: stretch;
  width: 90%;
  z-index:2;
  flex-direction: column;
  /* margin: 120px auto 0 auto; */
}

#hero {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-family: 'RetroQuill', sans-serif;
  color:rgb(0, 0, 0);
  font-size: 2.5em;
  margin: 2rem;
  text-align: left;
}


.splashpond-image {
  display: block;
  margin: 5rem auto;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  transform: scale(1);
  transform-origin: center top;
}

@media (max-width: 768px) {
  .splashpond-image {
    transform: scale(1);
  }
}


/* Right Grid: Popular Games Section */
.popular-games-container {
  width: 100%;
  padding: 2rem;
  position: relative;
  overflow:visible;
}

.popular-games-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: calc(-50vw + 50%);
  width: 100vw;
  height: 100%;
  background: rgb(255, 255, 255);
  z-index: 0;
  pointer-events: none;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 15px;
  margin-bottom: 1rem;
}

.section-title {
  text-align: left;
  font-size: 2rem;
  margin: 0;
  color: #000000;
  z-index:1;
}

.explore-link {
  color: purple;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.2s;
  z-index:1;
}

.explore-link:hover {
  color: #6a1b9a;
}

.games-grid-wrapper {
  position: relative;
  width: 100%;
}

.games-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.games-grid::-webkit-scrollbar {
  height: 8px;
}

.games-grid::-webkit-scrollbar-track {
  background: #dbdbdb;
}

.games-grid::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.games-grid::-webkit-scrollbar-thumb:hover {
  background: #555;
}


.game {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.6rem;
    border-radius: 5px;
    width: 15rem;
    min-width: 15rem;
    height: fit-content;
    flex-shrink: 0;
    background-color: rgb(255, 255, 255);
    box-shadow: 2px 2px 5px rgba(36, 29, 29, 0.426),-2px -2px 5px rgba(36, 29, 29, 0.426);
    color: #000000;
    margin: 5px 5px 5px 0;
    padding: 0.5rem;
    position: relative;
    cursor: pointer;
    transition: all 0.05s ease-out;
}

.gametitle {
    max-width: 100%;
    font-size: 1.25rem;
    font-family:'Josefin Sans';
    margin-bottom: 0;
    white-space: nowrap;
    min-height: 1.2rem;
    overflow:hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
}
.gametitle:hover{
  text-decoration: underline;
}

.gamepic{
  width:14rem;
  height:14rem;
  overflow: clip;
}
.gamepic .thumbnail {
    border-radius: 4px;
    width: 14rem;
    height: 14rem;
    object-fit: cover;
    box-shadow: inset 2px 2px 0 #000;
    filter: brightness(0.85);
}

.game:hover {
    transform: scale(1.05);
}

.test-element {
  padding: 50px 2rem;
  margin-top: 50px;
  color: #000000;
  font-size: 1.2rem;
}

</style>
