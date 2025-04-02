<script setup>
import FunctionBase from '../func_base.vue'
import node_colors from '../../node-colors';
import { defineProps } from 'vue';

const props = defineProps({
    id: { default:-1},
    display_type: "Unimplemented",
    description: "No description here"
})

//----------------------------!!IMPORTANT FOR NODE DATA MANIPULATION/FETCHING!!---------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work, and it needs to be passed down through each component
// Parent component must also have @init-node-id listener
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const defaultObjData =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    display_type:props.display_type,
  }
  console.log("unimplemented.vue: ReferenceID is = " + props.id)
  NS.contributeNodeData(props.id,defaultObjData,true);
//------------------------------IMPORTANT END-------------------------------------------

</script>

<template>
<FunctionBase
    :id="id"
    >
</FunctionBase>
</template>


<style scoped>
.err-img{
    margin:0px !important;
}
</style>