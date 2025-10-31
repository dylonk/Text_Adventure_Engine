<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
import axios from 'axios';
import { ref, onMounted, watch, onUnmounted } from 'vue';   
import defaultThumbnail from '@/assets/Images/defaultgameimage.jpg'
import playButton from '@/assets/Images/play.png'
import { HContainer,VContainer } from '../editor/nodes/node_assets/n-component-imports';
import cloud1 from '@/assets/Images/clouds/cloud1LQ.png'
import cloud2 from '@/assets/Images/clouds/cloud2LQ.png'
import cloud3 from '@/assets/Images/clouds/cloud3LQ.png'
import cloud4 from '@/assets/Images/clouds/cloud4LQ.png'
import cloud5 from '@/assets/Images/clouds/cloud5LQ.png'
import cloud6 from '@/assets/Images/clouds/cloud6LQ.png'

import game from './game.vue';
import { useRouter } from 'vue-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite


const router = useRouter();
const defaultThumb = ref(defaultThumbnail)
const play = ref(playButton)


const recentGames = ref([]);
const searchQuery = ref('');
const expandedGame = ref(null);

// Cloud images array
const cloudImages = [cloud1, cloud2, cloud3, cloud4, cloud5, cloud6];

// Cloud data structure
const clouds = ref([]);
let cloudSpawnInterval = null;

// Generate a normally-distributed random number
// Uses Box-Muller transform to approximate normal distribution
const randomNormal = () => {
  // Generate two independent uniform random variables
  const u1 = Math.random();
  const u2 = Math.random();
  // Box-Muller transform to get normal distribution (mean=0, std=1)
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0;
};

// Cloud layer configuration (3 layers for parallax effect)
const speedConstant = 0.5
const cloudLayers = [
  { speed: 0.2*speedConstant, opacity: 0.4, scale: 2, name: 'back' },    // Background - slowest, darkest, smaller
  { speed: 0.35*speedConstant, opacity: 0.8, scale: 1.7, name: 'mid' },     // Midground - medium speed
  { speed: 0.5*speedConstant, opacity: 1.0, scale: 1.0, name: 'front' }    // Foreground - fastest, brightest, full size
];

// Generate random cloud
const generateCloud = (layer, startLeft = null) => {
  const randomCloud = cloudImages[Math.floor(Math.random() * cloudImages.length)];
  const randomSize = 300 + Math.random() * 100; // 150-250px
  
  // Generate normally-distributed vertical position - centered at the very top
  // Center is at 3% from top so clouds appear at the top edge
  const centerPercent = -5; // Center position - negative to translate upward above top edge
  const rangePercent = 20; // Range to allow clouds to spread a bit
  const stdDev = rangePercent / 4; // Standard deviation to keep most values in range
  
  let normalValue = randomNormal() * stdDev + centerPercent;
  // Allow negative values to translate clouds upward, extending into viewport
  const randomTop = Math.max(-10, Math.min(15, normalValue)); // Clamp between -10% and 15% from top
  
  // If startLeft is provided, use it; otherwise start off-screen left
  const initialLeft = startLeft !== null ? startLeft : -50;
  const randomDelay = startLeft !== null ? 0 : Math.random() * 2; // Small delay for naturally spawned clouds
  
  // Duration varies by layer - slower layers take longer (creating parallax effect)
  // Base duration is 30-60 seconds, adjusted by layer speed
  const baseDuration = 30 + Math.random() * 30;
  let duration = baseDuration / layer.speed;
  
  // Adjust duration based on starting position (clouds starting further left take longer)
  if (startLeft !== null) {
    const totalDistance = 170; // From -50% to 120%
    const remainingDistance = 120 - startLeft;
    const progressRatio = remainingDistance / totalDistance;
    duration = duration * progressRatio; // Shorter duration for clouds starting further right
  }
  
  return {
    id: Date.now() + Math.random(),
    image: randomCloud,
    layer: layer,
    size: randomSize * layer.scale,
    top: randomTop + '%',
    speed: layer.speed,
    opacity: layer.opacity,
    delay: randomDelay,
    duration: duration,
    startLeft: initialLeft
  };
};

// Spawn new cloud
const spawnCloud = () => {
  // Randomly choose a layer (weighted towards more background clouds)
  const layerRand = Math.random();
  let layerIndex;
  if (layerRand < 0.3) {
    layerIndex = 0; // Back layer - 40% chance
  } else if (layerRand < 0.5) {
    layerIndex = 1; // Mid layer - 30% chance
  } else {
    layerIndex = 2; // Front layer - 30% chance
  }
  
  clouds.value.push(generateCloud(cloudLayers[layerIndex]));
};

