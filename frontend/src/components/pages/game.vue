<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';
import previewSetup from '@/components/editor/preview_setup.vue';
import previewObjectViewer from '@/components/editor/preview_object_viewer.vue';
import { useNodesStore } from '../editor/nodes/node_store.js';
import GameLogic from '../editor/nodes/game_logic.js'

const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false
  },
});

const NS = useNodesStore()


const gameContainer = ref(null);


onMounted(() => {
  if (props.isPreview) {
    gameContainer.value.style.position = 'absolute';
    GameLogic.start(NS.compileGame());
  } 
});

const text = computed(()=>{
  return GameLogic.output.value
})
const displayText = ref("");
const userInput = ref("");
const typingIndex = ref(0);
const progress = ref(0);
const gameScreen = ref(null);


const startTypingEffect = () => {
  if (typingIndex.value < text.value.length) {
    displayText.value += text.value.charAt(typingIndex.value);
    typingIndex.value++;
    setTimeout(startTypingEffect, 30);
  }
};

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
  <div
    class="game-container"
    :class="[{ preview: isPreview}, $attrs.class]"
    ref="gameContainer"
    :style="{ width: previewWidth + 'px', height: previewHeight + 'px' }"
    @mousedown="startDrag"
  >
    <div v-if="!isPreview">
      <globalNavBar />
    </div>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="game-screen">
      <div class="game-text" v-html="displayText"></div>
    </div>
    <div class="game-input">  
      <input v-model="userInput" @keyup.enter="handleInput" placeholder="Enter your command..." autofocus />
    </div>
    <div class="game-controls">
      <button @click="saveGame">Save</button>
      <button @click="loadGame">Load</button>
      <button @click="restartGame">Restart</button>
      <button @click="quitGame">Quit</button>
    </div>

    <!-- Conditionally rendered components for preview mode -->
    <div v-if="isPreview" class="left-side">
      <previewSetup />
    </div>
    <div v-if="isPreview" class="right-side">
      <previewObjectViewer />
    </div>

    <!-- Resize handle for preview mode -->
    <div 
      v-if="isPreview" 
      class="resize-handle" 
      @mousedown="startResize"
    ></div>
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: black;
  color: white;
  font-family: monospace;
  position: relative;
}

.game-container.preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.left-side,
.right-side {
  width: 20%;
  height: 100%;
  background-color: #222;
  padding: 10px;
  position: absolute;
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
  width: 60%;
  height: 60vh;
  overflow-y: auto;
  padding: 1rem;
  background-color: #222;
  white-space: pre-line;
}

.game-text {
  font-size: 1.2rem;
  line-height: 1.5;
}

.game-input input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  font-size: 1rem;
  background: black;
  color: white;
  border: 2px solid #c0392b;
  outline: none;
}

.game-controls {
  margin-top: 1rem;
  display: flex;
  gap: 10px;
}

.game-controls button {
  padding: 0.5rem 1rem;
  background: #c0392b;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.game-controls button:hover {
  background: #a02d24;
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