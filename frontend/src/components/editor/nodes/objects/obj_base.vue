<script setup>
import { defineProps, watch, computed, ref } from 'vue';
import NodeBase from '../node_base.vue'
import { DebugInfo } from '../node_assets/n-component-imports';

const props = defineProps({   //a lot of these are constructed into a data object and passed to node_base as seen below
  id: -1,  
});
//----------------------------!!IMPORTANT FOR NODE DATA MANIPULATION/FETCHING!!---------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work, and it needs to be passed down through each component
// Parent component must also have @init-node-id listener
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const defaultObjData =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    isObject: true, // These properties are distinct to ObjectBase, !!dont copy them!!
    properties: {},
    display_type: 'ObjectBase'
  }
  console.log("obj_base.vue: ReferenceID is = " + props.id)
  console.log("obj_base.vue: bg_color is " + NS.getNode(props.id).data.object_name)
  NS.contributeNodeData(props.id,defaultObjData,false);
//------------------------------IMPORTANT END-------------------------------------------
const debug_message = "ID:"+props.id;   //whats displayed in the innermost part of the object on canvas
</script>

<template>
  <NodeBase 
  :id="id"
  >
    <div class="object-name-container">{{ NS.getNode(props.id).data.object_name }}</div>
    <DebugInfo :info_text="debug_message"></DebugInfo>
  </NodeBase>
</template>



<style scoped>
.object-name-container{
  font-size: 16px;
  background: v-bind('NS.getNode(props.id).data.fg_color');
  color:v-bind('NS.getNode(props.id).data.bg_color');
  margin:0px !important;
  padding-left: 5px;
  padding-bottom: 2px;
  padding-right: 5px;
}
</style>