// Remove clouds that have moved off screen (limit array size to prevent memory issues)
const cleanupClouds = () => {
  if (clouds.value.length > 50) {
    // Remove oldest clouds if we have too many
    clouds.value = clouds.value.slice(-40);
  }
};

// Handle animation end events for cleanup
const handleCloudAnimationEnd = (cloudId) => {
  clouds.value = clouds.value.filter(cloud => cloud.id !== cloudId);
};

// Initialize cloud system
const initClouds = () => {
  // Spawn initial clouds immediately distributed across the entire screen area
  for (let i = 0; i < 20; i++) {
    // Distribute clouds across the screen from off-screen left through visible area
    // Range from -50% (off-screen left) to 120% (off-screen right)
    let startLeft;
    if (i < 12) {
      // First 12 clouds distributed across the visible screen area (-10% to 110%)
      startLeft = -10 + (i / 11) * 120; // Distribute from -10% to 110%
    } else if (i < 18) {
      // Next 6 clouds start off-screen left, ready to enter
      startLeft = -50 + (i - 12) / 5 * 20; // Distribute from -50% to -10%
    } else {
      // Last 2 clouds start further off-screen for variety
      startLeft = -50 - Math.random() * 30; // -50% to -80%
    }
    
    // Randomly choose a layer
    const layerRand = Math.random();
    let layerIndex;
    if (layerRand < 0.1) {
      layerIndex = 0; // Back layer
    } else if (layerRand < 0.35) {
      layerIndex = 1; // Mid layer
    } else {
      layerIndex = 2; // Front layer
    }
    
    // Spawn cloud at specific position immediately
    clouds.value.push(generateCloud(cloudLayers[layerIndex], startLeft));
  }
  
  // Continue spawning clouds at random intervals (off-screen left)
  cloudSpawnInterval = setInterval(() => {
    if (Math.random() > 0.3) { // 70% chance to spawn each interval
      spawnCloud();
    }
    cleanupClouds(); // Periodically clean up old clouds
  }, 8000 + Math.random() * 7000); // Every 8-15 seconds (less frequent)
};



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
onMounted(() => {
  fetchGames();
  initClouds();
});

onUnmounted(() => {
  if (cloudSpawnInterval) {
    clearInterval(cloudSpawnInterval);
  }
});

</script>

<template>
    <globalNavBar/>
    <form id="section-bar" action="placeholder" method="get">
        <input type="search" name="search-bar" placeholder="SEARCH" v-model="searchQuery">
    </form>
    <div class="game-page">
      <!-- Cloud layers with parallax effect -->
      <div class="cloud-container">
        <div 
          v-for="cloud in clouds" 
          :key="cloud.id"
          class="cloud"
          :class="`cloud-${cloud.layer.name}`"
          :style="{
            backgroundImage: `url(${cloud.image})`,
            width: cloud.size + 'px',
            height: cloud.size + 'px',
            top: cloud.top,
            opacity: cloud.opacity,
            animationDuration: cloud.duration + 's',
            animationDelay: cloud.delay + 's',
            '--start-left': (cloud.startLeft !== undefined ? cloud.startLeft : -100) + '%'
          }"
          @animationend="handleCloudAnimationEnd(cloud.id)"
        ></div>
      </div> 
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

.game-page{
  flex: 1; 
  height: '100%';
  background:linear-gradient(0deg,rgb(180, 249, 255) 0%, rgb(136, 189, 242) 80%);
  position: relative;
  overflow: hidden;
}

/* Cloud container - positioned absolutely behind content */
.cloud-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%; /* Extend height to allow for upward translation */
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* Cloud base styles */
.cloud {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  will-change: transform;
}

/* Cloud animation - moves from left to right */
@keyframes cloudMove {
  from {
    left: var(--start-left, -50%);
  }
  to {
    left: 120%;
  }
}

.cloud {
  animation: cloudMove linear;
  animation-fill-mode: both;
}

/* Layer-specific z-index for proper parallax layering */
.cloud-back {
  z-index: 1;
  filter: brightness(0.7) contrast(1.1); /* Darker background clouds */
}

.cloud-mid {
  z-index: 2;
  filter: brightness(0.85);
}

.cloud-front {
  z-index: 3;
}

/* Media query for mobile devices - scale clouds to half size */
@media (max-width: 768px) {
  .cloud {
    transform: scale(0.5);
    transform-origin: center center;
  }
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
  z-index: 10; /* Ensure games appear above clouds */
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
.gametitle:hover{
  text-decoration: underline;
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
  filter: brightness(50%);
}

.game:hover {
    color: #000;
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
  filter: brightness(50%);
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