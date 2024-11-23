<script setup>
import NodeBase from '../node_base.vue';
import { defineProps, watch, computed } from 'vue';
import { useNodesStore } from '../stores/node_store.js'


// Define props for debugging purposes
const props = defineProps({
  node_title: { type: String, default: 'Unnamed Room' },
  id: { type: Number },
});


id=props.id

const nodeStore = useNodesStore()
watch(() => node.value, (newNode) => {
  if (newNode) {
    watch(() => newNode, (updatedNode) => {
      node.value = updatedNode;
    }, { deep: true });
  }
});

</script>



<template>
<NodeBase v-if="node" :node_title="node.value.node_title" node_type="room" :id="node.value.id">
  <!-- Debug Info, this is wht is disoplayed with a real node -->
  <div class="debug-info">
    <p><strong>Name:</strong> {{ node.value.node_title }}</p>
    <p><strong>ID:</strong> {{ node.value.id }}</p>
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
