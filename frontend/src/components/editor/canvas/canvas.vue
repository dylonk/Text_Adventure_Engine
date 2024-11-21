<script setup>
import { ref, markRaw, computed } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import CanvasBackground from './background.vue';
import CanvasControls from './controls.vue';
import useDragAndDrop from '../drag_drop.js';
import { useNodesStore } from "../nodes/stores/node_store.js";

// Node imports
import { PromptNode } from '../nodes/n-imports.js';
import { RoomNode } from '../nodes/n-imports.js';
import { ItemNode } from '../nodes/n-imports.js';

// Node types for Vue Flow
const nodeTypes = {
  prompt: markRaw(PromptNode),
  room: markRaw(RoomNode),
  item: markRaw(ItemNode),
};

// Pinia store
const nodesStore = useNodesStore();

// Reactive canvas nodes
const canvasNodes = computed(() => nodesStore.getAllNodes());

const { onConnect, addEdges } = useVueFlow();
const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop();
const nodes = ref([]);
const edges = ref([]);

onConnect(addEdges);

// Method to handle node selection
function selectNode(node) {
  console.log(`Node selected: ${node.id}`);

  // Log parent information
  if (node.parentId) {
    const parentNode = nodesStore.getAllNodes().find((n) => n.id === node.parentId);
    if (parentNode) {
      console.log(`Parent Node: ${parentNode.type} - ${parentNode.id}`);
    } else {
      console.log('Parent node not found.');
    }
  } else {
    console.log('This node has no parent.');
  }
}
</script>

<template>
  <div class="canvas_container" @drop="onDrop">
    <VueFlow
      :nodes="canvasNodes"
      :node-types="nodeTypes"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      fit-view-on-init
    >
      <!-- Render nodes with selection click -->
      <template #node="{ id, data, events }">
        <div
          class="node-container"
          v-bind="events" <!-- Bind VueFlow node events -->
          @click.prevent="selectNode(data)" <!-- Pass node data to selectNode -->
        >
          {{ data.label }}
        </div>
      </template>

      <CanvasBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease',
        }"
      />
      <CanvasControls />
    </VueFlow>
  </div>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.4/dist/style.css';

.canvas_container {
  background-color: transparent;
  width: 100%;
  height: 100%;
}

.node-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  transition: background-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.node-container:hover {
  background-color: #f0f8ff;
  transform: scale(1.05);
}
</style>
