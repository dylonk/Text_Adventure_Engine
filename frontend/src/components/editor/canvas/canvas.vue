
<!---Each canvas is a component of an "Object". The world editor is a canvas that is a component of the global object-->
<script setup>
import { ref, markRaw,computed, watch } from 'vue'
import { VueFlow, applyNodeChanges, applyEdgeChanges } from '@vue-flow/core';
import CanvasBackground from './background.vue'
import CanvasControls from './controls.vue'
import useDragAndDrop from '../drag_drop.js';
import { useNodesStore } from "../nodes/node_store.js"


// NEWNODEREQ
import { PromptNode, RoomNode, ItemNode, NpcNode, PathwayNode, UnimplementedNode, CustomNode, AwaitNode, ActionNode} from '../nodes/n-imports';

    const nodeTypes = {
        prompt: markRaw(PromptNode),
        room: markRaw(RoomNode),
        item: markRaw(ItemNode),
        npc: markRaw(NpcNode),
        pathway: markRaw(PathwayNode),
        custom: markRaw(CustomNode),
        await: markRaw(AwaitNode),
        action: markRaw(ActionNode),
        unimplemented: markRaw(UnimplementedNode)
    }

// Pinia store
const nodesStore = useNodesStore();




const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()
const onConnect = (connection) => {
    console.log('Connection made:', connection);
    // Add the new edge to the store
    nodesStore.addEdge({
        id: `e-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        // You can add additional properties as needed
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        // Optional custom styling
        style: { stroke: '#555', strokeWidth: 2 },
        animated: false,
        // Any other edge properties you need
    });
};

</script>

<template>
    <div class="canvas_container" @drop="onDrop" >
        <VueFlow 
        :apply-default="false"
        v-model:nodes="nodesStore.nodes"
        v-model:edges="nodesStore.edges"
        :node-types="nodeTypes" 
        class="pinia-flow"
        @dragover="onDragOver" 
        @dragleave="onDragLeave" 
        @connect="onConnect"
        @nodes-change="changes => applyNodeChanges(changes  , nodesStore.nodes)"
        @edges-change="changes => applyEdgeChanges(changes, nodesStore.edges)"
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
vue-flow__nodesselection-rect{
    width: 450px;
    height: 336px; 
    top: 0px; 
    left: 100px; 
    touch-action: none;

}
    .canvas_container{
        background-color: transparent;
        width:100%;
        height:100%;
    }

</style>