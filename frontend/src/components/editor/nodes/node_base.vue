<!---FATHER CLASS OF ALL NODES-->
<script setup>
import { ref, defineProps, computed } from 'vue';
import useDragAndDrop from '../drag_drop.js';
import ContextMenu from '../context_menu.vue'
import { Position } from '@vue-flow/core';


const props = defineProps({
    id:Number,
    node_type:String,
    node_title: { type: String, default: 'Unnamed Node' },
    bg_color:String,
    children: { type: Array, default: () => [] }, // Define items as an array prop with a default empty array
    node_properties: { type: Array, default: () => [] },
    associated_function: String, //For when we actually start programming the script stuff
    function_arguments: {type: Array, default: () => []},    
    parentId: { type: Number, default: null },  // Add parentId to node properties. This may or may not only be useful for items.
    Position: {type: Object, default: () => ({ x: 0, y: 0 })}, //position should be a prop, becuse we're gonna have to retrieve this stuff for project loading

})
const { onDragStart } = useDragAndDrop();
</script>
<template>
    <div class="node_container" :draggable="true" @dragstart="onDragStart($event, props.node_type)" >
        <div class="node_type">{{ props.node_type }}</div>
        <div class="node_title">{{ props.node_title }}</div>
        <slot></slot>
    </div>
</template>
<style>
.node_container{
    padding:10px;
    background:rgb(255, 255, 255);
    outline: 2px solid black;
    height:fit-content;
    width:fit-content;
    display:flex;
    flex-direction: column;
}
.node_title{
    padding:3px;
}
</style>