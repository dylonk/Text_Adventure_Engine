<!---FATHER CLASS OF ALL NODES-->
<script setup>
import { ref, defineProps } from 'vue';
import useDragAndDrop from '../drag_drop.js';

const props = defineProps({
    id:Number,
    node_type:String,
    node_family:String, //Global, Object, or Room. This is used to decide the toolbox type.
    node_title:String, //9/10 times title and type should be the same. title is just aesthetic
    bg_color:String,
    node_handles: { type: Array, default: () => [] }, // Define items as an array prop with a default empty array
    children: { type: Array, default: () => [] }, // Define items as an array prop with a default empty array
    node_properties: { type: Array, default: () => [] },
    associated_function: String, //For when we actually start programming the script stuff
    function_arguments: {type: Array, default: () => []}
})
const { onDragStart } = useDragAndDrop();
</script>
<template>
    <div class="node_container" :draggable="true" @dragstart="onDragStart($event, 'output')">
        <div class="node_title">{{ props.node_title }}</div>
    </div>
</template>
<style>
.node_container{
    padding:10px;
    background:rgb(255, 255, 255);
    outline: 2px solid black;
    height:fit-content;
    width:fit-content;
}
.node_title{
    padding:3px;
}
</style>