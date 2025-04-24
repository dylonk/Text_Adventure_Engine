<script setup>
import { ref, defineProps, computed ,onMounted, nextTick} from 'vue';
import { SmallButton, HContainer, HandleIn, HandleOut } from './n-component-imports.js';

let response_id = 0;
const props = defineProps({
    id: { default:-1},
    allowButtons: false,
    handleInput: false,
    handleOutput: false,
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

function addResponse(){
    NS.getParam(props.id, convertedTitle.value).push("")
    NS.globalSync()
}
function removeResponse(){
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
    <div>
        <HContainer outer-margin="5px">
        <div v-if="title!=''"> {{ title }}</div>
        <SmallButton v-if="allowButtons=='true'" :id="id" text="+" @click="addResponse()"></SmallButton>
        <SmallButton v-if="allowButtons=='true'" :id="id" text="-" @click="removeResponse(index)"></SmallButton>
        </HContainer>

        <div class="nodrag nowheel">
            <div v-for="(textbox,index) in NS.getParam(props.id,convertedTitle)" class="textbox_container">
                <HContainer outer-margin="5px">
                    <HandleIn v-if="handleInput=='true'" :id="id" />
                        <div style="display: flex; flex-direction: column; width: 100%;">
                            <slot name="per-textbox-label" :index="index"> </slot>
                            <textarea
                            :value="textbox"
                            class="textbox_text"
                            @input="event => { updateResponse(index, event.target.value); adjustTextarea(event); }"
                            ></textarea>
                        </div>

                        <HandleOut v-if="handleOutput=='true'" :id="id" />
                </HContainer>
            </div>
        </div>
    </div>


</template>


<style scoped>
    .textbox_text{
        resize: none;
        width: 100%;
        min-height: 48px;
        height: auto;
        overflow-y: auto;
        background:rgb(255, 255, 255);
        border:solid gray 1px;
        border-radius:3px;
        padding: 4px;
        box-sizing: border-box;
        line-height: 1.5;
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