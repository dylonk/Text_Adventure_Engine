<script setup>
import NodeBase from '../node_base.vue';
import { defineProps, computed } from 'vue';
import { useNodesStore } from '../node_store.js';
import ObjBase from './obj_base.vue';

// Define props for debugging purposes
const props = defineProps({
  id: { type: Number, required: true },
  node_title: { type: String, default: 'Unnamed Item' },
  extent: { type: String, default: undefined }, // Can be 'parent' if constrained to a parent
});

const nodesStore = useNodesStore();
const node = computed(() => {
  const foundNode = nodesStore.getNode(Number(props.id));
  if (!foundNode) {
    console.error(`Node with ID ${props.id} not found.`);
    return { node_title: 'Error: Node not found' }; // Return fallback data
  }
  return foundNode;
});
</script>

<template>
  <NodeBase :node_title="node.node_title" node_type="item">
    <!-- Debug Info -->
    <div class="debug-info">
      <p><strong>ID:</strong> {{ id }}</p>
    </div>
  </NodeBase>
</template>

<style scoped>
.node_container {
  padding: 10px;
  background: rgb(255, 255, 255);
  outline: 2px solid black;
  height: 150px;
  width: 150px;
  display: flex;
  flex-direction: column;
}
.node_title {
  padding: 3px;
}
</style>
