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
        <div class="selector-text">Current Canvas</div>
        <div class="selector-text">{{ canvasName }}</div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Eagle+Lake&display=swap");
.canvas-selector-container{
    position:relative;
    pointer-events: none;
    overflow:visible;
}
.canvas-selector{
    position: relative;
    width:250px;
    z-index:1;
}

.selector-text{
    position:relative;
    font-size:1rem;
    background:rgb(0, 0, 0);
    width:100%;
    white-space: nowrap;
    color:rgb(255, 255, 255);
    text-overflow:ellipsis;
    z-index:4;
}
</style>