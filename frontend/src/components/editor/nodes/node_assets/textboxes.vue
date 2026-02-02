<script setup>
import { ref, defineProps, computed ,onMounted, nextTick} from 'vue';
import { SmallButton, HContainer, HandleIn, HandleOut, VContainer } from './n-component-imports.js';

let response_id = 0;
const handleIds = ref([]);//tracking the handle ids for the purpose of edge deletion by handle

const props = defineProps({
    id: { default:-1},
    allowButtons: false,
    handleInput: false,
    handleOutput: false,
    spacing:{type:String,default:"12px"},
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
const convertedTitle = ref(props.title.replace(" ","_"))
convertedTitle.value = convertedTitle.value+'_textboxes'
const defaultArgs =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    params:[],
    paramName:convertedTitle.value,
    }
  for(let i=0;i<props.startingQuantity;i++){
    defaultArgs.params.push("");
  }

  NS.contributeFunctionParameters(props.id,defaultArgs.paramName,defaultArgs.params); // a little confusing, but this adds 1 param to function_params in the style [response_textboxes(name), textbox1(parameter index 0),textbox2(parameter index 1)]
//------------------------------IMPORTANT END-------------------------------------------

function adjustTextarea(event){
  const textarea = event.target;
  
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

function getLastHandleId() {    //used for deleting the edge of the last handle. 
    const node = NS.getNode(props.id);
    console.log(node);  
    let minHandles= node.type=="if" ? 2 : 1     //if's are special cases because of the always-there else statement
    if (node && node.data.srcHandles > minHandles) {
        // The last handle index is srcHandles - 1 (since it increments after creating)
        const lastHandleIndex = node.data.srcHandles - 1;
        console.log(`Last handle ID: ${props.id}s${lastHandleIndex}`);
        node.data.srcHandles--;
        return `${props.id}s${lastHandleIndex}`;
    }
    return null;
}

function addResponse(){
    NS.getParam(props.id, convertedTitle.value).push("")
    NS.globalSync()
}
function removeResponse(){
    //updating this to remove the edge from the handle of the removed response
    //Is there some way to see the relevant edge from the textbox?
    //I'll either have to add a variable to store the relevant edge (useful if we want to implement deleting specific prompts later)
    NS.deleteEdgeByHandle(getLastHandleId())
    NS.getParam(props.id,convertedTitle.value).pop();   
    NS.globalSync()

}
function updateResponse(index,newResponse){
    NS.getParam(props.id,convertedTitle.value)[index]=newResponse;
    NS.globalSync()
}

onMounted(() => {
  nextTick(() => {
    document.querySelectorAll('.textbox_text').forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });
});
</script>


<template>
    <VContainer spacing="6px">
        <HContainer outer-margin="0" spacing="4px">
        <div v-if="title!=''"> {{ title }}</div>
        <SmallButton v-if="allowButtons=='true'" :id="id" text="+" @click="addResponse()"></SmallButton>
        <SmallButton v-if="allowButtons=='true'" :id="id" text="-" @click="removeResponse(index)"></SmallButton>
        </HContainer>

        <VContainer v-if="NS.getParam(props.id,convertedTitle)?.length > 0" class="nodrag nowheel" :spacing="spacing">
            <div v-for="(textbox,index) in NS.getParam(props.id,convertedTitle)" class="textbox_container">
                <HContainer outer-margin="0">
                    <HandleIn v-if="handleInput=='true'" :id="id" />
                        <div style="display: flex; flex-direction: column; width: 100%;">
                            <slot name="per-textbox-label" :index="index"> </slot>
                            <textarea
                            :value="textbox"
                            class="textbox_text"
                            @input="event => { updateResponse(index, event.target.value); adjustTextarea(event); }"
                            ></textarea>
                        </div>

                        <HandleOut v-if="handleOutput=='true'" :id="id"></HandleOut
/>
                </HContainer>
            </div>
        </VContainer>
    </VContainer>


</template>


<style scoped>
    .textbox_text{
        resize: none;
        width: 100%;
        min-height: 48px;
        height: auto;
        overflow-y: auto;
        color:rgb(35, 35, 76);
        font-weight: 600;
        background:rgb(232, 237, 234);
        border:none;
        border-radius:2px;
        outline:1px rgba(104, 97, 199, 0.403) solid;
        padding: 4px;
        box-sizing: border-box;
        line-height: 1.5;
    }
    .textbox_text:focus{
        background:rgb(237, 243, 241);
        outline:1px rgba(94, 87, 188, 0.648) solid;
    }
    .textbox_text:active{
        background:rgb(214, 220, 218);
    }
    .textbox_container{
        /* color: v-bind('node_colors.prompt_fg'); */
        /* background:v-bind('node_colors.prompt_bg'); */
        display:flex;
        flex-direction:column;
        margin: 0px;
        gap:v-bind('spacing');

    }
    .response_title{
        display:flex;
    }
</style>