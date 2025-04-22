<script setup>
import { ref, defineProps, computed } from 'vue';
import NodeBase from '../../node_base.vue'
import { Handle, Position } from '@vue-flow/core';
import { SmallButton, HContainer, HandleIn, HandleOut, VContainer,Dropdown,Textboxes } from '../../node_assets/n-component-imports.js';
import node_colors from '../../node-colors';
import FunctionBase from '../func_base.vue'
let response_id = 0;
const props = defineProps({
    id: { default:-1},
})

//it watches the first dropdown value of this node.
const selectedTarget = computed(() => {
  //targetDropdown is an array, but will only ever have a value at [0] here.
  const targetDropdown = NS.getParam(props.id, "Target_dropdown");
  if (targetDropdown && targetDropdown.length > 0) {
    const target = targetDropdown[0];
    //selected target is correct and returns room1. 
    console.log("Selected Target:", target);  // Debugging
    return target;
  } else {
    console.warn("Target dropdown is empty or null for id:", props.id);  // Adding a warning for debug
    return null;  // Return null if the dropdown is empty or undefined
  }
});

//this is the list of data properties of the selected target. chnges whenever selectefd target changes
const propertyList = computed(() => {
  console.log("Computing property list for", selectedTarget.value);
  //successfully returns room1
  const targetName = selectedTarget.value;
  const targetNode = NS.getAllNodes(true, "node").find(n => {
  console.log("Checking node:", n.data?.title, n.data?.object_name);
  return n.data?.title === targetName || n.data?.object_name === targetName;
});
  console.log("Found target node:", targetNode);
  if (!targetNode || !targetNode.data) return ['Global'];
  return Object.keys(targetNode.data.properties);
});
//----------------------------!!IMPORTANT FOR NODE DATA MANIPULATION/FETCHING!!---------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work, and it needs to be passed down through each component
// Parent component must also have @init-node-id listener
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const defaultObjData =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    display_type:"Set Property",
    function_name: 'setproperty',
    function_params: [],
  }
  NS.contributeNodeData(props.id,defaultObjData,true);
//------------------------------IMPORTANT END-------------------------------------------




</script>


<template>



    <FunctionBase
        :id="id"
        >
        <HContainer>
        <HandleIn :id="id"></HandleIn>

        <VContainer outerMargin="5px">
            <Dropdown :id="id" title="Target" defaultSelection="Global" dropdownType="objects"></Dropdown>
            <Dropdown :id="id" title="property" defaultSelection="" dropdownType="custom" :defaultList="propertyList"></Dropdown>
            <Textboxes handleOutput=true handleInput=true :id="id" startingQuantity=1 allowButtons=false title="new value"></Textboxes>
        </VContainer>

        <HandleOut :id="id"></HandleOut>
        </HContainer>
    </FunctionBase>



</template>


<style scoped>
</style>