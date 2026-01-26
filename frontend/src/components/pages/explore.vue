<script setup>
import axios from 'axios';
import { ref, onMounted, watch, onUnmounted, nextTick, computed } from 'vue';   
import defaultThumbnail from '@/assets/Images/defaultgameimage.jpg'
import wizardPfp from '@/assets/Images/wizardpfp.png'
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
import playButtonIcon from '@/assets/Images/playbutton.png'

import game from './game.vue';
import { useRouter } from 'vue-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite


const router = useRouter();
const defaultThumb = ref(defaultThumbnail)


const recentGames = ref([]);
const searchQuery = ref('');
const searchInput = ref(''); // Separate ref for the input field
const expandedGame = ref(null);
const userRating = ref(null); // User's current rating for the expanded game
const hoveredRating = ref(null); // For hover effect on stars
const expandedProfileImage = ref(null); // Profile image for the expanded game's creator
const currentPage = ref(1);
const itemsPerPage = ref(8); // Set to 1 for testing
const isSearching = ref(false);
const expandedCardRef = ref(null);
const expandedRightRef = ref(null);
const isScrolled = ref(false);

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

// Computed property to get pagination numbers with ellipses
const paginationNumbers = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];
  
  if (total <= 6) {
    // Show all pages if 6 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push({ type: 'number', value: i });
    }
  } else {
    // Always show first page
    pages.push({ type: 'number', value: 1 });
    
    // Determine which pages to show around current page
    let startPage = Math.max(2, current - 1);
    let endPage = Math.min(total - 1, current + 1);
    
    // Adjust if we're near the beginning
    if (current <= 3) {
      endPage = Math.min(4, total - 1);
    }
    
    // Adjust if we're near the end
    if (current >= total - 2) {
      startPage = Math.max(2, total - 3);
    }
    
    // Add ellipses and pages
    if (startPage > 2) {
      pages.push({ type: 'ellipsis', value: '...' });
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push({ type: 'number', value: i });
    }
    
    if (endPage < total - 1) {
      pages.push({ type: 'ellipsis', value: '...' });
    }
    
    // Always show last page
    pages.push({ type: 'number', value: total });
  }
  
  return pages;
});

