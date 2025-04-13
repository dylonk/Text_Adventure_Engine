<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
import axios from 'axios';
import { ref, onMounted,watch } from 'vue';   
import game from './game.vue';
import { useRouter } from 'vue-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite


const router = useRouter();





const recentGames = ref([]);
const searchQuery = ref('');

function goToHome() {
      this.$router.push('/')
}

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
      image: 'https://talentclick.com/wp-content/uploads/2021/08/placeholder-image.png'
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
    <div v-if="recentGames.length>0" class="games-section">
            <div class="game" @click="goToGame(game.title)" v-for="game in filterGames()" :key="i"> <!--lOOP FROM BACKEND -->
                <div class="gametitle">{{game.title}}</div>
                <div class="gamepic"><img src="https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg"> </div>
            </div>
    </div>
    <div v-else class="games-section">
      <div class="game">
                <div class="gametitle">Offline Title</div>
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
    display: inline-flex;
    flex:1;
    flex-wrap:wrap;
    gap: 20px;
    padding: 20px;
    justify-content: center;
    text-align: center;
    width: 100%;
    background:rgb(25,25,25);
    grid-auto-rows: minmax(250px, auto);  /* Adjust height dynamically */
    color:white;
}

.game {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 28px;
    width: fit-content;
    height: fit-content;
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
    transform: scale(1.02);
    transition: all 0.1s ease-in-out;
}

</style>
