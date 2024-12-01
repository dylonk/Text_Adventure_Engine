<!---FATHER CLASS OF ALL TBNODES-->
<script setup>
import useDragAndDrop from '../drag_drop.js';
import { defineProps } from 'vue';
import NodeBase from './node_base.vue'


const props = defineProps({ //needs the tb_node_type prop so drag and drop knows whats up
    node_type:String,
    display_type:String,
    bg_color:String,
    stroke_color:String,
})
const { onDragStart } = useDragAndDrop();
</script>

<template>
    <div class="tb_node_container" :draggable="true" @dragstart="onDragStart($event, props.node_type, true)" :style="{'background': bg_color}" >
        <NodeBase
            :node_type="node_type"
            :display_type="display_type"
            :bg_color="bg_color"
            :stroke_color="stroke_color"/>
    </div>
</template>
<style>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';
.tb_node_container{
    font-family: 'Syne Mono', monospace;
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