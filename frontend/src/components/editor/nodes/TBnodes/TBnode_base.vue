<!---FATHER CLASS OF ALL TBNODES-->
<script setup>
import useDragAndDrop from '../../drag_drop.js';



const props = defineProps({ //needs the tb_node_type prop so drag and drop knows whats up
    tb_node_type:String,
    bg_color:String,

})
const { onDragStart } = useDragAndDrop();
</script>
<template>
    <div class="node_container" :draggable="true" @dragstart="onDragStart($event, props.tb_node_type, true)" >
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