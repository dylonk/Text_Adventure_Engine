<script setup>
import { useNodesStore } from './nodes/node_store.js'
import {computed} from 'vue'
import globeIcon from '../../assets/Images/editor/globe.png'
import canvasSelectorContainer from '../../assets/Images/editor/canvas-selection.png'
const NS = useNodesStore()
const canvasName = computed(() => {
  NS.canvasID;
  return NS.getCurrentCanvasName()
});
</script>
<template>
    <div>
    <div class="canvas-selector-container" style="left:0px; top:-4px">
        <div class="selector-text">{{ canvasName }}</div>
    </div>
        <img onload="this.width*=1" class="canvas-selector" :src="canvasSelectorContainer">
    <div class="canvas-selector-container">
        <img onload="this.width*=1" style="left:0px; top:-76px;" class="canvas-selector" :src="globeIcon">
    </div>
    </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Eagle+Lake&display=swap");
.canvas-selector-container{
    position:relative;
    width: 0px;
    height: 0px;
    pointer-events: none;
    overflow:visible;
}
.canvas-selector{
    position: relative;
    width:250px;
    left:0px;
    top:0px;
    z-index:1;
}

.selector-text{
    font-family: "Eagle Lake", serif;
    position:relative;
    font-size:small;
    background:rgb(0, 0, 0);
    width:150px;
    left:25px;
    overflow:hidden;
    white-space: nowrap;
    top:25px;
    color:rgb(255, 255, 255);
    text-overflow:ellipsis;
    z-index:4;
}
</style>