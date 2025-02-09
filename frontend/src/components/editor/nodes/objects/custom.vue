<script setup>
import { defineProps, computed } from 'vue';
import { useNodesStore } from '../node_store.js'
import ObjBase from './obj_base.vue'
import node_colors from '../node-colors.js';
import DebugInfo from '../node_assets/debug_info.vue';

</script>

<template>
  <ObjBase display_type="Custom"
          type="custom"
          :bg_color="node_colors.custom_bg"
          :fg_color="node_colors.custom_fg"
          >
  </ObjBase>
</template>

<style scoped>
</style>
