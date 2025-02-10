<script setup>
import { defineProps, watch, computed, ref } from 'vue';
import NodeBase from '../node_base.vue'
import { DebugInfo } from '../node_assets/n-component-imports';
//-----------------------------------------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work
// Parent component must also have @init-node-id listener
import { useNodesStore } from '../node_store.js'
import { defineEmits} from 'vue';

const nodesStore = useNodesStore()
const emit = defineEmits(['init-node-id'])

function UpdateNodeId(){
  const defaultObjData =  {
    isObject: true,
    test_property: 'please remove me whence u figure this out',
  }
  console.log("obj_base.vue: ReferenceID is = " + props.id)
  console.log("obj_base.vue: bg_color is " + nodesStore.getNode(props.id).object_name)
  nodesStore.contributeNodeData(props.id,defaultObjData);
}
//----------------------------------------------------------------------------



const props = defineProps({   //a lot of these are constructed into a data object and passed to node_base as seen below
  id: { default:-1},  
  isObject: true,
  test_property: 'option2'
});


const debug_message = "ID:"+props.id;   //whats displayed in the innermost part of the object on canvas
</script>

<template>
  <NodeBase @init-node-id="UpdateNodeId">
    <div class="object-name-container">{{ nodesStore.getNode(props.id).data.object_name }}</div>
    <DebugInfo :info_text="debug_message"></DebugInfo>
  </NodeBase>
</template>



<style scoped>
.object-name-container{
  font-size: 16px;
  background: v-bind('nodesStore.getNode(props.id).data.fg_color');
  color:v-bind('nodesStore.getNode(props.id).data.bg_color');
  margin:0px !important;
  padding-left: 5px;
  padding-bottom: 2px;
  padding-right: 5px;
}
</style>