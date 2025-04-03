<script setup>
import { useRouter } from 'vue-router';
import globalNavBar from '@/components/standardjs/navbar.vue';
import clickSound from '@/assets/sounds/click.wav';
import moreSound from '@/assets/sounds/more.wav';
import explorer from'@/assets/Images/More.jpg';

const router = useRouter();

// Play sound function
function playClickSound(soundType = 'click') {
  const sound = new Audio(soundType === 'more' ? moreSound : clickSound);
  sound.volume = 0.5; // Adjust volume
  sound.play().catch((e) => console.warn("Sound play blocked", e));
}

// Navigate to explore page
function goToExplore() {
  playClickSound();
  router.push('/explore');
}

// Dummy data for popular games
const games = [
  { id: 1, title: 'Fake Game 1', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 2, title: 'Fake Game 2', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 3, title: 'Fake Game 3', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 4, title: 'Fake Game 4', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 5, title: 'Fake Game 5', image: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg' },
  { id: 6, title: 'More Games?', image: explorer}
];

function onGameClick(index) {
  playClickSound(index < 5 ? 'click' : 'more');
  if(index < 5)
    router.push({name: 'GamePage', params: { info: `testData${index}`} });
  else
    router.push({name: 'Explore'});
}
</script>

<template>
  <globalNavBar />
  <div id="home-container">
    <div class="background-overlay"></div>
    
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
  min-height: 100vh;
  height:auto;
  font-family: 'Pixelify Sans', sans-serif;
  background:rgb(25, 25, 25);
  z-index:0;
  
}

/* Background Overlay */
.background-overlay {
  background-image:url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/62508b06-f9a8-4fb5-a6f9-ac6a2f035569/d8l5iy6-0e7dcbf9-ae26-4131-91d5-8d9cd568d199.png/v1/fill/w_999,h_800/stock___stone_wall_and_arch_png_by_artreferencesource_d8l5iy6-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODIwIiwicGF0aCI6IlwvZlwvNjI1MDhiMDYtZjlhOC00ZmI1LWE2ZjktYWM2YTJmMDM1NTY5XC9kOGw1aXk2LTBlN2RjYmY5LWFlMjYtNDEzMS05MWQ1LThkOWNkNTY4ZDE5OS5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.BgITDiff1TAZ5siEbOt_hxvN2kHG_hDkGmqej83Z5tk);
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  filter: brightness(0.85);
}

/* Main Grid */
.main-grid {
  position:relative;
  margin:auto;
  top:120px;
  display: grid;
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
  border: 2px solid #e0e0e0;
  box-shadow: inset 2px 2px 0 #000;
}
</style>
