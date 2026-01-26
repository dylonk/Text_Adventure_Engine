<script setup>
import { ref, provide } from 'vue'
import Toolbox from './toolbox.vue'
import Canvas from './canvas/canvas.vue'
import AssetBrowser from './asset_browser.vue'
import Toolbar from './toolbar.vue'
import CanvasSelector from './canvasSelector.vue'
import gamePreview from '@/components/pages/game.vue'
import { useProjectStore } from './project_store'
import Tutorial from '@/components/editor/tutorial.vue'
import PublishModal from '@/components/pages/publish.vue'

function updateAssets(){
  // Placeholder for update logic
}
</script>

<!-- This is the outermost layer of the editor -->
<template>
    <Toolbar/>
    <div class="editor-screenspace">
      <!-- The Toolbox, AssetBrowser, CanvasSelector, and Canvas are only visible if the preview is not active -->
      <Toolbox v-if="!useProjectStore().showPreview" />
      <gamePreview
        v-if="useProjectStore().showPreview"
        class="previewScreen"
        :isPreview="true"
      ></gamePreview>

      <Tutorial 
      v-if="useProjectStore().tutorialStep"

      />
      <Canvas v-if="!useProjectStore().showPreview" />
      <AssetBrowser v-if="!useProjectStore().showPreview" />
    </div>
    <PublishModal />
</template>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Cascadia+Mono&display=swap';
*{
  font-family:'Josefin Sans', Geneva, Tahoma, sans-serif;
  color:black;
  text-rendering: optimizeLegibility;
}


.editor-topbar {
    z-index: 100;
}
.editor-container{
  display:flex;
  height: 100%;
  flex-direction:column;
}

.editor-screenspace {
  width: 100vw;
  height: 100%;
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
  flex:1;
  top: 0;
  left: 0;
  width: 100%;
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
