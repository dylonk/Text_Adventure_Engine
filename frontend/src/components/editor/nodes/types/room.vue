<script setup>
import NodeBase from '../node_base.vue';
import { defineProps } from 'vue';

// Define props for debugging purposes
const props = defineProps({
  id: { type: String, required: true },
  node_title: { type: String, default: 'Unnamed Room' },
});
</script>

<template>
  <NodeBase :node_title="node_title" node_type="room">
    <!-- Debug Info -->
    <div class="debug-info">
      <p><strong>Name:</strong> {{ node_title }}</p>
      <p><strong>ID:</strong> {{ id }}</p>
    </div>
  </NodeBase>
</template>

<style scoped>
.debug-info {
  margin-top: 5px;
  font-size: 12px;
  color: #555;
  background: #f9f9f9;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
