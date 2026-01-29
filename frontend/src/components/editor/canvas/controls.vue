<!---This is the external map controls. These do not change between canvases, with the exception of the Global icon or the Object name bar-->
<script setup>
  import { ControlButton,Controls } from '@vue-flow/controls';
  
</script>

<template>
   <Controls position="bottom-right">
    </Controls>
</template>
<style>
.vue-flow__controls {
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);
}

.vue-flow__controls-button {
  background: #a0a0a0;
  border: none;
  border-bottom: 1px solid #000000;
  box-sizing: content-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  user-select: none;
  padding: 5px;
}

.vue-flow__controls-button svg {
  width: 100%;
  max-width: 12px;
  max-height: 12px;
}

.vue-flow__controls-button:hover {
  filter: brightness(150%);
}


.vue-flow__controls-button:disabled {
  pointer-events: none;
}

.vue-flow__controls-button:disabled svg {
  fill-opacity: 0.4;
}
</style>