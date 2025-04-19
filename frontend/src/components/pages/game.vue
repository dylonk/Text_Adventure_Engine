<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';
import previewSetup from '@/components/editor/preview_setup.vue';
import previewObjectViewer from '@/components/editor/preview_object_viewer.vue';
import { useNodesStore } from '../editor/nodes/node_store.js';
import { useGameStore } from '../editor/nodes/game_logic.js'
import axios from 'axios';
import { fetchUserData } from '@/components/standardjs/fetchUserData';
import speakerIcon from '../../assets/Images/speaker_icon.png';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite




const GameLogic = useGameStore();
GameLogic.$dispose
GameLogic.initialized=false
let fetchedGame = {}//this is the full game object, it's not used in preview mode, but we need it for the metadata.
const NS = useNodesStore()
const userId = ref('');


const props = defineProps({
  gameTitle: {    //it's gonna use this to retrieve the game if it's not a preview
    type: String,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  },
});



//this function tries to find a savegame in the database.
//if it finds one, it loads it into the game
async function fetchSaveGame() {
  try {
    console.log("fetching savegame");
    const response = await axios.get(`${API_BASE_URL}/savegames/?gameId=${props.gameTitle}&userId=${userId}`);//response will be the savegame object
    //we then de-serialize the nodemap we get back
    response.data[0].nodeMap=serializableToMap(response.data.nodeMap);
    //and put the gamestate/game into the gamelogic. gamestate and game being essentially the same thing is very cool
    console.log(response.data);
    GameLogic.start(response.data.nodeMap);
}

  catch (error) {
    console.warn('Error fetching savegame:', error);    
  }
}

const gameContainer = ref(null);

onMounted(async() => {
  userId.value= await fetchUserData('_id');
  

  if (props.isPreview) {
    GameLogic.start(NS.compileGame());
  } 

  //if it's not a preview, we're going to get a game from the database.
  else if (props.gameTitle) {
  fetchGame(props.gameTitle);
  }

  //after fetching the game, check if we have a savegame. A little inefficient (if there's a savegame, the nodemap of the default game we already fetched is useless)
  //but it's easy and the datas so small that this shouldn't be a big issue
  fetchSaveGame();  

  
});



// converts gamedata back to a map. we may or may not need to use this elsewhere, 
// but it's essentially always used in the process of transferring games from the backend to a playable state.
function serializableToMap(obj) {
    const map = new Map();
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        map.set(Number(key), obj[key]);
      }
    }
    return map;
  }

  //yes, this function is a direct copypaste from project.store when i should have just imported both of these. Employers if you're looking at this 
  //I will not do this when I am working for you
  function mapToSerializable(map) {
      const obj = {};
      for (const [key, value] of map.entries()) {
        obj[key] = value;
      }
      return obj;
    }


//loads a game from the backend by title. This never fires for previews
async function fetchGame(gameTitle) {
  try {
    console.log("fetching game" + gameTitle);
    const response = await axios.get(`${API_BASE_URL}/games/${gameTitle}`);//response is the game
    console.log(response.data);
    fetchedGame = response.data;
    //we have to de-jsonify it now. We don't have to do this for previews because the backend isn't involved
    fetchedGame.nodeMap = serializableToMap(fetchedGame.nodeMap);
    //start the game logic using the game data. The rest of the response is important too, it's displayed in the template
    GameLogic.start(fetchedGame);
  } catch (error) {
    console.warn('Error fetching game:', error);    
  }
}


