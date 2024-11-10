
<!---Each canvas is a component of an "Object". The world editor is a canvas that is a component of the global object-->
<script setup>
import { ref, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import CanvasBackground from './background.vue'
import CanvasControls from './controls.vue'
import useDragAndDrop from '../drag_drop.js';
// allll da fucking node imports
import { PromptNode } from '../nodes/n-imports.js'

    const nodeTypes = {
        prompt: markRaw(PromptNode),
    }


const { onConnect, addEdges } = useVueFlow()
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()
const nodes = ref([])
const edges = ref([])
onConnect(addEdges)

</script>

<template>
    <div class="canvas_container" @drop="onDrop" >
        <VueFlow :nodes="nodes" :node-types="nodeTypes" @dragover="onDragOver" @dragleave="onDragLeave" fit-view-on-init>

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