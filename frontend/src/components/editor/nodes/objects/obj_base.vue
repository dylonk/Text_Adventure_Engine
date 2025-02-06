<script setup>
import { defineProps, watch, computed, ref } from 'vue';
import { useNodesStore } from '../node_store.js'
import NodeBase from '../node_base.vue'
import { DebugInfo } from '../node_assets/n-component-imports';

const props = defineProps({   //a lot of these are constructed into a data object and passed to node_base as seen below
  id: { default:-1},
  object_name: { type: String, default: 'Unnamed object' },
  stroke_color: { type: String, default: 'black' },
  bg_color: { type: String, default: 'white' },
  node_properties: { type: Array, default: () => [] },

});


const debug_message = "ID:"+props.id;   //whats displayed in the innermost part of the object on canvas
</script>

<template>
  <NodeBase
    :id="id"
    :data="{    //now all the data is properly in the data object
      bg_color,
      object_name,
      stroke_color,
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
  background: v-bind('stroke_color');
  color:v-bind('bg_color');
  margin:0px !important;
  padding-left: 5px;
  padding-bottom: 2px;
  padding-right: 5px;
}
</style>