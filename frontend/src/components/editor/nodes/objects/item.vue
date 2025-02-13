<script setup>
import NodeBase from '../node_base.vue';
import { defineProps, computed } from 'vue';
import { useNodesStore } from '../node_store.js'
// Define props for debugging purposes
const props = defineProps({
  id: { type: Number },
  node_title: { type: String, default: 'Unnamed Item' },
});

const nodesStore = useNodesStore();
const node = computed(() => nodesStore.getNode(Number(props.id)));

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
.debug-info {
  margin-top: 5px;
  font-size: 12px;
  color: #555555;
  background: #f9f9f9;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
