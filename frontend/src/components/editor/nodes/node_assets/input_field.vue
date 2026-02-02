<script setup>
import { ref, defineProps, computed } from 'vue';
import { SmallButton, HContainer, HandleIn, HandleOut } from './n-component-imports.js';

const props = defineProps({
    id: { default:-1},
    handleInput: false,
    handleOutput: false,
    defaultHeight:1,
    title: "",
})

//----------------------------!!IMPORTANT FOR NODE DATA MANIPULATION/FETCHING!!---------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work, and it needs to be passed down through each component
// Parent component must also have @init-node-id listener
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const convertedTitle = ref(props.title.replace(" ","_"))
convertedTitle.value = convertedTitle.value+'_inputfield'
const defaultArgs =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    params:[],
    paramName:convertedTitle.value,
    }
  for(let i=0;i<props.startingQuantity;i++){
    defaultArgs.params.push("");
  }

  NS.contributeFunctionParameters(props.id,defaultArgs.paramName,defaultArgs.params); 
//------------------------------IMPORTANT END-------------------------------------------
function updateResponse(newResponse){
    NS.getParam(props.id,convertedTitle.value)[0]=newResponse;
    NS.globalSync()
}
</script>


<template>
    <div>
        <HContainer outer-margin="5px">
        </HContainer>

        <div class="nodrag">
                <HContainer outer-margin="0px">
                    <HandleIn v-if="handleInput=='true'"   :id="id"></HandleIn>
                    <div v-if="title!=''"> {{ title }}</div>
                    <textarea :value="NS.getParam(props.id,convertedTitle)[0]" class="inputfield_text" @input="updateResponse($event.target.value)"></textarea>
                    <HandleOut v-if="handleOutput=='true'"  :id="id"></HandleOut>
                </HContainer>
        </div>
    </div>


</template>


<style scoped>
    .inputfield_text{
        resize:none;
        width:100%;
        min-width:80px;
        text-wrap-mode:nowrap;
        overflow-x:scroll;
        height:20px;
        margin:none;
        background:rgb(232, 237, 234);
        border:none;
        outline:1px rgba(104, 97, 199, 0.403) solid;
        border-radius:3px;
        
    }
    .response_title{
        display:flex;
    }
</style>