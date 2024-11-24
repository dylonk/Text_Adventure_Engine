<script setup>
import NodeBase from '../node_base.vue';
import { defineProps, watch, computed, ref } from 'vue';
import { useNodesStore } from '../stores/node_store.js'



// Define props for debugging purposes
const props = defineProps({
  node_title: { type: String, default: 'Unnamed Room' },
  id: { type: Number },
});

const nodesStore = useNodesStore();
const node = computed(() => nodesStore.getNode(Number(props.id)));



</script>




<template>
<NodeBase :node_title="node.node_title" node_type="room">
  <!-- Debug Info, this is wht is disoplayed with a real node -->
  <div class="debug-info">
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
