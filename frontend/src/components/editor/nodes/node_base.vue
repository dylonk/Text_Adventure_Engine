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
    bg_color:String,
    //children: { type: Array, default: () => [] }, // Define items as an array prop with a default empty array
    // Moving these guys to their respective places
    //node_properties: { type: Array, default: () => [] },
    //associated_function: String, //For when we actually start programming the script stuff
    //function_arguments: {type: Array, default: () => []},
    Position: {type: Object, default: () => ({ x: 0, y: 0 })}, //position should be a prop, becuse we're gonna have to retrieve this stuff for project loading

})
const { onDragStart } = useDragAndDrop();
</script>
<template>
    <div class="node_container" :draggable="true" @dragstart="onDragStart($event, props.node_type)" >
        <div class="node_title">{{ props.display_type }}</div>
        <slot></slot>
    </div>
</template>
<style scoped>
.node_container{
    padding:10px;
    background:rgb(255, 255, 255);
    outline: 1px solid rgb(67, 67, 67);
    height:fit-content;
    width:fit-content;
    display:flex;
    flex-direction: column;
    border-radius: 6px;
}
.node_title{
    color:gray;
    font-weight: 600;
    font-size:20px;
    padding:3px;
}
</style>