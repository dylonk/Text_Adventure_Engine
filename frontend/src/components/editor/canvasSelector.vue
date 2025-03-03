<script setup>
import { useNodesStore } from './nodes/node_store.js'

const NS = useNodesStore()

</script>
<template>
    <div class="canvas-selector-container">
        <img onload="this.width*=0.45" class="canvas-selector" src="@/assets/Images/editor/currentcanvas.png">
        <div class="selector-text">{{ NS.getCurrentCanvasName() }}</div>
    </div>
</template>
<style scoped>
.canvas-selector-container{
    position:relative;
    width: 0px;
    height: 0px;
    pointer-events: none;
    z-index:2;
}
.canvas-selector{
    position: relative;
    width:250px;
    left:20px;
    top:10px;
}
.selector-text{
    position:relative;
    font-size:x-large;
    width:185px;
    height:40px;
    left:70px;
    top:-50px;
    color:white;
    text-overflow:ellipsis;
    z-index:1;
}
</style>