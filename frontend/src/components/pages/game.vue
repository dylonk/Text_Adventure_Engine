<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import previewSetup from '@/components/editor/preview_setup.vue';
import previewObjectViewer from '@/components/editor/preview_object_viewer.vue';
import { useNodesStore } from '../editor/nodes/node_store.js';
import { useGameStore } from '../editor/nodes/game_logic.js'
import axios from 'axios';
import { fetchUserData } from '@/components/standardjs/fetchUserData';
import speakerIcon from '../../assets/Images/speaker_icon.png';
import JSZip from 'jszip';
import { HContainer } from '../editor/nodes/node_assets/n-component-imports.js';
import Toastify from 'toastify-js';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite
import { cloneDeep } from 'lodash';
import { clone } from 'lodash';




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
    if(isPreview){
       GameLogic.start(NS.compileGame())
       return
    }
    
    console.log("fetching savegame");
    const response = await axios.get(`${API_BASE_URL}/savegames/?gameId=${props.gameTitle}&userId=${userId}`);//response will be the savegame object
    //we then de-serialize the nodemap we get back
    response.data[0].nodeMap=serializableToMap(response.data.nodeMap);
    //and put the gamestate/game into the gamelogic. gamestate and game being essentially the same thing is very cool
    console.log(response.data);
    if(response.data==undefined){
      GameLogic.start()
    }
    GameLogic.start(response.data.nodeMap);
}

  catch (error) {
    console.warn('Error fetching savegame:', error);    
  }
}

const compileGame = () =>{
  Toastify({
            text: "Compiling game and restarting!",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
            stopOnFocus: true,
          }).showToast();
  GameLogic.start(NS.compileGame())
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


async function saveJSON(){
  const gameJSON = GameLogic.saveGameAsJSON()
  // Create and download the zip
  const blob = new Blob([gameJSON], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fetchedGame.title.replace(/\s/g, "") || "text-adventure";
  a.download = a.download+'.json'
  document.body.appendChild(a); // needed for Firefox
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}




async function downloadGame() {
  // Create a copy of the game data with the nodeMap converted to a serializable format
  const gameToDownload = {
    ...fetchedGame,
    nodeMap: mapToSerializable(GameLogic.getNodeMap())
  };

    //creates a new zip file
    const zip=new JSZip();
  const imagesFolder = zip.folder("assets/images");
  const images = gameToDownload.images;


  //if there even are images, download all the images and put them in the folder
  if (images && Object.keys(images).length > 0) {
  //saves all the images to the images folder
  for (const [name, url] of Object.entries(images)) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    imagesFolder.file(`${name}.jpeg`, blob); // "dog.jpeg", "whitedog.jpeg"
  } catch (err) {
    console.warn("Failed to download image:", url, err);
  }
  }
}

  zip.file("game.json", JSON.stringify(gameToDownload, null, 2));

  // Create and download the zip
  const content = await zip.generateAsync({ type: "blob" });

    // Create a download link
  const gameTitle = fetchedGame.title || "text-adventure";
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = `${props.gameTitle}.zip`;

  // Trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const loadGame = () =>{
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const gameJSON = JSON.parse(text);
      GameLogic.loadJSON(gameJSON);
    } catch (error) {
      console.error("Error loading game:", error);
      Toastify({
        text: "Error loading game",
        duration: 2000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4d4d",
        stopOnFocus: true,
      }).showToast();
    }
  };

  input.click(); // Trigger file selection dialog
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
      GameLogic.loadJSON(fetchedGame);      
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

const displayOutput = ref("")
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
      newWords = newWords.split('<span class=\'user-input\'>').join('');
      newWords = newWords.split('<span class=\'highlight\'>').join('');
      newWords = newWords.split('</span>').join('');
      speechSynthesis.cancel();
      const spokenWords = new SpeechSynthesisUtterance(newWords);
      speechSynthesis.speak(spokenWords);
    }
  });

const commands_help = () => {
  let currCommands = GameLogic.userResponse("commands");
  GameLogic.outputQueue.push(currCommands);

  nextTick(() => {
  });
};


const textInput = ref(null);
const gameScreenText = ref(null);

async function handleInput(){
      displayText.value += `<br><br><span class='user-input'>> ${userInput.value}</span>`;
      GameLogic.userResponse(userInput.value);
      nextTick(() => {
      });
      GameLogic.outputQueue.push("> "+userInput.value)

      nextTick(() => {
      });
      userInput.value = "";
      await nextTick();
      const div = gameScreenText.value;
      div.scrollTop = div.scrollHeight
    };
  watch(() => GameLogic.allowUserInput, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (textInput.value) {
        textInput.value.focus();
      }
    });
  }
});

//saves a game in nonzipped file format
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
  Toastify({
            text: "Restarting game",
            duration: 2000,
            gravity: "top",
            position: "right",
            backgroundColor: "green",
            stopOnFocus: true,
          }).showToast();
  GameLogic.restartGame();
};

