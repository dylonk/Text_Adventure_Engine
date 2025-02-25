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
    display_type:"Await",
  }
  console.log("Await.vue: ReferenceID is = " + props.id)
  NS.contributeNodeData(props.id,defaultObjData,true);
//------------------------------IMPORTANT END-------------------------------------------

function addResponse(){
    // responses.value.push({id:response_id++, text:""})
}
function removeResponse(){
    // if(response_id>0){
    //     responses.value.pop()
    //     response_id--;
    // }
}

function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}


</script>


<template>



    <FunctionBase
        :id="id"
        >
        <Textboxes style="margin-top: 0px;" :id="id" startingQuantity=1 allowButtons=false title="Expected Phrase"></Textboxes>

    </FunctionBase>



</template>


<style scoped>
    .console_response_text{
        resize:none;
        width:200px;
        height:100px;
        background:rgb(255, 255, 255);
        /* border:solid v-bind('node_colors.prompt_fg') 1px; */
        border-radius:3px;
    }
    .user_response_text{
        resize:none;
        width:200px;
        height:auto;
        color:black;
        background:rgb(255, 255, 255);
        /* border:solid v-bind('node_colors.prompt_fg') 1px; */
        border-radius:3px;
    }
    .user_response_container{
        /* color: v-bind('node_colors.prompt_fg'); */
        /* background:v-bind('node_colors.prompt_bg'); */
        margin: 0px;
        padding-left:10px;
        padding-bottom:5px;
    }
    .response_title{
        display:flex;
    }
</style>