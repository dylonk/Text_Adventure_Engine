
<!---Each canvas is a component of an "Object". The world editor is a canvas that is a component of the global object-->
<script setup>
import { ref, markRaw,computed, watch } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import CanvasBackground from './background.vue'
import CanvasControls from './controls.vue'
import useDragAndDrop from '../drag_drop.js';
import { useNodesStore } from "../nodes/node_store.js"


// NEWNODEREQ
import { PromptNode, RoomNode, ItemNode, NpcNode, PathwayNode, UnimplementedNode, CustomNode, AwaitNode} from '../nodes/n-imports';

    const nodeTypes = {
        prompt: markRaw(PromptNode),
        room: markRaw(RoomNode),
        item: markRaw(ItemNode),
        npc: markRaw(NpcNode),
        pathway: markRaw(PathwayNode),
        custom: markRaw(CustomNode),
        await: markRaw(AwaitNode),
        unimplemented: markRaw(UnimplementedNode)
    }

// Pinia store
const nodesStore = useNodesStore();

// Make nodes reactive using computed
//const canvasNodes = computed(() => nodesStore.getAllNodes());



const { onConnect, addEdges } = useVueFlow()
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()
const edges = ref([])
onConnect(addEdges)

</script>

<template>
    <div class="canvas_container" @drop="onDrop" >
        <VueFlow 
        :nodes=nodesStore.allNodes
        :node-types="nodeTypes" 
        :key=nodesStore.allNodes.length
        class="pinia-flow"
        @dragover="onDragOver" 
        @dragleave="onDragLeave" 
        fit-view-on-init>

            <CanvasBackground        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease',
        }"/>
        <CanvasControls></CanvasControls>
        </VueFlow>
    </div>


</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.4/dist/style.css';
    .canvas_container{
        background-color: transparent;
        width:100%;
        height:100%;
    }

</style>