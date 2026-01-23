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
        <div class="selector-text">Current Canvas</div>
        <div class="selected">{{ canvasName }}</div>
        </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Eagle+Lake&display=swap");
.canvas-selector-container{
    background:rgb(0, 0, 0);
    padding: 0 0 0.4rem 0;
}

.selector-text{
    position:relative;
    font-size:0.8rem;
    width:fit-content;
    padding: 0 0.5rem;
    background:rgb(211, 255, 35);
    white-space: nowrap;
    color:rgb(0, 0, 0);
    text-overflow:ellipsis;
    z-index:4;
    font-family: 'RetroQuill', sans-serif;
}
.selected{
    position:relative;
    border: 2px rgb(211, 255, 35) solid;
    font-size:1rem;
    background:rgb(0, 0, 0);
    width:100%;
    padding:0 0.5rem;
    white-space: nowrap;
    color:rgb(255, 255, 255);
    text-overflow:ellipsis;
    z-index:4;
    font-family: 'RetroQuill', sans-serif;
}
</style>