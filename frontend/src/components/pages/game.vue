<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';
import previewSetup from '@/components/editor/preview_setup.vue';
import previewObjectViewer from '@/components/editor/preview_object_viewer.vue';
import { useNodesStore } from '../editor/nodes/node_store.js';
import { useGameStore } from '../editor/nodes/game_logic.js'

const GameLogic = useGameStore();
GameLogic.$dispose
GameLogic.initialized=false

const NS = useNodesStore()

const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false
  },
});



const gameContainer = ref(null);

onMounted(() => {
  if (props.isPreview) {
    GameLogic.start(NS.compileGame());
  } 
});

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
      console.log('New words');
      let newWords = displayText.value.replace(words.value, "");
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
    if (userInput.value.trim()) {
      displayText.value += `<br><br><span class='user-input'>> ${userInput.value}</span>`;
      processCommand(userInput.value.trim().toLowerCase());
      userInput.value = "";
      nextTick(() => {
        gameScreen.value.scrollTop = gameScreen.value.scrollHeight;
      });
    }
  };

  const processCommand = (command) => {
    if (command === "approach unicorn") {
      displayText.value += "<br><br>The unicorn allows you to get closer, its eyes glowing with wisdom.";
      progress.value += 20;
    } else if (command === "explore path") {
      displayText.value += "<br><br>You follow the glowing path deeper into the forest, mysteries ahead.";
      progress.value += 30;
    } else {
      displayText.value += "<br><br>Nothing happens... Try something else.";
    }
  };
const saveGame = () => {
  localStorage.setItem('gameProgress', JSON.stringify({ text: displayText.value, progress: progress.value }));
};

const loadGame = () => {
  const savedData = JSON.parse(localStorage.getItem('gameProgress'));
  if (savedData) {
    displayText.value = savedData.text;
    progress.value = savedData.progress;
  }
};

const restartGame = () => {
  displayText.value = text.value;
  progress.value = 0;
  typingIndex.value = text.value.length;
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
      <div class="tts-toggle">
        <button @click="toggleTTS"><img src="@/assets/images/speaker_icon.png" style="height:100%;padding:0rem; padding-top:0.25rem"/></button>
      </div>
    </div>
      <div class="game-screen">
        <div class="game-text" v-html="displayText"></div>
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
  background-color: #222;
  top: 0;
}

.left-side {
  left: 0;
  width:300px;
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
  width: 100%;
  height:100%;
  overflow-y: auto;
  padding: 1rem;
  background-color: #222;
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
  padding:1rem;
  display: flex;
  background:gray;
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
</style>