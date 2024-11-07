<script setup>
import { ref, defineProps } from 'vue';
import useDragAndDrop from '../drag_drop.js';

const props = defineProps({
    id:Number,
    node_type:"Prompt",
    output_handle:Boolean,
    input_handle:Boolean
})
const { onDragStart } = useDragAndDrop();
</script>


<template>
    <div class="component_container" :draggable="true" @dragstart="onDragStart($event, 'output')">
        <div class="component_title">
           a {{ props.node_type }}
        </div>
        <input>
    </div>
</template>


<style>
.component_container{
    padding:10px;
    background:rgb(255, 255, 255);
    outline: 2px solid black;
    height:fit-content;
    width:fit-content;
}
.component_container>input{
    background:rgb(186, 186, 186)
}
.component_title{
    padding:3px;
}
</style>