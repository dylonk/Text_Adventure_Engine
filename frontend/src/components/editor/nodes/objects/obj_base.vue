<script setup>
import { defineProps, watch, computed, ref } from 'vue';
import NodeBase from '../node_base.vue'
import { DebugInfo } from '../node_assets/n-component-imports';
import { useNodesStore } from '../node_store.js'
const nodesStore = useNodesStore

const props = defineProps({   //a lot of these are constructed into a data object and passed to node_base as seen below
  object_name: { type: String, default: 'Unnamed object' },
  fg_color: { type: String, default: 'black' },
  bg_color: { type: String, default: 'white' },
  node_properties: { type: Array, default: () => [] },
});


const debug_message = "ID:"+props.id;   //whats displayed in the innermost part of the object on canvas
</script>

<template>
  <NodeBase
    :data="{    //now all the data is properly in the data object
      bg_color,
      object_name,
      fg_color,
      display_type, 
      containHelp, 
      node_properties,
    }"
  >
    <div class="object-name-container">{{ object_name }}</div>
    <DebugInfo :info_text="debug_message"></DebugInfo>
  </NodeBase>
</template>



<style scoped>
.object-name-container{
  font-size: 16px;
  background: v-bind('fg_color');
  color:v-bind('bg_color');
  margin:0px !important;
  padding-left: 5px;
  padding-bottom: 2px;
  padding-right: 5px;
}
</style>