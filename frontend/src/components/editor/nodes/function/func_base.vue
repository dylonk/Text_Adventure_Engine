<script setup>
import { defineProps, watch, computed, ref } from 'vue';
import NodeBase from '../node_base.vue'
import { DebugInfo } from '../node_assets/n-component-imports';

const props = defineProps({
  id: -1,
});
//----------------------------!!IMPORTANT FOR NODE DATA MANIPULATION/FETCHING!!---------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work, and it needs to be passed down through each component
// Parent component must also have @init-node-id listener
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const defaultObjData =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    function_name: 'default',
    function_params: [], // Function parameters must also have a parameter name! use contributeFunction. See prompt.vue for an example of proper data storage
    isFunction:true,
  }
  console.log("func_base.vue: ReferenceID is = " + props.id)
  NS.contributeNodeData(props.id,defaultObjData);
//------------------------------IMPORTANT END-------------------------------------------
const debug_message = "ID:"+props.id;   //whats displayed in the innermost part of the object on canvas



</script>
<template>  
<NodeBase 
:id="id"
>
<div class="node-content">
  <slot></slot>
</div>
</NodeBase>
</template>

<style scoped>
.node-content{
  width:100%;
  display:flex;
  flex-direction: column;
  padding:12px;
  gap:16px;
}
</style>