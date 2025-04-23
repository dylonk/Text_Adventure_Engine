<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
import axios from 'axios';
import { ref, onMounted,watch } from 'vue';   
import skyImage from '@/assets/Images/editor/sky.png'
import defaultThumbnail from '@/assets/Images/defaultgameimage.jpg'
import playButton from '@/assets/Images/play.png'

import game from './game.vue';
import { useRouter } from 'vue-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite


const router = useRouter();
const sky = ref(skyImage)
const defaultThumb = ref(defaultThumbnail)
const play = ref(playButton)


const recentGames = ref([]);
const searchQuery = ref('');



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
      thumbnail:game.thumbnail
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
            <div class="game" v-for="game in filterGames()" :key="i"> <!--lOOP FROM BACKEND -->
                <div class="gametitle">{{game.title}}</div>
                <div class="gamepic" @click="goToGame(game.title)">
                  <img :src="game.thumbnail||defaultThumb" class="thumbnail"> 
                  <img :src="play" class="overlay-play">
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
    display: inline-flex;
    flex:1;
    flex-wrap:wrap;
    gap: 20px;
    padding: 20px;
    justify-content: center;

    text-align: center;
    width: 100%;
    grid-auto-rows: minmax(250px, auto);  /* Adjust height dynamically */
    color:white;
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
}

.gametitle {
  
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
  position:absolute;
  width: 75px;
  height: 75px;
  left:28%;
  bottom:20%;
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

</style>
