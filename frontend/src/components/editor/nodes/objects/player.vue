<script setup>
import { defineProps, computed } from 'vue';
import ObjBase from './obj_base.vue'
import node_colors from '../node-colors.js';
import DebugInfo from '../node_assets/debug_info.vue';
const props = defineProps({
  id: -1,
})
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const defaultObjData =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    display_type:"Player",
    properties: {
      aliases: "hero",
      characterHealth:100,
    }
  }
  NS.contributeNodeData(props.id,defaultObjData);
</script>

<template>
  <ObjBase
    :id="id">
  </ObjBase>
</template>

<style scoped>
</style>