async function downloadGame() {
  // Create a copy of the game data with the nodeMap converted to a serializable format
  const gameToDownload = {
    ...fetchedGame,
    nodeMap: mapToSerializable(GameLogic.getNodeMap())
  };

  const gameJson = JSON.stringify(gameToDownload);
  const blob = new Blob([gameJson], { type: "application/json" });

    // Create a download link
  const gameTitle = fetchedGame.title || "text-adventure";
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${gameTitle}.quill`;
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const loadGameFromFile = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      // Parse the JSON file
      const gameData = JSON.parse(e.target.result);
      
      // Convert the nodeMap back to a Map object
      gameData.nodeMap = serializableToMap(gameData.nodeMap);
      
      // Store the game data and start the game
      fetchedGame = gameData;
      GameLogic.start(fetchedGame);
      
      // Reset user input and display
      userInput.value = "";
      GameLogic.outputQueue = [];
      
    } catch (error) {
      console.error("Error loading game file:", error);
      alert("Invalid game file format. Please select a valid .game.json file.");
    }
  };
  
  reader.readAsText(file);
};

// Create a hidden file input element for loading games
const createFileInput = () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".game.json";
  fileInput.style.display = "none";
  fileInput.addEventListener("change", loadGameFromFile);
  return fileInput;
};

// Function to trigger the file selection dialog
const importGame = () => {
  const fileInput = createFileInput();
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
};


const text = computed(()=>{
  return GameLogic.output
})


const displayText = ref("");
const userInput = ref("");
const typingIndex = ref(0);
const progress = ref(0);
const gameScreen = ref(null);
const ttsTog = ref(0);
const words = ref('');


const startTypingEffect = () => {
  if (typingIndex.value < text.value.length) {
    displayText.value += text.value.charAt(typingIndex.value);
    typingIndex.value++;
    setTimeout(startTypingEffect, 30);
  }
};



const toggleTTS = () => {
    if(ttsTog.value == 0) {
      ttsTog.value = 1;
      words.value = displayText.value;
      let newWords = words.value.split('<br>').join('');
      newWords = newWords.split('<span class=\'user-input\'>>').join('');
      newWords = newWords.split('<span class=\'highlight\'>').join('');
      newWords = newWords.split('</span>').join('');
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      const spokenWords = new SpeechSynthesisUtterance(newWords);
      speechSynthesis.speak(spokenWords);
    }
    else {
      ttsTog.value = 0;
      speechSynthesis.cancel();
    }
  };

  watch(displayText, (newValue, oldValue) => {
    if(displayText.value.length >= text.value.length && ttsTog.value == 1) {
      let newWords = displayText.value.replace(words.value, "");
      newWords = newWords + GameLogic.output;
      words.value = displayText.value;
      newWords = newWords.split('<br>').join('');
      newWords = newWords.split('<span class=\'user-input\'>>').join('');
      newWords = newWords.split('<span class=\'highlight\'>').join('');
      newWords = newWords.split('</span>').join('');
      speechSynthesis.cancel();
      const spokenWords = new SpeechSynthesisUtterance(newWords);
      speechSynthesis.speak(spokenWords);
    }
  });

const handleInput = () => {
      displayText.value += `<br><br><span class='user-input'>> ${userInput.value}</span>`;
      GameLogic.userResponse(userInput.value);
      nextTick(() => {
      });
      GameLogic.outputQueue.push(">> "+userInput.value)
      userInput.value = "";

  };

  // const processCommand = (command) => {
  //   if (command === "approach unicorn") {
  //     displayText.value += "<br><br>The unicorn allows you to get closer, its eyes glowing with wisdom.";
  //     progress.value += 20;
  //   } else if (command === "explore path") {
  //     displayText.value += "<br><br>You follow the glowing path deeper into the forest, mysteries ahead.";
  //     progress.value += 30;
  //   } else {
  //     displayText.value += "<br><br>Nothing happens... Try something else.";
  //   }
  // };


//saves a game to the backend
async function saveGame () {

  const response=await fetch (`${API_BASE_URL}/savegames/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      gameId: fetchedGame.id,
      userId: userId.value,
      nodeMap: mapToSerializable(GameLogic.getNodeMap())//gotta make sure this little guy is ready for jsonification
    })
  });
  console.log(userId.value);
}



const restartGame = () => {
  GameLogic.restartGame();
};

const quitGame = () => {
  alert("Game Over. Refresh to start again.");
};

