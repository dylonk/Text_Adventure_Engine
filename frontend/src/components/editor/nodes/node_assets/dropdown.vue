<script setup>
import { ref, defineProps, computed, onMounted } from 'vue';
import { SmallButton, HContainer, HandleIn, HandleOut, VContainer } from './n-component-imports.js';

let response_id = 0;
const props = defineProps({
    id: { default:-1},
    title: "",
    dropdownType: "objects",
    defaultSelection: "",
    defaultList:[],
    exclusionList:[],
})

const displayList = ref(false)
const dropdownList = ref([])


//----------------------------!!IMPORTANT FOR NODE DATA MANIPULATION/FETCHING!!---------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work, and it needs to be passed down through each component
// Parent component must also have @init-node-id listener
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const convertedTitle = ref(props.title.replace(" ","_"))
convertedTitle.value = convertedTitle.value+'_dropdown'
const defaultArgs =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    params:[],
    paramName:convertedTitle.value,
    }
    defaultArgs.params.push("");
  NS.contributeFunctionParameters(props.id,defaultArgs.paramName,defaultArgs.params); // a little confusing, but this adds 1 param to function_params in the style [response_textboxes(name), textbox1(parameter index 0),textbox2(parameter index 1)]
//------------------------------IMPORTANT END-------------------------------------------

function generateList(){
    console.log("Dropdown clicked for id ", props.id, props.dropdownType)
    if(props.dropdownType=="objects"){
        let eList = props.exclusionList? props.exclusionList : []
        eList.push(NS.getParam(props.id,convertedTitle.value)[0])
        dropdownList.value = props.defaultList ? props.defaultList : []
        dropdownList.value = dropdownList.value.concat(NS.getAllNodes(true,"title"))
        dropdownList.value = dropdownList.value.filter(entry=>!eList.includes(entry))
    }
    console.log("Dropdown list values = ", dropdownList)
    displayListToggle()
}

function updateResponse(newSelection){
    NS.getParam(props.id,convertedTitle.value)[0]=newSelection;
    NS.globalSync()
    displayList.value=false;
}

function displayListToggle(){
    displayList.value=!displayList.value
}


</script>


<template>
        <VContainer>
        <div class="dropdown-title">{{ title }}</div>
        <div class="nodrag">
            <div  class="dropdown-container">
                <VContainer outer-margin="0px" spacing="0px">
                    <div  v-on:click="generateList()" class="dropdown-selected">{{ NS.getParam(id,convertedTitle)[0] }}</div>
                    <div v-if="displayList==true" v-for="(listentry,index) in dropdownList" class="dropdown-listentry" v-on:click="updateResponse(listentry)">
                        {{ listentry }}
                    </div>
                </VContainer>
            </div>
        </div>
        </VContainer>
</template>


<style scoped>
    .dropdown-title{
        width:max-content;
    }
    .dropdown-container{
        /* color: v-bind('node_colors.prompt_fg'); */
        /* background:v-bind('node_colors.prompt_bg'); */
        display:flex;
        flex-direction:column;
        margin: 0px;
        border-radius: 2px gray solid;
        color:black;
        overflow:visible;
        border:solid gray 1px;

    }
    .dropdown-selected{
        color:black;
        background:white;
        width:100%;
        height:20px;
    }
    .dropdown-listentry{
        background:rgb(232, 232, 232);
    }
    .dropdown-listentry:hover{
        background:rgb(236, 239, 240);
    }
    .dropdown-list{
        display:flex;
        flex-direction:column;
        background:rgb(221, 221, 221);
    }
    .response_title{
        display:flex;
    }
</style>