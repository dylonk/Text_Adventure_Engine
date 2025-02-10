<script setup>
import { defineProps, watch, computed, ref } from 'vue';
import NodeBase from '../node_base.vue'
import { DebugInfo } from '../node_assets/n-component-imports';

import { defineEmits} from 'vue';


const props = defineProps({   //a lot of these are constructed into a data object and passed to node_base as seen below
  id: -1,  
  isObject: true,
  test_property: 'option2',
  display_type: 'ObjBase'
});
//-----------------------------------------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work
// Parent component must also have @init-node-id listener
import { useNodesStore } from '../node_store.js'
const NS = useNodesStore()
const defaultObjData =  {
    isObject: true,
    test_property: 'please remove me whence u figure this out',
    display_type: 'ObjectBase'
  }
  console.log("obj_base.vue: ReferenceID is = " + props.id)
  console.log("obj_base.vue: bg_color is " + NS.getNode(props.id).data.object_name)
  NS.contributeNodeData(props.id,defaultObjData);

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