<!---FATHER CLASS OF ALL TBNODES-->
<script setup>
import useDragAndDrop from '../drag_drop.js';
import { defineProps, computed } from 'vue';
import NodeBase from './node_base.vue'
import node_colors from './node-colors.js';

const props = defineProps({ 
    type:String,
    display_type:String,
})
const { onDragStart } = useDragAndDrop();
</script>

<template>
    <div class="tb_node_container" :draggable=True @dragstart="onDragStart($event, props.type, true)">
        <NodeBase
        id=-1
        :type="type"
        draggable="true"
        :data="{
            display_type,
            bg_color:node_colors[type+'_bg'],
            fg_color:node_colors[type+'_fg'],
        }"
        </NodeBase>
    </div>
</template>
<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';
.tb_node_container{
    font-family: 'Syne Mono', monospace;
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