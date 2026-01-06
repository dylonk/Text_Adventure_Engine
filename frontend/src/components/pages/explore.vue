<script setup>
import axios from 'axios';
import { ref, onMounted, watch, onUnmounted, nextTick, computed } from 'vue';   
import defaultThumbnail from '@/assets/Images/defaultgameimage.jpg'
import playButton from '@/assets/Images/play.png'
import { HContainer,VContainer } from '../editor/nodes/node_assets/n-component-imports';
import fullStar from '@/assets/Images/stars/fullstar.png'
import emptyStar from '@/assets/Images/stars/emptystar.png'
import halfStar from '@/assets/Images/stars/halfstar.png'
import cloud1 from '@/assets/Images/clouds/cloud1LQ.png'
import cloud2 from '@/assets/Images/clouds/cloud2LQ.png'
import cloud3 from '@/assets/Images/clouds/cloud3LQ.png'
import cloud4 from '@/assets/Images/clouds/cloud4LQ.png'
import cloud5 from '@/assets/Images/clouds/cloud5LQ.png'
import cloud6 from '@/assets/Images/clouds/cloud6LQ.png'
import searchIcon from '@/assets/Images/editor/searchicon.png'

import game from './game.vue';
import { useRouter } from 'vue-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite


const router = useRouter();
const defaultThumb = ref(defaultThumbnail)
const play = ref(playButton)


const recentGames = ref([]);
const searchQuery = ref('');
const searchInput = ref(''); // Separate ref for the input field
const expandedGame = ref(null);
const userRating = ref(null); // User's current rating for the expanded game
const hoveredRating = ref(null); // For hover effect on stars
const currentPage = ref(1);
const itemsPerPage = ref(8); // Set to 1 for testing
const isSearching = ref(false);

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
  // Don't spawn if there are already 8 or more clouds
  if (clouds.value.length >= 8) {
    return;
  }
  
  // Randomly choose a layer (weighted towards more background clouds)
  const layerRand = Math.random();
  let layerIndex;
  if (layerRand < 0.1) {
    layerIndex = 0; // Back layer
  } else if (layerRand < 0.35) {
    layerIndex = 1; // Mid layer
  } else {
    layerIndex = 2; // Front layer
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
  // Limited to 8 clouds maximum
  for (let i = 0; i < 8; i++) {
    // Distribute clouds across the screen from off-screen left through visible area
    // Range from -50% (off-screen left) to 120% (off-screen right)
    let startLeft;
    if (i < 5) {
      // First 5 clouds distributed across the visible screen area (-10% to 110%)
      startLeft = -10 + (i / 4) * 120; // Distribute from -10% to 110%
    } else if (i < 7) {
      // Next 2 clouds start off-screen left, ready to enter
      startLeft = -50 + ((i - 5) / 1) * 40; // Distribute from -50% to -10%
    } else {
      // Last cloud starts further off-screen for variety
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



// Filter the games based on search query
const filteredGames = computed(() => {
  if (!searchQuery.value) {
    return recentGames.value; // If no search query, show all games
  }
  return recentGames.value.filter(game =>
    game.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Calculate total pages based on filtered games
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredGames.value.length / itemsPerPage.value));
});

// Get paginated games for current page
const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredGames.value.slice(start, end);
});

// Function to perform search (called on Enter or button click)
const performSearch = () => {
  isSearching.value = true;
  searchQuery.value = searchInput.value;
  currentPage.value = 1; // Reset to first page when search changes
  
  // Fade out the white overlay after a short delay
  setTimeout(() => {
    isSearching.value = false;
  }, 500); // 500ms fade duration
};

// Watch for changes in searchQuery and reset to page 1
watch(searchQuery, async () => {
  currentPage.value = 1; // Reset to first page when search changes
});

// Watch for changes in filtered games and reset to page 1 if current page is invalid
watch(filteredGames, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1;
  }
});

// Pagination functions
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    nextTick(() => {
      adjustTitleFontSizes();
    });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    nextTick(() => {
      adjustTitleFontSizes();
    });
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    nextTick(() => {
      adjustTitleFontSizes();
    });
  }
};

const expandGame = async (game) => {
  expandedGame.value = game;
  userRating.value = null;
  hoveredRating.value = null;
  // Fetch user's current rating for this game
  await fetchUserRating(game.id);
};

