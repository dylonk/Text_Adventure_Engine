<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Components and assets
import explorer from '@/assets/Images/defaultgameimage.jpg';
import splashpond from '@/assets/Images/splashpond.png';
import homeTopSvg from '@/assets/Images/home-top.svg';
import editorDisplay from '@/assets/Images/home-editordemo.mp4';

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
    <img class="home-top-svg" :src="homeTopSvg" alt="" />
    <div id="hero">
          <img class="splashpond-image" :src="splashpond" alt="Splash Pond" />
          <div class="window-border">
            <div class="window-top">
              <div class="window-button"/><div class="window-button"/><div class="window-button"/>|| 
            </div>
            <div class="window-content">
              <h1 class="hero-title">><a>MagiQuill</a>, a browser based text adventure engine and social platform</h1>
            </div>
          </div>
        </div>
      <div class="editor-display-section">
        <div class="editor-description">
          <h2 class="editor-title">Visual Programming Interface</h2>
          <p class="editor-text">Create interactive text adventures with our intuitive visual programming system. Connect blocks to build complex narratives and game logic.</p>
        </div>
        <div class="editor-image-container">
          <video 
            class="editor-display-image" 
            :src="editorDisplay" 
            autoplay
            loop
            muted
            playsinline
          ></video>
        </div>
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
            <div class="games-grid-spacer"></div>
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
  background: #b8bed4;
}

.home-top-svg {
  position: absolute;
  top:-5rem;
  width: 110vw;
  height: auto;
  z-index: 0;
  pointer-events: none;
  object-fit: contain;
}
/* Main Grid */
.main-grid {
  position:relative;
  margin:auto;
  justify-content: center;
  display:flex;
  height:fit-content;
  gap: 1rem;
  align-items: stretch;
  width: 100dvw;
  z-index:2;
  flex-direction: column;
  /* margin: 120px auto 0 auto; */
}

.window-top{
  background:rgb(195, 197, 197);
  display:flex;
  flex-direction: row-reverse;
  width:100%;
  vertical-align:middle;
  align-items: center;
  height:16px;
  color:#888;
  gap:2px;
  font-family: 'RetroQuill', sans-serif;
  font-size:12px;
}

.window-button{
  height:12px;
  width:12px;
  background:rgb(171, 171, 172);
  color:gray;
  border:outset 2px rgb(165, 165, 165);
}

.window-border{

  border:rgb(226, 229, 229) 2px outset;
  background:gray;
  width:50dvw;
  max-width: 900px;
  flex-shrink: 0;
  margin: 3rem 1rem;
  box-shadow: 4px 4px 12px rgba(36, 29, 29, 0.41) ;
}
.window-content{
  height:100%;
  width:100%;
  min-height: 500px;
  border:0.125rem rgb(79, 79, 79) solid;
  background:black;
  padding:1rem;
}

#hero {
  text-align: center;
  position: relative;
  height:fit-content;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  gap: 2rem;
  flex-wrap: wrap;
}

.hero-title {
  font-family: 'RetroQuill', sans-serif;
  color:rgb(255, 255, 255);
  font-size: 1.5rem;
  text-align: left;
}


.splashpond-image {
  display: block;
  margin: 5rem 0;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  transform: scale(1);
  transform-origin: center top;
  flex-shrink: 0;
}

.editor-display-section {
  text-align: center;
  position: relative;
  height: fit-content;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin: 3rem 1rem;
  padding: 0 1rem;
}

.editor-description {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.editor-title {
  font-size: 2rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 1rem;
}

.editor-text {
  font-size: 1.2rem;
  color: #000000;
  line-height: 1.6;
  margin: 0;
}

.editor-image-container {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.editor-display-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 4px 4px 12px rgba(36, 29, 29, 0.41);
  image-rendering: auto;
}

@media (max-width: 768px) {
  #hero {
    flex-direction: column;
  }
  .splashpond-image {
    transform: scale(0.5) translateY(50%);
    margin: 2rem 0;
  }
  .window-border {
    margin: 2rem 0;
    width: 90dvw;
  }
  .editor-display-section {
    flex-direction: column;
    margin: 2rem 1rem;
  }
  .editor-description {
    text-align: center;
    max-width: 100%;
  }
  .editor-title {
    text-align: center;
  }
}


/* Right Grid: Popular Games Section */
.popular-games-container {
  width: 100vw;
  position: relative;
  overflow:visible;
  box-sizing: border-box;
}

.popular-games-container::before {
  content: '';
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.section-header {
  display: flex;
  align-items:center;
  gap: 15px;
  margin-bottom: 1rem;
  margin-left:60px;
  width:fit-content;
  padding:0.5rem 1rem;
  border-radius: 16px;
  background:#dfecf0;
}

.section-title {
  text-align: left;
  font-size: 1.75rem;
  font-weight:600;
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
  overflow-x: visible;
}

.games-grid-wrapper::before,
.games-grid-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 5dvw;
  z-index: 10;
  pointer-events: none;
}

.games-grid-wrapper::before {
  left: 0;
  background: linear-gradient(to right, #b8bed4, transparent);
}

.games-grid-wrapper::after {
  right: 0;
  background: linear-gradient(to left, #b8bed4, transparent);
}

.games-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  height:fit-content;
  padding:10px;
  scrollbar-width: none; /* Hide scrollbar by default */
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

/* Hide scrollbar by default */
.games-grid::-webkit-scrollbar {
  height: 0px;
  background: transparent;
}

.games-grid::-webkit-scrollbar-track {
  background: transparent;
}

.games-grid::-webkit-scrollbar-thumb {
  background: transparent;
}

/* Show scrollbar on hover */
.games-grid-wrapper:hover .games-grid {
  scrollbar-width: thin;
}

.games-grid-wrapper:hover .games-grid::-webkit-scrollbar {
  height: 8px;
}

.games-grid-wrapper:hover .games-grid::-webkit-scrollbar-track {
  background: #dbdbdb;
}

.games-grid-wrapper:hover .games-grid::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.games-grid-wrapper:hover .games-grid::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.games-grid-spacer {
  width: calc(2.5dvw-1rem);
  min-width: 50px;
  flex-shrink: 0;
  height: 1px;
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