onMounted(() => {
  startTypingEffect();
});
</script>

<template>
  <globalNavBar v-if="!isPreview"/>
    

  <div
    class="game-container"
    :class="[{ preview: isPreview}, $attrs.class]"
    ref="gameContainer"
    @mousedown="startDrag"
  >
    <div v-if="isPreview" class="left-side">
      <previewSetup />
    </div>
    
    
    <div class="game-playarea">
      <div class="game-controls">
      <button @click="saveGame">Save</button>
      <button @click="loadGame">Load</button>
      <button @click="restartGame">Restart</button>
      <button @click="quitGame">Quit</button>
      <button @click="downloadGame">Download</button>
      <button @click="importGame">Load From File</button>


      <div class="tts-toggle">
        <button @click="toggleTTS"><img :src="speakerIcon" style="height:100%;padding:0rem; padding-top:0.25rem"/></button>
      </div>
      <div v-if="!isPreview" class="title" style="margin-left: auto;">{{fetchedGame.title}}</div>
    </div>
      <div class="game-screen">
        <div style="margin-top:auto"></div>
        <div v-for="output in GameLogic.outputQueue" class="game-text">
          <div v-if="output[0] == '>'" style="color:yellow">
            {{ output }}
          </div>
          <div v-else style="color:gray">
            {{ output }}
          </div>
        </div>
        <div class="game-text">{{ GameLogic.output }}</div>
      </div>
    <div class="game-input">  
      <input v-model="userInput" @keyup.enter="handleInput" placeholder="Enter your command..." autofocus />
    </div>

    </div>

    <!-- Conditionally rendered components for preview mode -->

    <div v-if="isPreview" class="right-side">
      <previewObjectViewer/>
    </div>


  </div>
</template>

<style scoped>
.game-container {
  flex:1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
  font-family: monospace;
  position: relative;
}
.game-playarea{
  width:100%;
  height: 100%;
  flex:1;
  display:flex;
  flex-direction:column;
}

.game-container.preview {
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.left-side,
.right-side {
  width: fit-content;
  height: 100%;
  top: 0;
}

.left-side {
  left: 0;
}

.right-side {
  right: 0;
}

.resize-handle {
  width: 20px;
  height: 20px;
  background-color: #c0392b;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: se-resize;
}

.progress-bar {
  width: 80%;
  height: 10px;
  background: #444;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: #c0392b;
  transition: width 0.3s;
}

.game-screen {
  display:flex;
  flex-direction:column;
  width: 100%;
  height:100%;
  overflow-y: auto;
  padding: 1rem;
  background-color: #2e2e2e;
  white-space: pre-line;
}

.game-text-previous {
  font-size: 1.2rem;
  line-height: 1.5;
  color:rgb(211, 211, 211);
}
.game-text-previous-player {
  font-size: 1.2rem;
  line-height: 1.5;
  color:goldenrod;
}
.game-text {
  font-size: 1.2rem;
  line-height: 1.5;
  white-space: pre-wrap;
  display:block;
}

.game-input input {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  background: rgb(120, 120, 120);
  color: rgb(0, 0, 0);
  border:none;
  outline:none;
}
.game-input input:focus{
  background:rgb(197, 197, 197);
  border:none;
}

.game-controls {
  padding:0.5rem;
  display: flex;
  background-color: #1e1e1e;
  gap: 10px;
}


.game-controls button {
  padding: 10px;
  background: #e74c3c;
  border: none;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  height:50px;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  box-shadow: 4px 4px 0 #000;
  border-radius: 4px;
  transition: background 0.2s;
}

.game-controls button:hover {
  background: #c0392b;
}

.highlight {
  color: #c0392b;
  font-weight: bold;
}

.user-input {
  color: #c0392b;
  font-weight: bold;
}

.title{
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: white;
}
.description{
  font-size: 1rem;
  margin-bottom: 20px;
  color: white;
}
</style>