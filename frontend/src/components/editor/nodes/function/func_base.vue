<script setup>
import { defineProps, watch, computed, ref } from 'vue';
import { useNodesStore } from '../node_store.js'
import NodeBase from '../node_base.vue'
import { DebugInfo } from '../node_assets/n-component-imports';

const props = defineProps({
  id: { default:-1},
  stroke_color: { type: String, default: 'black' },
  bg_color: { type: String, default: 'white' },
  node_properties: { type: Array, default: () => [] },

});

const nodesStore = useNodesStore();
const node = computed(() => nodesStore.getNode(Number(props.id)));//the node in question is always the one with the same id as the props.id
//the current bug is that the id really does just init to -1. It's not passed down, unlike with objects
const debug_message = "ID:"+props.id;   //whats displayed in the innermost part of the object on canvas

watch(() => props.id, (newId) => {  //this watcher statement watches 
  console.log('FunctionBase received ID:', {
    id: newId,
    type: typeof newId
  });
}, { immediate: true });


</script>

<template>  
<NodeBase :stroke_color="stroke_color"
          :bg_color="bg_color"
          :node_type="node_type"
          :id="id"
          :display_type="display_type">
<DebugInfo :info_text="debug_message"></DebugInfo>

<slot></slot>
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