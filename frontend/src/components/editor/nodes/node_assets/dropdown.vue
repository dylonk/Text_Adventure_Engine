<script setup>
import { ref, defineProps, computed, onMounted ,defineEmits} from 'vue';
import { SmallButton, HContainer, HandleIn, HandleOut, VContainer } from './n-component-imports.js';

let response_id = 0;
const props = defineProps({
    id: { default:-1},
    title: "",
    dropdownType: "objects",
    defaultSelection: "",
    defaultList:[],
    exclusionList:[],
    displayHorizontal:false,
})

const displayList = ref(false)
const dropdownList = ref([])

//this allows for a default dropdown value, e.g. await nodes store location being set to "false"
onMounted(() => {
  const currentParam = NS.getParam(props.id, convertedTitle.value)[0];
  if (!currentParam || currentParam === "") {
    const initial = props.defaultSelection || props.defaultList[0] || "";
    NS.getParam(props.id, convertedTitle.value)[0] = initial;
    NS.globalSync();
  }
});

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
  NS.contributeFunctionParameters(props.id,defaultArgs.paramName,defaultArgs.params); // a little confusing, but this adds 1 param to function_params in the style {name:PARAM_NAME, value:ARRAY}
//------------------------------IMPORTANT END-------------------------------------------

function generateList(){
    console.log("Dropdown clicked for id ", props.id, props.dropdownType)
    let eList = props.exclusionList? props.exclusionList : []
    eList.push(NS.getParam(props.id,convertedTitle.value)[0])
    dropdownList.value = props.defaultList ? props.defaultList : []
    if(props.dropdownType=="objects"){
        dropdownList.value = dropdownList.value.concat(NS.getAllNodes(true,"title"))
        dropdownList.value = dropdownList.value.filter(entry=>!eList.includes(entry))
    }
    if(props.dropdownType=="images"){
        dropdownList.value = dropdownList.value.concat(NS.getProjectImageNames())
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
        <HContainer v-if="displayHorizontal">
        <div class="dropdown-title">{{ title }}</div>
        <div class="nodrag" style="width:100%;">
            <div  class="dropdown-container">
                <VContainer outer-margin="0px" spacing="0px">
                    <div v-if="!NS.getParam(id,convertedTitle)[0] == ''" v-on:click="generateList()" class="dropdown-selected">{{ NS.getParam(id,convertedTitle)[0]}}</div>
                    <div v-else v-on:click="generateList()" class="dropdown-selected" style="color:#AAAAAA"> None selected </div>

                        <div v-if="displayList==true" style="max-height:100px; overflow-y:scroll;" class="nowheel">
                            <div v-if="dropdownList.value==[]"  class="dropdown-listentry">List is empty</div>
                            <div v-else v-for="(listentry,index) in dropdownList" class="dropdown-listentry" v-on:click="updateResponse(listentry); $emit('dropdown-updated',listentry)">
                                {{ listentry }}
                            </div>
                        </div>
                </VContainer>
            </div>
        </div>
        </HContainer>
        <VContainer v-else>
        <div class="dropdown-title">{{ title }}</div>
        <div class="nodrag">
            <div  class="dropdown-container">
                <VContainer outer-margin="0px" spacing="0px">
                    <div  v-on:click="generateList()" class="dropdown-selected">{{ NS.getParam(id,convertedTitle)[0] }}</div>
                        <div v-if="displayList==true" style="max-height:100px; overflow-y:scroll;" class="nowheel">
                            <div v-if="dropdownList.value==[]"  class="dropdown-listentry">List is empty</div>
                            <div v-else v-for="(listentry,index) in dropdownList" class="dropdown-listentry" v-on:click="updateResponse(listentry); $emit('dropdown-updated',listentry)">
                                {{ listentry }}
                            </div>
                        </div>
                </VContainer>
            </div>
        </div>
        </VContainer>
</template>


<style scoped>
    .dropdown-title{
        width:max-content;
        text-wrap:nowrap;
    }
    .dropdown-container{
        /* color: v-bind('node_colors.prompt_fg'); */
        /* background:v-bind('node_colors.prompt_bg'); */
        display:flex;
        flex-direction:column;
        margin: 0px;
        border-radius: 2px gray solid;
        color:black;
        border:solid rgba(0, 0, 0, 0.165) 1px;
    }
    .dropdown-selected{
        color:black;
        background:white;
        width:100%;
        height:20px;
    }
    .dropdown-listentry{
        background:rgb(232, 232, 232);
        z-index:auto;

    }
    .dropdown-listentry:hover{
        background:rgb(236, 239, 240);
    }
    .dropdown-list{
        position:relative;
        display:flex;
        flex-direction:column;
        background:rgb(221, 221, 221);
    }
    .response_title{
        display:flex;
    }
</style>