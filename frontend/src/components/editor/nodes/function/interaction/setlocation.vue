<script setup>
import { ref, defineProps, computed } from 'vue';
import NodeBase from '../../node_base.vue'
import { Handle, Position } from '@vue-flow/core';
import { SmallButton, HContainer, HandleIn, HandleOut, VContainer,Dropdown } from '../../node_assets/n-component-imports.js';
import node_colors from '../../node-colors';
import FunctionBase from '../func_base.vue'
let response_id = 0;
const props = defineProps({
    id: { default:-1},
})

//----------------------------!!IMPORTANT FOR NODE DATA MANIPULATION/FETCHING!!---------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work, and it needs to be passed down through each component
// Parent component must also have @init-node-id listener
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const defaultObjData =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    display_type:"Set Location",
    function_name: 'setlocation',
    function_params: [],
  }
  console.log("output.vue: ReferenceID is = " + props.id)
  NS.contributeNodeData(props.id,defaultObjData,true);
//------------------------------IMPORTANT END-------------------------------------------


function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}


</script>


<template>



    <FunctionBase
        :id="id"
        >
        <HContainer>
        <HandleIn :id="id"></HandleIn>

        <VContainer outerMargin="5px">
            <Dropdown :id="id" title="Target" defaultSelection="Global" dropdownType="objects"></Dropdown>
            <Dropdown :id="id" title="Location" defaultSelection="player" dropdownType="objects" :defaultList="['Global']"></Dropdown>
        </VContainer>

        <HandleOut :id="id"></HandleOut>
        </HContainer>
    </FunctionBase>



</template>


<style scoped>
</style>