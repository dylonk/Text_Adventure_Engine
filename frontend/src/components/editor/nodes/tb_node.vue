<!---FATHER CLASS OF ALL TBNODES-->
<script setup>
import useDragAndDrop from '../drag_drop.js';
import { defineProps } from 'vue';
import NodeBase from './node_base.vue'
import { SmallButton } from './node_assets/n-component-imports.js';


const props = defineProps({ 
    node_type:String,
    display_type:String,
    bg_color:String,
    stroke_color:String,
})
const { onDragStart } = useDragAndDrop();
</script>

<template>
    <div class="tb_node_container" :draggable=True @dragstart="onDragStart($event, props.node_type, true)" :style="{'background': bg_color}" >
        <NodeBase
        :id="id" 
        :type="type"
        :position="position" 
        :data="{
            bg_color,
            stroke_color,
            display_type,
            containHelp: true, // Directly set to `true` instead of passing as a string
    }"
            >
        </NodeBase>
    </div>
</template>
<style scoped>
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