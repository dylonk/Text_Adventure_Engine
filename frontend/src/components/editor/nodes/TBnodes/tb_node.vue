<!---FATHER CLASS OF ALL TBNODES-->
<script setup>
import useDragAndDrop from '../../drag_drop.js';
import { defineProps } from 'vue';



const props = defineProps({ //needs the tb_node_type prop so drag and drop knows whats up
    node_type:String,
    display_type:String,
    bg_color:String,
})
const { onDragStart } = useDragAndDrop();
</script>

<template>
    <div class="node_container" :draggable="true" @dragstart="onDragStart($event, props.node_type, true)" >
        {{display_type}}
    </div>
</template>
<style>
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
    padding:3px;
}
</style>