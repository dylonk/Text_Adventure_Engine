<script setup>
import { ref, defineProps, computed } from 'vue';
import NodeBase from '../../node_base.vue'
import { Handle, Position } from '@vue-flow/core';
import { SmallButton, HContainer, HandleIn, HandleOut, Textboxes } from '../../node_assets/n-component-imports.js';
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
    display_type:"If",
    function_name: 'if',
    function_params: [],
  }
  console.log("prompt.vue: ReferenceID is = " + props.id)
  NS.contributeNodeData(props.id,defaultObjData,true);
//------------------------------IMPORTANT END-------------------------------------------

function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}

// Calculate the index for the "else" handle
// This will be the number of condition textboxes + number of "else if" textboxes
const elseHandleIndex = computed(() => {
  // Get the condition textbox count (should be 1)
  const conditionCount = NS.getParam(props.id, "Condition_textboxes")?.length || 1;
  // Get the "else if" textboxes count
  const elseIfCount = NS.getParam(props.id, "Else_if_textboxes")?.length || 0;
  // Return the sum (this will be the index for the "else" handle)
  return conditionCount + elseIfCount;
});

</script>


<template>
    <FunctionBase
        :id="id"
        >
        <!-- Condition textbox -->
        <HContainer outerMargin="0px">
            <Textboxes handleOutput=true handleInput=true :id="id" startingQuantity=1 allowButtons=false title="Condition"></Textboxes>
        </HContainer>
        
        <!-- Else if textboxes (with add/remove buttons) -->
        <HContainer outerMargin="0px">
            <Textboxes handleOutput=true :id="id" startingQuantity=0 allowButtons=true title="Else if">
                <template #per-textbox-label="{ index }">
                    <div class="response_title">Else if</div>
                </template>
            </Textboxes>
        </HContainer>
        
        <!-- Dedicated Else handle (not a textbox) -->
        <HContainer outerMargin="5px">
                <div class="else-label">Else</div>
                <HandleOut :id="id" />
        </HContainer>
    </FunctionBase>
</template>


<style scoped>
    .console_response_text{
        resize:none;
        width:200px;
        height:100px;
        background:rgb(255, 255, 255);
        border-radius:3px;
    }
    .user_response_text{
        resize:none;
        width:200px;
        height:auto;
        color:black;
        background:rgb(255, 255, 255);
        border-radius:3px;
    }
    .user_response_container{
        margin: 0px;
        padding-left:10px;
        padding-bottom:5px;
    }
    .response_title{
        display:flex;
        font-size:smaller;
    }
    .else-section {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 5px 0;
    }
    .else-label {
        font-weight: bold;
        margin-right: 10px;
    }

</style>