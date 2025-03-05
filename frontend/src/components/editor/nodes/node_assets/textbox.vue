<script setup>
import { ref, defineProps, computed } from 'vue';
import { SmallButton, HContainer, HandleIn, HandleOut } from './n-component-imports.js';

let response_id = 0;
const props = defineProps({
    id: { default:-1},
    allowButtons: false,
    startingQuantity:1,
    defaultHeight:1,
    title: "",
})

//----------------------------!!IMPORTANT FOR NODE DATA MANIPULATION/FETCHING!!---------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work, and it needs to be passed down through each component
// Parent component must also have @init-node-id listener
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const convertedTitle = props.title.replace(" ","_")
const defaultObjData =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
  }
  defaultObjData[convertedTitle+'_textboxes'] =[""]
  for(let i=1;i<props.startingQuantity;i++){
    defaultObjData[convertedTitle+'_textboxes'].push("");
  }

  console.log("!!!!!textbox.vue: ReferenceID is = " + props.id)
  NS.contributeNodeData(props.id,defaultObjData,false);

  //IMPORTANT AS WELL, MAKE SURE TO BE CONSIDERATE OF HOW OFTEN THE REACTIVITY IS UPDATED, CAN LEAD TO VERY SLOW CODE. Call ND.subproperty directly if using v-for on it.
  import { dataHas } from '@/components/editor/nodes/n-utils';
  const ND = NS.getNode(props.id,true).data
//------------------------------IMPORTANT END-------------------------------------------

const adjustTextarea = () => {
  textarea.value.style.height = 'auto';
  textarea.value.style.height = `${textarea.value.scrollHeight}px`;
};

function addResponse(){
    const convertedTitle = props.title.replace(" ","_")
    ND[convertedTitle+'_textboxes'].push("")
    NS.globalSync()
}
function removeResponse(index){
    const convertedTitle = props.title.replace(" ","_")
    ND[convertedTitle+'_textboxes'].splice(index,1);
    NS.globalSync()
}
function updateResponse(index,newResponse){
    const convertedTitle = props.title.replace(" ","_")
    ND[convertedTitle+'_textboxes'][index]=newResponse;
    NS.globalSync()
}

</script>


<template>
    <div>
        <HContainer>
        <div v-if="title!=''"> {{ title }}</div>
        <SmallButton v-if="allowButtons=='true'" :id="id" text="+" @click="addResponse()"></SmallButton>
        <SmallButton v-if="allowButtons=='true'" :id="id" text="-" @click="removeResponse(index)"></SmallButton>
        </HContainer>

        <div class="nodrag">
            <div v-for="(textbox,index) in NS.getNode(props.id).data[convertedTitle+'_textboxes']" class="textbox_container">
                <textarea class="textbox_text" @input="updateResponse(index,$event.target.value); adjustTextarea"></textarea>
            </div>
        </div>
    </div>


</template>


<style scoped>
    .textbox_text{
        resize:none;
        width:200px;
        height:100px;
        background:rgb(255, 255, 255);
        /* border:solid v-bind('node_colors.prompt_fg') 1px; */
        border-radius:3px;
    }
    .textbox_container{
        /* color: v-bind('node_colors.prompt_fg'); */
        /* background:v-bind('node_colors.prompt_bg'); */
        display:flex;
        flex-direction:column;
        margin: 0px;

    }
    .response_title{
        display:flex;
    }
</style>