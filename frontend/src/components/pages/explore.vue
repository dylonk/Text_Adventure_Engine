<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
import axios from 'axios';
import { ref, onMounted,watch } from 'vue';   
import skyImage from '@/assets/Images/editor/sky.png'
import defaultThumbnail from '@/assets/Images/defaultgameimage.jpg'
import playButton from '@/assets/Images/play.png'
import { HContainer,VContainer } from '../editor/nodes/node_assets/n-component-imports';

import game from './game.vue';
import { useRouter } from 'vue-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite


const router = useRouter();
const sky = ref(skyImage)
const defaultThumb = ref(defaultThumbnail)
const play = ref(playButton)


const recentGames = ref([]);
const searchQuery = ref('');
const expandedGame = ref(null);



// Watch for changes in searchQuery and filter games
watch(searchQuery, () => {
  filterGames(); // Re-filter the games when search input changes
});

// Filter the games based on search query
const filterGames = () => {
  if (!searchQuery.value) {
    return recentGames.value; // If no search query, show all games
  }
  return recentGames.value.filter(game =>
    game.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

const expandGame = (game) => {
  expandedGame.value = game;
};

const closeExpanded = () => {
  expandedGame.value = null;
};

//yeah, we're doing it by title not id. it makes the links prettier and we're making titles unique anyway.
const goToGame = (async (title) => {
  router.push('/game/' + title);//takes you to the player screen
});


const fetchGames = async () => {

  try {
    console.log('Fetching all games');
    const response = await axios.get(`${API_BASE_URL}/games/`);
    recentGames.value = response.data.map(game => ({
      id: game.id,
      title: game.title,
      thumbnail:game.thumbnail,
      description:game.description,
    }));
  } catch (error) {
    console.warn('Error fetching projects:', error);
  }
};
onMounted(fetchGames);

</script>

<template>
    <globalNavBar/>
    <form id="section-bar" action="placeholder" method="get">
        <input type="search" name="search-bar" placeholder="SEARCH" v-model="searchQuery">
    </form>
    <div :style="{ backgroundImage: 'url(' + sky + ')' , flex: 1, height: '100%' }">
      <div v-if="recentGames.length>0" class="games-section" >

            <div class="game" v-for="game in filterGames()" :key="game.id" @click="expandGame(game)"> 
              <VContainer spacing="0px" style="width:min-content">
                <div class="gametitle">{{game.title}}</div>
                <div class="gamepic">
                  <img :src="game.thumbnail||defaultThumb" class="thumbnail"> 
                  <img :src="play" class="overlay-play">  
                </div>
              </VContainer>
            </div>
        </div>
    </div>

    <!-- Expanded Game Overlay -->
    <div v-if="expandedGame" class="overlay" @click.self="closeExpanded">
      <div class="expanded-card">
        <button class="close-btn" @click="closeExpanded">×</button>
        <div class="expanded-content">
          <div class="expanded-left">
            <h2 class="expanded-title">{{expandedGame.title}}</h2>
            <div class="expanded-thumbnail-container" @click="goToGame(expandedGame.title)">
              <img :src="expandedGame.thumbnail||defaultThumb" class="expanded-thumbnail">
              <img :src="play" class="expanded-play">
            </div>
          </div>
          <div class="expanded-right">
            <h3 class="desc-header">Description</h3>
            <div class="expanded-description">
              {{ expandedGame.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap');
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';
@import url("https://fonts.googleapis.com/css2?family=Scada");

#section-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    border-bottom: 2px solid #e0e0e0;
    padding: 10px;
    font-size: 36px;
    background-color: #e0e0e0;
    color: #e0e0e0;
    border-bottom: 2px gray solid;
    letter-spacing: 2px;
  
  }

input[type=search] {
    border: 2px inset #989898;
    padding: 10px;
    width: 40%;
    border-radius: 8px;
    background-color: white;
    color: #858585;
}

input[type=search]:focus {
    outline: none;
    color:black;
    
    border-color: #80c6ff;
}

.games-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  width: 100%;
  position: relative;
  box-sizing: border-box;
}

.game {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 28px;
    border-radius: 5px;
    width: fit-content;
    height: fit-content;
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #8e8e8e;
    margin: 5px;
    padding: 10px;
    position: relative;
    text-transform: uppercase;
    box-shadow: 6px 6px 0 #000;
    cursor: pointer;
}

.gametitle {
    width: 150px;
    font-size: 20px;
    font-family:'Scada';
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.gamepic{
  width:150px;
  height:150px;
  overflow: clip;
}
.gamepic .thumbnail {
    border: 1px solid #8e8e8e;
    border-radius: 4px;
    width: 150px;
    height: 150px;
    object-fit: cover;
    box-shadow: inset 2px 2px 0 #000;
    filter: brightness(0.85);
}
.overlay-play{
  display:none;
  position:relative;
  width: 75px;
  height: 75px;
  left:25%;
  bottom:80%;
}
.gamepic:hover .overlay-play{
  display:inline;
}
.gamepic:hover .thumbnail{
  filter: brightness(90%) blur(4px) grayscale(30%);
}

.game:hover {
    color: #000;
    transform: scale(1.02) translate(0px, -6px);
    transition: all 0.1s ease-in-out;
}

/* Overlay Styles */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.expanded-card {
  position: relative;
  background-color: #ffffff;
  border: 2px solid #8e8e8e;
  border-radius: 8px;
  box-shadow: 12px 12px 0 #000;
  width: 80vw;
  max-width: 1000px;
  height: 70vh;
  max-height: 600px;
  padding: 30px;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff4444;
  border: 2px solid #000;
  color: white;
  font-size: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  line-height: 1;
  box-shadow: 2px 2px 0 #000;
}

.close-btn:hover {
  background: #ff0000;
  transform: scale(1.1);
}

.expanded-content {
  display: flex;
  gap: 30px;
  height: 100%;
}

.expanded-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
}

.expanded-title {
  font-family: 'Scada';
  font-size: 32px;
  text-transform: uppercase;
  margin-bottom: 20px;
  text-align: center;
}

.expanded-thumbnail-container {
  position: relative;
  width: 300px;
  height: 300px;
  cursor: pointer;
}

.expanded-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid #8e8e8e;
  border-radius: 8px;
  box-shadow: inset 4px 4px 0 #000;
  filter: brightness(0.85);
}

.expanded-play {
  display: none;
  position: absolute;
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.expanded-thumbnail-container:hover .expanded-play {
  display: block;
}

.expanded-thumbnail-container:hover .expanded-thumbnail {
  filter: brightness(90%) blur(4px) grayscale(30%);
}

.expanded-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.desc-header {
  font-family: 'Scada';
  font-size: 24px;
  color: #666;
  margin-bottom: 10px;
}

.expanded-description {
  flex: 1;
  background: #f5f5f5;
  padding: 20px;
  border: 2px solid #8e8e8e;
  border-radius: 8px;
  font-family: 'Scada';
  font-size: 18px;
  line-height: 1.6;
  overflow-y: auto;
  color: #333;
}

</style>  