// Computed property to get expanded title font size
const expandedTitleFontSize = computed(() => {
  if (expandedGame.value && expandedGame.value.title && expandedGame.value.title.length > 16) {
    return '1.5rem';
  }
  return '2rem';
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
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const expandGame = async (game) => {
  expandedGame.value = game;
  userRating.value = null;
  hoveredRating.value = null;
  expandedProfileImage.value = null; // Reset profile image
  // Fetch user's current rating for this game
  await fetchUserRating(game.id);
  // Fetch creator's profile image
  await fetchCreatorProfileImage(game.userid);
};

// Fetch creator's profile image by user ID
const fetchCreatorProfileImage = async (userId) => {
  if (!userId || !userId._id) {
    expandedProfileImage.value = null;
    return;
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId._id}`);
    expandedProfileImage.value = response.data.profileImage || null;
  } catch (error) {
    console.warn('Error fetching creator profile image:', error);
    expandedProfileImage.value = null;
  }
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
  expandedProfileImage.value = null;
  isScrolled.value = false;
};

// Handle scroll on expanded card right section
const handleCardScroll = () => {
  if (expandedRightRef.value) {
    const scrollTop = expandedRightRef.value.scrollTop;
    isScrolled.value = scrollTop > 20; // Show shadow after scrolling 20px
  }
};

// Watch for expanded game changes to set up scroll listener
watch(expandedGame, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (expandedRightRef.value) {
      expandedRightRef.value.addEventListener('scroll', handleCardScroll);
      handleCardScroll(); // Check initial scroll position
    }
  } else {
    if (expandedRightRef.value) {
      expandedRightRef.value.removeEventListener('scroll', handleCardScroll);
    }
    isScrolled.value = false;
  }
});

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
    <div class="search-bar-wrapper">
        <form id="section-bar" @submit.prevent="performSearch">
            <input type="search" name="search-bar" placeholder="Find your next adventure!" v-model="searchInput" @keyup.enter="performSearch">
            <button type="button" class="search-button" @click="performSearch">
              <img :src="searchIcon" alt="Search" class="search-icon">
            </button>
        </form>
        <!-- Pagination for landscape mode -->
        <div v-if="totalPages > 1" class="pagination-container pagination-landscape">
          <div class="pagination-numbers">
            <button 
              class="pagination-btn" 
              @click="prevPage" 
              :disabled="currentPage === 1"
              :class="{ disabled: currentPage === 1 }"
            >
              ‹
            </button>
            <template v-for="item in paginationNumbers" :key="item.value">
              <button
                v-if="item.type === 'number'"
                class="pagination-number"
                :class="{ active: item.value === currentPage }"
                @click="goToPage(item.value)"
              >
                {{ item.value }}
              </button>
              <span v-else class="pagination-ellipsis">{{ item.value }}</span>
            </template>
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
    </div>
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
        <!-- Pagination Controls for portrait mode -->
        <div v-if="totalPages > 1" class="pagination-container pagination-portrait">
          <div class="pagination-numbers">
            <button 
              class="pagination-btn" 
              @click="prevPage" 
              :disabled="currentPage === 1"
              :class="{ disabled: currentPage === 1 }"
            >
              ‹
            </button>
            <template v-for="item in paginationNumbers" :key="item.value">
              <button
                v-if="item.type === 'number'"
                class="pagination-number"
                :class="{ active: item.value === currentPage }"
                @click="goToPage(item.value)"
              >
                {{ item.value }}
              </button>
              <span v-else class="pagination-ellipsis">{{ item.value }}</span>
            </template>
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
    </div>

    <!-- Expanded Game Overlay -->
    <div v-if="expandedGame" class="overlay" @click.self="closeExpanded">
      <div class="expanded-card" ref="expandedCardRef">
        <button class="close-btn" :class="{ 'scrolled': isScrolled }" @click="closeExpanded">×</button>
        <div class="expanded-content">
          <div class="expanded-left">
            <div class="expanded-thumbnail-container">
              <img :src="expandedGame.thumbnail||defaultThumb" class="expanded-thumbnail">
            </div>
            <h2 class="expanded-title" :style="{ fontSize: expandedTitleFontSize }">{{expandedGame.title}}</h2>
            <div class="expanded-author">
              <img 
                :src="expandedProfileImage && expandedProfileImage !== '' ? expandedProfileImage : wizardPfp" 
                alt="Profile Picture" 
                class="expanded-author-pfp"
              />
              <span>by {{expandedGame.username || 'unknown'}}</span>
            </div>
            <div class="play-game-button-container">
              <button class="play-game-button" @click="goToGame(expandedGame.title)">
                <img :src="playButtonIcon" alt="Play" class="play-button-icon" />
                Play game
              </button>
            </div>
          </div>
          <div class="expanded-right" ref="expandedRightRef">
            <div class="desc-header-container">
              <h3 class="desc-header">Description</h3>
            </div>
            <!-- <hr class="hr-desc"></hr> -->
            <div class="expanded-description">
              {{ expandedGame.description }}
            </div>
            <div class="expanded-rating-container">
              <div class="expanded-rating-label">Rate this experience</div>
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
        </div>
      </div>
    </div>

</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans");

.search-bar-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    height:3rem;
    padding: 0 0.5rem 0.5rem 0.5rem;
    background-color: #181818;
    z-index: 13;
    flex-wrap: wrap;
}

#section-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    font-size: 2rem;
    letter-spacing: 2px;
    flex-shrink: 0;
  }

input[type=search] {
    font-family: 'Josefin Sans';
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
  font-family:"Josefin Sans";
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
  display: flex;
  flex-direction: column;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.872);
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
  grid-template-columns: repeat(4, minmax(15rem, 1fr) );
  grid-auto-rows: auto;
  grid-gap: 1.5rem;
  padding: 4rem 0;
  width:fit-content;
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
  background-color: rgba(0, 0, 0, 0.817);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.expanded-card {
  position: relative;
  background: #d8e0e8;
  border-radius: 8px;
  width: 80vw;
  max-width: 1000px;
  box-sizing: border-box;
  height: 80vh;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  max-height: 600px;
  overflow: hidden;
  overflow-y:scroll
}

.close-btn {
  outline:none;
  border:none;
  z-index:500;
  background:#d8e0e8;
  text-align:center;
  color: rgb(98, 98, 98);
  font-size: 2rem;
  width: 2.5rem;
  height: 2.5rem;
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
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: box-shadow 0.3s ease;
}

.close-btn:hover {

  color: rgb(0, 0, 0);
  transform:scale(1.05);
}

.close-btn.scrolled {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.expanded-content {
  display: flex;
  height: 100%;
}

.expanded-left {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  position: relative;
  width: 20rem;
  min-width: 0;
  border-radius:8px;
  background:white;
  margin:1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.15);
}


.expanded-title {
  margin-top:0.5rem;
  font-family: 'Josefin Sans';
  color:black;
  margin:1rem;
  width:18rem;
  font-weight: 600;
  font-size: 2rem;
  text-align: left;
  line-height: 1.2;
}
.expanded-author{
    font-size: 1rem;
    font-family: 'RetroQuill', sans-serif;
    color: #666;
    margin:1rem;
    margin-top:0;
    text-align:left;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
}

.expanded-author span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1 1 0;
}

.expanded-author-pfp {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}
.expanded-rating-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width:fit-content;
  margin-top: 0.5rem;
  border-radius: 8px;
  padding:1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);

  background:#ffffff;
}
.expanded-rating-label {
  font-family: 'Josefin Sans';
  font-weight:600;
  font-size: 0.9rem;
  color: #000000;
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
  transform: scale(1.1);
}
.expanded-thumbnail-container {
  position: relative;
  width:20rem;
  height: 20rem;
}

.expanded-thumbnail {
  height: 100%;
  width:100%;
  object-fit: cover;
}

.play-game-button-container {
  padding: 1rem;
  margin-top: auto;
  box-sizing: border-box;
}

.play-game-button {
  font-size: 1.1rem;
  padding: 16px 24px;
  border: none;
  background: #3d3d3d;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'RetroQuill', sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.185), 0 2px 4px rgba(0, 0, 0,  0.185);
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.play-button-icon {
  width: 1.2rem;
  height: 1.2rem;
  object-fit: contain;
  flex-shrink: 0;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.play-game-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  filter: brightness(1.05);
}

.play-game-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.expanded-right {
  flex: 1;
  display: flex;
  min-width: 0;
  padding:1rem;
  gap:0.5rem;
  flex-direction: column;
  overflow:scroll;
  background:rgb(216, 224, 232);
}
.desc-header-container{
  display:flex;
}
.desc-header {
  font-family: 'Josefin Sans';
  font-size: 1.5rem;
  color: #606060;
  margin-top: 1rem;
}
.hr-desc{
  border:none;
  border-bottom:2px #9d9d9d solid;
}

.expanded-description {
  border-radius: 8px;
  font-family: 'Josefin Sans';
  font-size: 18px;
  background:rgb(232, 237, 234);
  line-height: 1.6;
  outline:1px rgba(104, 97, 199, 0.403) solid;

  color: #333;
  text-wrap: wrap;
  padding:1rem;
  width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

/* Portrait pagination (at bottom) */
.pagination-portrait {
  width: 100%;
  padding: 1rem 0;
  background-color: rgb(24, 24, 24);
}

/* Landscape pagination (next to search bar) */
.pagination-landscape {
  flex-shrink: 0;
  padding: 0;
  background-color: transparent;
}

/* Hide landscape pagination in portrait mode */
@media (orientation: portrait) {
  .pagination-landscape {
    display: none !important;
  }
}

/* Hide portrait pagination in landscape mode */
@media (orientation: landscape) {
  .pagination-portrait {
    display: none !important;
  }
}

/* Also handle based on width for better responsiveness */
@media (max-width: 768px) {
  .pagination-landscape {
    display: none !important;
  }
  .pagination-portrait {
    display: flex !important;
  }
}

@media (min-width: 769px) and (orientation: landscape) {
  .pagination-landscape {
    display: flex !important;
  }
  .pagination-portrait {
    display: none !important;
  }
}

.pagination-btn {
  background-color: transparent;
  font-weight: 1000;
  border: none;
  border-radius: 0;
  padding: 8px 16px;
  font-size: 20px;
  height:30px;
  width:20px;
  cursor: pointer;
  color: #ffffff;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pagination-btn:first-child {
  border-radius: 4px 0 0 4px;
  color: #d26cb7;

}

.pagination-btn:last-child {
  border-radius: 0 4px 4px 0;
  color: #d26cb7;

}



.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0;
  align-items: center;
}

.pagination-number {
  background-color: transparent;
  border: none;
  text-decoration: underline;
  border-radius: 0;
  padding: 8px 0;
  font-size: 18px;
  font-family: 'Josefin Sans';
  cursor: pointer;
  color: #d26cb7;
  width: 30px;
  transition: all 0.2s;
  position: relative;
}




.pagination-number.active {
  color: rgb(255, 255, 255);
  text-decoration: none;
  text-shadow: 
    0.5px 0 0 rgba(255, 255, 255, 1),
    -0.5px 0 0 rgba(255, 255, 255, 1),
    0 0.5px 0 rgba(255, 255, 255, 1),
    0 -0.5px 0 rgba(255, 255, 255, 1);
}

.pagination-ellipsis {
  padding: 8px 8px;
  font-size: 18px;
  font-family: 'Josefin Sans';
  color: #d26cb7;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  user-select: none;
  pointer-events: none;
}

@media (max-width: 1100px) {
  .games-section {
    grid-template-columns: repeat(2, minmax(15rem, 1fr));
  }
}

@media (max-width: 768px) {
  .close-btn{
    background: transparent;
    position: fixed;
    top: 1rem;
    right: 1rem;
    color: white;
    z-index: 1001;
  }
  .cloud {
    transform: scale(0.5);
    transform-origin: center center;
  }
  .games-section {
    padding: 2rem 2rem;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;
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
  .expanded-card{
    overflow:scroll;
    height:90dvh;
  }
  .expanded-content {
    flex-direction: column;
  }
  .expanded-left{
    box-sizing: border-box;
    justify-content: center;
    overflow:visible;
    align-items: center;
    width: calc(100% - 2rem);
    margin: 1rem;
  }
  .expanded-thumbnail-container {
    width: 100%;
    height: 20rem;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
  }
  .expanded-thumbnail {
    border-radius: 8px 8px 0 0;
  }
  .expanded-title {
    width: 100%;
    margin:1rem;
    text-align: center;
  }
  .play-game-button-container {
    width: 100%;
    box-sizing: border-box;
  }
  .play-game-button {
    width: 100%;
  }
  .expanded-right {
    overflow:visible;
  }
  input[type=search]{
    width:100%;
    height:30px;
  }
  .search-bar-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  #section-bar {
    width: 100%;
  }
}
</style>  