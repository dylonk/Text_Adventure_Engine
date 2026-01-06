<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Components and assets
import clickSound from '@/assets/sounds/click.wav';
import moreSound from '@/assets/sounds/more.wav';
import explorer from '@/assets/Images/defaultgameimage.jpg';
import play from '@/assets/Images/play.png';

const playButton = ref(play)
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
          <h1 class="hero-title"><a>MagiQuill</a>, a browser based text adventure engine and social platform</h1>
          <button class="explore-button" @click="goToExplore">Explore</button>
        </div>
      <div class="main-grid">
      <!-- Left Grid: Hero Section -->


      <!-- Right Grid: Popular Games Section -->
      <div class="right-grid">
        <h2 class="section-title">Popular Games</h2>
        <div class="games-grid">
          <div
            v-for="(game, index) in games.slice(0, 6)"
            :key="game.id"
            class="game"
          >
            <div class="gametitle">{{ game.title }}</div>
            <div class="gamepic"             @click="onGameClick(index)"
            >
              <img class="thumbnail" :src="game.thumbnail|| explorerImage" alt="Game image" />
              <img class="overlay-play" :src="play">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Scada");

#home-container {
  position: relative;
  flex: 1;
  max-width:100dvw;
  overflow-y:scroll;
  overflow-x:clip;
  font-family: 'RetroQuill', sans-serif;
  background:#dbdbdb;

}

.background-image{
  position:absolute;
  right:20%;
  top:100px;
  width:100vmin;
  
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
  /* margin: 120px auto 0 auto; */
}

#hero {
  text-align: center;
}

.hero-title {
  font-size: 2.5em;
  margin: 2rem;
  color: #000000;
  text-align: left;
}
.hero-title a{
  color:purple;
}

.explore-button {
  font-size: 2em;
  align-self:flex-end;
  padding: 15px;
  font-family: 'RetroQuill', sans-serif;
  border: 2px solid #ffffff;
  background: #7cbcbb;
  box-shadow: 6px 6px 0 #000;
  color: #fff;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom:20px;
  margin-top:40px;
  transition: background 0.2s, transform 0.2s;
}

.explore-button:hover {
  
  background: #478690;
  transform: scale(1.1);
}

.explore-button:active {
  transform: scale(0.95);
}

/* Right Grid: Popular Games Section */
.right-grid {
  background: rgba(44, 47, 51, 0.9);
  border: 2px solid #e0e0e0;
  box-shadow: 6px 6px 0 #000;
  overflow: clip;
  width:max-content;
  max-width:50%;
  padding: 25px;
  padding-bottom:80px;
  border-radius: 10px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 25px;
  text-shadow: 3px 3px 0 #000;
  color: #ffffff;
}

.games-grid {
  display: flex;
  flex: 1;
  flex-wrap:wrap;
  justify-content: center;
  gap: 20px;
}


.game {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    width: 160px;
    background-color: #d55454;
    color: #000000;
    border: 1px solid #000000;
    margin: 5px;
    padding: 10px;
    position: relative;
    text-transform: uppercase;
    box-shadow: 6px 6px 0 #000;
}

.gametitle {
    font-size: 16px;
    font-family:'Scada';
    display:block;
    color:white;
    font-weight:medium;
    white-space: nowrap;
    text-align: center;
    margin:10px;
    margin-top:5px;
    text-overflow: ellipsis;
    overflow:hidden;
    text-wrap:nowrap;
    width:140px;
}

.gamepic{
  width:135px;
  border-radius: 4px;
  border: 1px solid #ffffff;
  height:135px;
  aspect-ratio: 1/1;
  overflow: clip;
}
.gamepic .thumbnail {
    border-radius: 4px;
    width: 135px;
    height: 135px;
    object-fit: cover;
    box-shadow: inset 2px 2px 0 #000;
    filter: brightness(0.85);
}
.overlay-play{
  display:none;
  position:absolute;
  width: 65px;
  height: 65px;
  left:29%;
  bottom:28%;
}
.gamepic:hover .overlay-play{
  display:inline;
}
.gamepic:hover .thumbnail{
  filter: brightness(90%) blur(4px) grayscale(30%);
}

.game:hover {
    color: #000;
    transform: scale(1.01) translate(0px, -3px);

    transition: all 0.1s ease-in-out;
}

</style>
