<script setup>
import { useNodesStore } from '@/components/editor/nodes/node_store.js'
import { computed, ref, defineProps } from 'vue'
import { useGameStore } from './nodes/game_logic'
import ContextMenu from './context_menu.vue'
import PreviewObject from './nodes/node_assets/preview_object.vue'

const GL = useGameStore();

// Use computed properties to observe the nodes in the store. Any with object_type_list will be displayed
function renderObjectView(){
  GL.scopeSyncer =! GL.scopeSyncer
}


</script>

<template>
    <div class="asset_browser">
      <h3>Game View</h3>
      <div v-if="GL.scopeSyncer!=null" class="objects-container" @click="renderObjectView()">
        <PreviewObject v-if="GL.initialized" id="0" nodeDepth="0"/>
      </div>
    </div>
</template>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Scada");
.asset_browser {
  height:100%;
  display: flex;
  font-size:large;
  justify-content: center;
  flex-direction: column;
  background: rgb(227, 227, 227);
  justify-content: space-between;
}
.asset-browser-hr{
  margin-top:5px;
  margin-bottom:5px;
}
.ab-object{
  display:flex;
  flex-direction: row;
  height:min-height;
}

h3 {
  font-weight:100; 
  font-size:20px;
  color: rgb(121, 121, 121);
  
  padding-right:10px;
  padding-left:10px;
  text-align: center;
  width:auto;
  border-bottom: rgb(186, 186, 186) 3px groove;

}

ul {
  margin-left: 20px;
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
  font-size: 1em;
  color: #444;
}

.objects-container {
  height: 100%;
  overflow-y:scroll;
  border: inset  rgb(190, 190, 190) 2px;
  overflow-x:scroll;
  border-radius: 10px;
  background: rgb(192, 201, 212);
  width:200px;
  margin:10px;
}

details div {
  cursor: pointer;
  font-weight: bold;
}

.canvas-selector{
  position:fixed;
  pointer-events: none;
}
</style>
