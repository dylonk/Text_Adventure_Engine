<script setup>
import { ref, provide } from 'vue'
import Toolbox from './toolbox.vue'
import Canvas from './canvas/canvas.vue'
import AssetBrowser from './asset_browser.vue'
import globalNavBar from '@/components/standardjs/navbar.vue'
import Toolbar from './toolbar.vue'
import CanvasSelector from './canvasSelector.vue'
import gamePreview from '@/components/pages/game.vue'
import { useProjectStore } from './project_store'

function updateAssets(){
  // Placeholder for update logic
}
</script>

<!-- This is the outermost layer of the editor -->
<template>
  <Toolbar/>
  <div class="editor-container">
    <!-- The Toolbox, AssetBrowser, CanvasSelector, and Canvas are only visible if the preview is not active -->
    <Toolbox v-if="!useProjectStore().showPreview" />
    <gamePreview
      v-if="useProjectStore().showPreview"
      class="previewScreen"
      :isPreview="true"
    ></gamePreview>
    <CanvasSelector v-if="!useProjectStore().showPreview" />
    <Canvas v-if="!useProjectStore().showPreview" />
    <AssetBrowser v-if="!useProjectStore().showPreview" />
  </div>
</template>

<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  color: black;
}


.editor-topbar {
    z-index: 100;
}
.editor-container {
  width: 100vw;
  height: 100vh;
  max-height: 100vh !important;
  display: flex;
  flex-direction: row;
  background: white;
  overflow: hidden;
  position: relative;
}

.editor_topbar {
  width: 100%;
  height: min-content;
  font-size: 12px;
  background-image: linear-gradient(180deg, gray, white);
  border-bottom: darkslategray solid 2px;
}

/* Style for the preview screen */
.previewScreen {
  position: absolute; /* Absolute positioning to overlap everything */
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 40px); /* Subtract navbar height, adjust as needed */
  background-color: black;
  z-index: 100; /* Ensure it is on top */
}

/* Ensure the Toolbox, AssetBrowser, CanvasSelector, and Canvas are only visible when preview is not active */
.Toolbox,
.CanvasSelector,
.AssetBrowser,
.Canvas {
  position: relative;
  z-index: 1;
}

/* Optionally, add a transition or effects to these elements */
.Toolbox,
.CanvasSelector,
.AssetBrowser,
.Canvas {
  transition: all 0.3s ease-in-out;
}
</style>
