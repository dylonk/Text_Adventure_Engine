<!---FATHER CLASS OF ALL NODES-->
<script setup>
import { ref, defineProps, computed } from 'vue';
import useDragAndDrop from '../drag_drop.js';
import ContextMenu from '../context_menu.vue'
import { Position } from '@vue-flow/core';


const props = defineProps({
    id:Number,
    node_type:String, //NODE TYPE IS EXCLUSIVELY FOR COMMUNICATING, should not appear in finished product
    display_type: { type: String, default: 'Unnamed Node' },
    bg_color: { type: String, default: '#FFF' },
    stroke_color: { type: String, default: '#000'},
    children: { type: Array, default: () => [] }, // Define items as an array prop with a default empty array
    // Moving these guys to their respective places
    node_properties: { type: Array, default: () => [] },
    //associated_function: String, //For when we actually start programming the script stuff
    function_arguments: {type: Array, default: () => []},
    Position: {type: Object, default: () => ({ x: 0, y: 0 })}, //position should be a prop, becuse we're gonna have to retrieve this stuff for project loading
    parentNode: { type: String, default: null }, // Use parentNode
    extent: { type: String, default: 'parent' },
})

const { onDragStart } = useDragAndDrop();
</script>

<template>
    <div class="node_container" :draggable="true" @dragstart="onDragStart($event, props.node_type)" :style="{ 'background-color': bg_color, 'outline-color':stroke_color }">
        <div class="node_title" :style="{ 'background-image': 'linear-gradient(180deg,' + bg_color + ',' + stroke_color + ')' }">{{ props.display_type }}</div>
        <slot></slot>
    </div>
</template>
    background-image: linear-gradient(180deg, rgb(197, 201, 179),rgb(214, 212, 199),rgb(214, 212, 199), rgb(214, 212, 199),rgb(215, 211, 185), rgb(191, 194, 179));

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';
*{
        font-family: 'Syne Mono', monospace;

}
.node_container{
    overflow:hidden;
    background:var(--element-color);
    outline: 1px solid;
    height:150px;
    width:150px;
    display:flex;
    flex-direction: column;
    border-radius: 6px;
}
.node_container>*{
    margin:10px;
}
.node_title{
    font-family: 'Syne Mono', monospace;
    color:rgb(255, 255, 255);
    width:100%;
    font-weight: 800;
    font-size:14px;
    margin:0px;
    padding:0px;
    padding-left:5px;
    padding-right:5px;
    text-shadow: v-bind(stroke_color) -1px 1px, v-bind(stroke_color) -1px -1px,  v-bind(stroke_color) -2px 0px;
}
textarea{
    color:blue;
}
</style>