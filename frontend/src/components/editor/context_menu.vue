<template>
    <div
      v-if="visible"
      class="context-menu"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    >
      <ul>
        <li v-for="(action, index) in actions" :key="index" @click="handleAction(action)">
          {{ action.label }}
        </li>
      </ul>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'

  const props = defineProps({
    position: { type: Object, required: true },
    actions: { type: Array, required: true },  // Accept actions as an array
  })

  const emit = defineEmits(['action', 'hide-context-menu'])

  const visible = ref(true)

  function hide() {
    visible.value = false
    emit('hide-context-menu')
  }

  function handleAction(action) {//handles the action for the contextmenu
    emit('action', action)
    hide()
  }

  document.addEventListener('click', () => hide())  // Close the menu on outside click
  </script>

  <style scoped>
  .context-menu {
    position: absolute;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    width: 150px;
    padding: 5px 0;
  }

  .context-menu ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .context-menu li {
    padding: 8px;
    cursor: pointer;
  }

  .context-menu li:hover {
    background-color: #f0f0f0;
  }
  </style>
