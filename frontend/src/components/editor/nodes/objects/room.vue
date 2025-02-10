<script setup>
import { defineProps, computed } from 'vue';
import { useNodesStore } from '../node_store.js'
import ObjBase from './obj_base.vue'
import node_colors from '../node-colors.js';
import DebugInfo from '../node_assets/debug_info.vue';
const props = defineProps({
  id: Number,
})
</script>

<template>
  <div>    {{props.id }}
</div>
  <ObjBase
    :id="id">
  </ObjBase>
</template>

<style scoped>
</style>
