<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import { useGameStore } from './game_logic.js'


//this version of game.vue is built for offline mode. It'll be a little more stripped down.

const GameLogic = useGameStore();
GameLogic.$dispose
GameLogic.initialized=false
let Game = {}       //this is the game the user imports, with it's metadata. 


const props = defineProps({
  gameTitle: {    
    type: String,
    required: true
  },
});


const gameContainer = ref(null);




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



//this function will save the current nodemap to the offline players savegames; it will be folders with the game id as the name
const saveGame = () => {
  //we want to get the current game from gamelogic, since as far as i can see its not passed by ref.
  let fullGame=GameLogic.getGame();
  //and of course, flatten it to make it json serializable
  fullGame.nodeMap=mapToSerializable(fullGame.nodeMap);
  fullGame=JSON.stringify(fullGame);
  console.log("saving game",fullGame);
  window.electronAPI.saveGameFile(fullGame);
}

const restartGame = () => {
  GameLogic.restartGame();
};

const quitGame = () => {
  alert("Game Over. Refresh to start again.");
};

//in onmounted, we make listeners to the electron api.
onMounted(() => {
  window.electronAPI.onLoadGameData((data) => {
      console.log("loaded game data", data);
      //here is where we're going to need to check if we have a savegame in the users appdata
      Game=data;
      Game.nodeMap=serializableToMap(Game.nodeMap)
      GameLogic.start(Game);

  })  

  //see savegame function
  window.electronAPI.onMenuSaveGame(() => {
    console.log("saving game");
    saveGame();
  })  


  startTypingEffect();
});
</script>

<template>    
<div { display:flex; flex-direction: columns; height: 100 dvh; width: 100dvw; } >
<div class="main-container">
  <div
    class="game-container"
    ref="gameContainer"
    @mousedown="startDrag"
  >
    </div>
    <div class="game-playarea">
      <div class="game-controls">
      <button @click="restartGame">Restart</button>
      <button @click="quitGame">Quit</button>


      <div class="title" style="margin-left: auto;">{{Game.title}}</div>
      <div class="game-image-display">
          <img 
            v-if="GameLogic.currentImagePath" 
            :src="GameLogic.currentImagePath" 
            alt="Game Image"
          >
      </div>
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

.main-container{
   display:flex; flex-direction: columns; height: 100 dvh; width: 100dvw; 
}

.game-image-display {
  width: 100%;
  height: fit-content;
  max-height:50%;
  background-color: #252525;
  border-bottom: 1px solid #404040;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.game-image-display img {
  max-width: 100%;
  max-height: 100%;
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

.game-image {
  margin: 5px 0;
  display: flex;
  justify-content: center;
  max-width: 10%;
  max-height: 10%;
  align-self: flex-start;
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