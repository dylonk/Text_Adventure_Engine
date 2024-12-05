<script setup>
import { defineProps, computed } from 'vue';
import { useNodesStore } from '../node_store.js'
import ObjBase from './obj_base.vue'
import node_colors from '../node-colors.js';
import DebugInfo from '../node_assets/debug_info.vue';

</script>

<template>
  <ObjBase display_type="Room"
          node_type="room"
          :bg_color="node_colors.room_bg"
          :stroke_color="node_colors.room_stroke"
          >
  </ObjBase>
</template>

<style scoped>
</style>