// Fetch user's current rating for a game
const fetchUserRating = async (gameId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    userRating.value = null;
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/games/rating/${gameId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    userRating.value = response.data.rating;
  } catch (error) {
    console.warn('Error fetching user rating:', error);
    userRating.value = null;
  }
};

// Submit a rating for a game
const submitRating = async (rating) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('User not logged in');
    return;
  }
  
  if (!expandedGame.value) {
    return;
  }
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/games/rate`,
      {
        gameId: expandedGame.value.id,
        rating: rating
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Update user's rating
    userRating.value = rating;
    
    // Update the game's average rating in the list
    const gameIndex = recentGames.value.findIndex(g => g.id === expandedGame.value.id);
    if (gameIndex !== -1) {
      recentGames.value[gameIndex].rating = response.data.averageRating;
      // Also update expandedGame
      expandedGame.value.rating = response.data.averageRating;
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
  }
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
      userid: game.userId,
      title: game.title,
      thumbnail:game.thumbnail,
      description:game.description || 'This game has no description',
      username: game.username || 'unknown', // Default to 'unknown' if not in database
      rating: game.rating || 2.5, // Default to 2.5 stars if not in database
    }));
    console.log(recentGames.value)
    // Adjust font sizes after games are loaded
    await nextTick();
  } catch (error) {
    console.warn('Error fetching projects:', error);
  }
};


// Function to get star images based on rating (0-5 scale)
const getStarImage = (index, rating) => {
  const starValue = rating - index;
  if (starValue >= 1) {
    return fullStar;
  } else if (starValue >= 0.5) {
    return halfStar;
  } else {
    return emptyStar;
  }
};

// Function to get star image for interactive rating (uses userRating or hoveredRating)
const getStarImageForRating = (starIndex, currentRating, hovered) => {
  // Use hovered rating if hovering, otherwise use current user rating
  const ratingToUse = hovered !== null ? hovered : (currentRating || 0);
  const starValue = ratingToUse - (starIndex - 1);
  if (starValue >= 1) {
    return fullStar;
  } else if (starValue >= 0.5) {
    return halfStar;
  } else {
    return emptyStar;
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
    <form id="section-bar" @submit.prevent="performSearch">
        <input type="search" name="search-bar" placeholder="Find your next adventure!" v-model="searchInput" @keyup.enter="performSearch">
        <button type="button" class="search-button" @click="performSearch">
          <img :src="searchIcon" alt="Search" class="search-icon">
        </button>
    </form>
    <div class="game-page">
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
            <div class="game" v-for="game in paginatedGames" :key="game.id" @click="expandGame(game)"> 
              <VContainer spacing="0px" style="width:min-content; max-width: 100%;">
                <div class="gametitle">{{game.title}}</div>
                <div class="game-user-rating">
                  <div class="gameusername">{{game.username || 'unknown'}}</div>
                  <div class="gamestars">
                    <img 
                      v-for="i in 5" 
                      :key="i" 
                      :src="getStarImage(i - 1, game.rating || 2.5)" 
                      class="star"
                      alt="star"
                    />
                  </div>
                </div>
                <div class="gamepic">
                  <img :src="game.thumbnail||defaultThumb" class="thumbnail"> 
                </div>
              </VContainer>
            </div>
      </div>
      <div v-if="recentGames.length > 0 && filteredGames.length === 0" class="no-results-message">
        No results for this query
      </div>
      <div style="width:100%;height:60px;"></div>  
        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="pagination-container">

          <div class="pagination-numbers">
          </div>
          <button 
            class="pagination-btn" 
            @click="prevPage" 
            :disabled="currentPage === 1"
            :class="{ disabled: currentPage === 1 }"
          >
            ‹
          </button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="pagination-number"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>

          <button 
            class="pagination-btn" 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            :class="{ disabled: currentPage === totalPages }"
          >
            ›
          </button>
        </div>
    </div>

    <!-- Expanded Game Overlay -->
    <div v-if="expandedGame" class="overlay" @click.self="closeExpanded">
      <div class="expanded-card">
        <div class="expanded-content">
          <div class="expanded-left">
            <div class="expanded-thumbnail-container" @click="goToGame(expandedGame.title)">
              <img :src="expandedGame.thumbnail||defaultThumb" class="expanded-thumbnail">
              <img :src="play" class="expanded-play">
            </div>
            <h2 class="expanded-title">{{expandedGame.title}}</h2>
            <div class="expanded-author">by {{expandedGame.username || 'unknown'}}</div>
            <div class="expanded-rating-container">
              <div class="expanded-rating-label">Rate this game:</div>
              <div class="expanded-stars" @mouseleave="hoveredRating = null">
                <img 
                  v-for="i in 5" 
                  :key="i" 
                  :src="getStarImageForRating(i, userRating, hoveredRating)" 
                  class="expanded-star"
                  alt="star"
                  @click="submitRating(i)"
                  @mouseenter="hoveredRating = i"
                />
              </div>
            </div>
          </div>
          <button class="close-btn" @click="closeExpanded">×</button>
          <div class="expanded-right">
            <div class="desc-header-container">
              <h3 class="desc-header">Description</h3>
            </div>
            <!-- <hr class="hr-desc"></hr> -->
            <div class="expanded-description">
              {{ expandedGame.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Scada");

#section-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 0 0.5rem 0.5rem 0.5rem;
    font-size: 2rem;
    letter-spacing: 2px;
    background-color: #181818;
    z-index:13;
  }

input[type=search] {
    font-family: 'Scada';
    border: none;
    padding: 0.6rem;
    width: 25rem;
    border-radius:  2px 0 0 2px ;
    background-color: rgb(255, 255, 255);
    color: #181818;
}
input[type=search]:focus {
  color:black;
  outline:none;
  border:none;
  background: white;
}

.search-button{
  color:rgb(0, 0, 0);
  font-family:"Scada";
  font-size:1rem;
  font-weight: 400;
  width:2.5rem;
  border-radius: 0 2px 2px 0;
  border:none;
  background:white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-button:hover{
  cursor: pointer;
  background: rgb(255, 255, 255);
}
.search-icon {
  width: 1.5rem;
  height: 1.5rem;
  opacity: 1;
  filter: opacity(0.4) drop-shadow(0 0 0 blue);
  object-fit: contain;
}
.search-button:hover .search-icon {
  filter: opacity(0.2) drop-shadow(0 0 0 rgb(201, 201, 255));
}

.game-page{
  flex: 1; 
  height: '100%';
  background:linear-gradient(0deg,rgb(194, 215, 217) 0%, rgba(135, 99, 227, 0.645) 80%);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.701);
  z-index: 12;
  pointer-events: none;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Cloud container - positioned absolutely behind content */
.cloud-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Extend height to allow for upward translation */
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
  filter: brightness(0.7) contrast(1.1) hue-rotate(20deg); /* Darker background clouds */
}

.cloud-mid {
  z-index: 2;
  filter: brightness(0.85) hue-rotate(20deg);
}

.cloud-front {
  z-index: 3;
  filter: hue-rotate(20deg)
}



.games-section {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr) );
  grid-auto-rows: auto;
  grid-gap: 1.5rem;
  padding: 4rem 20dvw;
  margin: 0 auto;
  position: relative;
  box-sizing: border-box;
  z-index: 10; /* Ensure games appear above clouds */
  overflow-y: visible;
  min-height: fit-content;
  justify-items:center;
}

.no-results-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'RetroQuill', sans-serif;
  font-size: 2rem;
  color: #2b1cd1;
  text-align: center;
  z-index: 10;
  pointer-events: none;
}

.game {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.6rem;
    border-radius: 5px;
    width: 15rem;
    height: fit-content;
    background-color: rgb(255, 255, 255);
    box-shadow: 2px 2px 5px rgba(36, 29, 29, 0.426),-2px -2px 5px rgba(36, 29, 29, 0.426);
    color: #000000;
    margin: 5px;
    padding: 0.5rem;
    position: relative;
    cursor: pointer;
    transition:all 0.05s ease-out;
}
.game:hover{
  transform:scale(1.05);
}

.gametitle {
    max-width: 100%;
    font-size: 1.25rem;
    font-family:'Scada';
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

.game-user-rating {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    width: 100%;
}

.gameusername {
    font-size: 0.9rem;
    font-family: 'RetroQuill', sans-serif;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.gamestars {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
    margin-left:auto;
}

.star {
    width: 16px;
    height: 16px;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    flex-shrink: 0;
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
  background: white;
  border-radius: 8px;
  width: 80vw;
  max-width: 1000px;
  height: 70vh;
  max-height: 600px;
  padding: 1.5rem;
  overflow: hidden;
  overflow-y:scroll
}

.close-btn {
  outline:none;
  border:none;
  background:none;
  color: rgb(98, 98, 98);
  font-size: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  position:absolute;
  top:1rem;
  right:1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  line-height: 1;
  margin-left:auto;
}

.close-btn:hover {
  color: rgb(0, 0, 0);
  transform: scale(1.1);
}

.expanded-content {
  display: flex;
  gap: 30px;
  height: 100%;
}

.expanded-left {
  width:20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.expanded-title {
  font-family: 'Scada';
  color:black;
  font-weight: 600;
  font-size: 2rem;
  text-align: center;
}
.expanded-author{
    font-size: 1rem;
    font-family: 'RetroQuill', sans-serif;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align:left;
}
.expanded-rating-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}
.expanded-rating-label {
  font-family: 'Scada';
  font-size: 0.9rem;
  color: #666;
}
.expanded-stars {
  display: flex;
  gap: 4px;
  align-items: center;
}
.expanded-star {
  width: 24px;
  height: 24px;
  cursor: pointer;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  transition: transform 0.1s ease;
}
.expanded-star:hover {
  transform: scale(1.2);
}
.expanded-thumbnail-container {
  position: relative;
  width: 20rem;
  height: 20rem;
  cursor: pointer;
}

.expanded-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
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
  min-width: 0;
  flex-direction: column;
}
.desc-header-container{
  display:flex;
}
.desc-header {
  font-family: 'Scada';
  font-size: 1.5rem;
  color: #9d9d9d;
  margin-bottom: 0.25rem;
}
.hr-desc{
  border:none;
  border-bottom:2px #9d9d9d solid;
}

.expanded-description {
  margin: 1rem 0;
  height: 100%;
  border-radius: 8px;
  font-family: 'Scada';
  font-size: 18px;
  line-height: 1.6;
  overflow-x: hidden;
  overflow-y: auto;
  color: #333;
  text-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  width:100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 0 0 2rem 0;
  z-index: 10;
  position: fixed;
  bottom:0;
}

.pagination-btn {
  background-color: #181818;
  font-weight: 1000;
  border: none;
  border-radius: 32px;
  padding: 8px 16px;
  font-size: 16px;
  height:40px;
  width:40px;
  cursor: pointer;
  color: #ffffff;
  transition: all 0.2s;
}

.pagination-btn:hover:not(.disabled) {
  background-color: #e4e4e4;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 5px;
  align-items: center;
}

.pagination-number {
  background-color: #181818;
  border: none;
  border-radius: 32px;
  padding: 8px 12px;
  font-size: 18px;
  font-family: 'Scada';
  cursor: pointer;
  color: #FFF;
  
  min-width: 40px;
}

.pagination-number:hover {
  background-color: #f0f0f0;
}

.pagination-number.active {
  background-color: #181818;
  outline:2px #181818 solid;
  color: rgb(255, 255, 255);
  border:white 2px solid;
  font-weight: bold;
}
@media (max-width: 768px) {
  .cloud {
    transform: scale(0.5);
    transform-origin: center center;
  }
  .games-section {
    padding: 2rem 2rem;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0;
    row-gap:2rem;
  }
  .game {
    width:clamp(10rem,40vw,20rem)
  }
  .game > div {
    width: 100% !important;
  }
  .gametitle {
    width: 100%;
    max-width: 100%;
  }
  .gamepic {
    width: 100%;
    max-width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
  .gamepic .thumbnail {
    width: 100%;
    height: 100%;
  }
  .gamepic:hover .overlay-play {
    width:100%;
    height:auto;
    aspect-ratio: 1;
  }
  .expanded-content {
    flex-direction: column;
  }
  .expanded-left{
    width:100%;
  }

  input[type=search]{
    width:100%;
  }
}
</style>  