const gamelogicOutput = ref("")



</script>

<template>    
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
      <div  class="game-controls">
    
      <HContainer v-if="isPreview" spacing="10px">
        <button @click="compileGame" style="background:steelblue">Compile</button>
        <button @click="downloadGame" style="background:steelblue">Download</button>
        <button @click="saveJSON()" >Save</button>
        <button @click="loadGame()">Load</button>
        <button @click="commands_help">Commands</button>
        <button @click="toggleTTS"><img :src="speakerIcon" style="height:100%;padding:0rem; padding-top:0.25rem"/></button>
      </HContainer>
      <HContainer v-else spacing="10px">
        <button @click="saveJSON()" >Save</button>
        <button @click="loadGame()">Load</button>
        <button @click="restartGame">Restart</button>
        <button @click="commands_help">Commands</button>
        <button @click="toggleTTS"><img :src="speakerIcon" style="height:100%;padding:0rem; padding-top:0.25rem"/></button>
      </HContainer>

      <div v-if="!isPreview"  style="margin-left: auto;">

        <HContainer spacing="10px">
          <div class="title">
            {{props.gameTitle}}
          </div>
          <button @click="downloadGame" style="background:#09d692">Download</button>
        </HContainer>
      </div>
    </div>
      <div class="game-image-display">
          <img 
            v-if="GameLogic.currentImagePath" 
            class="game-image"
            :src="GameLogic.currentImagePath" 
            alt="Game Image"
          >
      </div>
      <div v-if="GameLogic.initialized" class="game-screen" ref="gameScreenText">
        
        <div style="margin-top:auto"></div>
        <div v-for="output in GameLogic.outputQueue" class="game-text">
          <div v-if="output[0] == '>'" style="color:yellow">
            {{ output }}
          </div>
          <div v-else-if="output[0] == '!'" style="color:red">
            {{ output }}
          </div>
          <div v-else style="color:gray">
            {{ output }}
          </div>
        </div>
        <div v-if="GameLogic.output!=null" class="game-text">{{ GameLogic.output }}</div>
      </div>
      <div v-else class="game-screen" ref="gameScreenText">
        
        <div style="margin-top:auto"></div>

      </div>
    <div class="game-input">  
      <input v-if="GameLogic.allowUserInput" ref="textInput" v-model="userInput" @keyup.enter="handleInput()" placeholder="Enter your command..." autofocus />
      <div v-else class="input-disabled">Waiting...</div>
    </div>

    </div>

    <!-- Conditionally rendered components for preview mode -->

    <div v-if="isPreview" class="right-side">
      <previewObjectViewer/>
    </div>


  </div>
</template>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Cascadia+Mono&display=swap';

.game-container {
  flex-grow:1;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow:hidden;
  justify-content: center;
  background-color: black;
  max-height:100%;
  color: white;
  font-family: 'Cascadia Mono', monospace;
  position: relative;
}
.game-playarea{
  width: 100dvw;
  max-height:100%;
  height:100%;
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
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  padding: 1rem;
  background-color: #2e2e2e;
  white-space: pre-line;
}

.game-text-previous {
  font-size: 1.2rem;
  line-height: 1.5;
  color:rgb(235, 235, 235);
}
.game-text-previous-player {
  font-size: 1.2rem;
  line-height: 1.5;
  color:goldenrod;
}
.game-text {
  font-size: 1.2rem;
  line-height: 1.5;
  max-height: 100%;
  white-space: pre-wrap;
  display:block;
}

.game-input input {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  height:40px;
  background: rgb(120, 120, 120);
  color: rgb(0, 0, 0);
  border:none;
  outline:none;
}
.game-input .input-disabled{
  width: 100%;
  padding: 0.6rem;
  height:40px;
  font-size: 1rem;
  background: rgb(120, 120, 120);
  color: rgb(57, 57, 57);
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
  border: none;
  outline:none;
  color: #000000;
  font-size: 1rem;
  font-weight: bold;
  height:50px;
  cursor: pointer;
  transition: background 0.2s;
}

.game-controls button:hover {
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
  font-family: 'RetroQuill';
  height: 100%;
  color: white;
}
.description{
  font-size: 1rem;
  margin-bottom: 20px;
  color: white;
}


.game-image-display {
  width: 100%;
  background-color: #000000;
  display: flex;
  flex-shrink:0;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.game-image {
  height:35dvh;
  object-fit: contain;
}

.game-text-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.game-text {
  font-size: 1.2rem;
  line-height: 1.5;
  white-space: pre-wrap;
  display: block;
}

.game-text-content {
  color: #e0e0e0;
  margin: 5px 0;
}


.game-image img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border: 1px solid #404040;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  object-fit: contain;
}

.game-output-content :deep(img) {
  width: 10%;
  max-height: 10vh;
  border-radius: 4px;
  border: 1px solid #404040;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  margin: 5px 0;
  display: block;
  object-fit: contain;
}

</style>
