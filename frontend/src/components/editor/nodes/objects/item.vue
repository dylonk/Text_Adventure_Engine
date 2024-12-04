<script setup>
import NodeBase from '../node_base.vue';
import { defineProps, computed } from 'vue';
import { useNodesStore } from '../node_store.js'
import ObjBase from './obj_base.vue'
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
@import
</style>
