<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Components and assets
import globalNavBar from '@/components/standardjs/navbar.vue';
import clickSound from '@/assets/sounds/click.wav';
import moreSound from '@/assets/sounds/more.wav';
import explorer from '@/assets/Images/More.jpg';

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const games = ref([]);

const fetchGames = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/games/`);
    games.value = response.data.map(game => ({
      id: game.id,
      title: game.title,
      image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg'
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
  <globalNavBar />
  <div id="home-container">    
    <img class="background-image" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/62508b06-f9a8-4fb5-a6f9-ac6a2f035569/d8l5iy6-0e7dcbf9-ae26-4131-91d5-8d9cd568d199.png/v1/fill/w_999,h_800/stock___stone_wall_and_arch_png_by_artreferencesource_d8l5iy6-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODIwIiwicGF0aCI6IlwvZlwvNjI1MDhiMDYtZjlhOC00ZmI1LWE2ZjktYWM2YTJmMDM1NTY5XC9kOGw1aXk2LTBlN2RjYmY5LWFlMjYtNDEzMS05MWQ1LThkOWNkNTY4ZDE5OS5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.BgITDiff1TAZ5siEbOt_hxvN2kHG_hDkGmqej83Z5tk">
      <div class="main-grid">
      <!-- Left Grid: Hero Section -->
      <div class="left-grid">
        <div id="hero">
          <h1 class="hero-title">Text Adventure Game Engine</h1>
          <button class="explore-button" @click="goToExplore">Explore</button>
        </div>
      </div>

      <!-- Right Grid: Popular Games Section -->
      <div class="right-grid">
        <h2 class="section-title">Popular Games</h2>
        <div class="games-grid">
          <div
            v-for="(game, index) in games"
            :key="game.id"
            class="game-square"
            @click="onGameClick(index)"
          >
            <div class="game-title">{{ game.title }}</div>
            <div class="game-pic">
              <img :src="game.image" alt="Game image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap');

#home-container {
  position: relative;
  flex: 1;
  max-width:100%;
  overflow-x:clip;
  height:auto;
  font-family: 'Pixelify Sans', sans-serif;
  background:rgb(25, 25, 25);
  z-index:-2;

}

.background-image{
  position:absolute;
  right:20%;
  width:60dvw;
  height:100%;
}
/* Main Grid */
.main-grid {
  position:relative;
  margin:auto;
  top:120px;
  max-height:75%;
  display:flex;
  grid-template-columns: 50% 50%;
  gap: 30px;
  width: 70%;
  z-index:2;
  /* margin: 120px auto 0 auto; */
}

/* Left Grid: Hero Section */
.left-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width:45%;
  background: rgba(44, 47, 51, 0.9);
  border: 2px solid #e0e0e0;
  box-shadow: 6px 6px 0 #000;
  padding: 25px;
  border-radius: 10px;
}

#hero {
  text-align: center;
}

.hero-title {
  font-size: 4.5rem;
  margin-bottom: 25px;
  text-shadow: 5px 5px 0 #000;
  color: #e0e0e0;
}

.explore-button {
  font-size: 1.5rem;
  padding: 18px 36px;
  border: 2px solid #e0e0e0;
  background: #e74c3c;
  box-shadow: 6px 6px 0 #000;
  color: #fff;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s, transform 0.2s;
}

.explore-button:hover {
  background: #c0392b;
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
  padding: 25px;
  max-width:45%;
  border-radius: 10px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 25px;
  text-shadow: 3px 3px 0 #000;
  color: #e0e0e0;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.game-square {
  background: #e74c3c;
  border: 2px solid #e0e0e0;
  box-shadow: 4px 4px 0 #000;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.game-square:hover {
  transform: translateY(-5px);
  box-shadow: 6px 6px 0 #000;
}

.game-square:active {
  transform: scale(0.95);
}

.game-title {
  font-size: 1rem;
  margin-bottom: 10px;
  padding: 6px;
  background: #c0392b;
  color: #fff;
  border: 2px solid #e0e0e0;
  box-shadow: 2px 2px 0 #000;
}

.game-pic img {
  width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: 1/1;
  border: 2px solid #e0e0e0;
  box-shadow: inset 2px 2px 0 #000;
}
</style>
