<script setup>
import { useNodesStore } from './nodes/node_store.js'
import {computed} from 'vue'
import globeIcon from '../../assets/Images/editor/globe.png'
const NS = useNodesStore()
const canvasName = computed(() => {
  NS.canvasID;
  return NS.getCurrentCanvasName()
});
</script>
<template>
    <div class="canvas-selector-container">
        <div class="selector-text">{{ canvasName }}</div>
    </div>
    <div class="canvas-selector-container" style="left:0px;">
        <img onload="this.width*=1" class="canvas-selector" :src="globeIcon">
    </div>
    <div>

    </div>
    <div class="canvas-selector-container">

    <img onload="this.width*=1" class="canvas-selector" :src="globeIcon">
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
    width:16dvw;
    left:0px;
    top:0px;
    z-index:1;
}

.selector-text{
    font-family: "Eagle Lake", serif;
    position:relative;
    font-size:1.4dvw;
    width:10dvw;
    left:1.1dvw;
    top:1.1dvw;
    color:rgb(255, 255, 255);
    text-overflow:ellipsis;
    z-index:4;
}
</style>