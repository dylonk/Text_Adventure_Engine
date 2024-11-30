<script setup>
import TBNodeBase from './tb_node.vue';
import { defineProps } from 'vue';

// NO props! you drag this thang and drop it!
</script>

<template>
  <TBNodeBase tb_node_type="room">
    <!-- Debug Info -->
    <div class="debug-info">
      <p>DRAG TO INSERT A ROOM</p>
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
