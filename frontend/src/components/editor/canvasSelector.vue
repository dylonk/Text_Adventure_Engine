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
        <div class="selected">{{ canvasName }}</div>
        </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans");
.canvas-selector-container{
    background:#060022;

    /* border: 2px rgb(40, 40, 45) solid; */
    padding: 0.5rem ;
}

.selected{
    position:relative;
    font-size:1rem;
    background:rgb(154, 153, 162);

    border-radius:4px;
    padding:0.125rem 0.5rem 0 0.5rem  ;
    width:100%;
    white-space: nowrap;
    color:rgb(0, 0, 0);
    text-overflow:ellipsis;
    z-index:4;
    font-family: 'Josefin Sans', sans-serif;
}
</style>