<template>
    <div>
      <globalNavBar />
      <div class="game-container">
        <div class="progress-bar">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="game-screen" ref="gameScreen">
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
          <div class="tts-toggle">
            <button @click="toggleTTS"><img src="@/assets/images/speaker_icon.png" width="40" height="40" style="padding:0 rem; padding-top:0.25rem"/></button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, watch } from 'vue';
  import globalNavBar from '@/components/standardjs/navbar.vue';
  
  const text = ref(`Welcome to the Enchanted Forest!<br><br>
  You find yourself in a dense forest. The trees whisper secrets and a soft glow emanates from a path ahead.<br>
  A majestic <span class='highlight'>unicorn</span> watches you cautiously.<br><br>
  What will you do?`);
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