<script setup>
import TBNodeBase from '../TBnodes/TBnode_base.vue';
import { defineProps } from 'vue';

// NO props! you drag this thang and drop it!
</script>

<template>
  <TBNodeBase :node_title="node_title" tb_node_type="item">
    <!-- Debug Info -->
    <div class="debug-info">
      <p>DRAG TO INSERT AN ITEM</p>
    </div>
  </TBNodeBase>
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
