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

    <!-- Resize handle for preview mode -->
    <div 
      v-if="isPreview" 
      class="resize-handle" 
      @mousedown="startResize"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';

const props = defineProps({
  isPreview: {
    type: Boolean,
    default: false
  },
});

const isDragging = ref(false);
const isResizing = ref(false);
const offsetX = ref(0);
const offsetY = ref(0);
const gameContainer = ref(null);

// Resize logic
const minWidth = 100; // minimum width
const minHeight = 100; // minimum height
const initialWidth = ref(500);
const initialHeight = ref(200);
const previewWidth = ref(initialWidth.value);
const previewHeight = ref(initialHeight.value);

const startDrag = (event) => {
  // Only allow dragging if we are not resizing
  if (isResizing.value) return;

  isDragging.value = true;
  offsetX.value = event.clientX - gameContainer.value.getBoundingClientRect().left;
  offsetY.value = event.clientY - gameContainer.value.getBoundingClientRect().top;
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
};

const drag = (event) => {
  if (isDragging.value) {
    gameContainer.value.style.left = `${event.clientX - offsetX.value}px`;
    gameContainer.value.style.top = `${event.clientY - offsetY.value}px`;
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
};

// Start resizing
const startResize = (event) => {
  isResizing.value = true;

  // Disable dragging during resizing
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);

  const startWidth = previewWidth.value;
  const startHeight = previewHeight.value;
  const startX = event.clientX;
  const startY = event.clientY;

  const resizeMove = (moveEvent) => {
    if (isResizing.value) {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const newWidth = Math.max(minWidth, startWidth + deltaX);
      const newHeight = Math.max(minHeight, startHeight + deltaY);

      previewWidth.value = newWidth;
      previewHeight.value = newHeight;
    }
  };

  const stopResize = () => {
    isResizing.value = false;
    window.removeEventListener('mousemove', resizeMove);
    window.removeEventListener('mouseup', stopResize);

    // Re-enable drag after resizing is finished
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  };

  window.addEventListener('mousemove', resizeMove);
  window.addEventListener('mouseup', stopResize);
};

onMounted(() => {
  if (props.isPreview) {
    gameContainer.value.style.position = 'absolute';
  }
});

const text = ref(`Welcome to the Enchanted Forest!<br><br>
  You find yourself in a dense forest. The trees whisper secrets and a soft glow emanates from a path ahead.<br>
  A majestic <span class='highlight'>unicorn</span> watches you cautiously.<br><br>
  What will you do?`);
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
}

.game-container.preview {
  position: fixed;
  bottom: 100px;
  right: 100px;
  font-size: 0.8rem;
  border: 2px solid #c0392b;
  overflow: hidden;
  resize: none; /* Disable default resize behavior */
}

.resize-handle {
  width: 20px;
  height: 20px;
  background-color: #c0392b;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: se-resize; /* South-east resize cursor */
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
  width: 80%;
  height: 60vh;
  overflow-y: auto;
  padding: 1rem;
  border: 2px solid #c0392b;
  background-color: #222;
  white-space: pre-line;
}

.game-text {
  font-size: 1.2rem;
  line-height: 1.5;
}

.game-input input {
  width: 80%;
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
