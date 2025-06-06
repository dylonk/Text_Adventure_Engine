<script setup>
import { defineProps, watch, computed, ref } from 'vue';
import NodeBase from '../node_base.vue'
import { DebugInfo, HContainer, SmallButton } from '../node_assets/n-component-imports';

const listSelection = ref(-1)
const props = defineProps({   //a lot of these are constructed into a data object and passed to node_base as seen below
  id: -1,  
});

//----------------------------!!IMPORTANT FOR NODE DATA MANIPULATION/FETCHING!!---------------------------------------------
// ADD TO BE ABLE TO STORE OR RETRIEVE DYNAMIC INFORMATION FROM THE NODE ITSELF
// Component MUST have props.id for this to work, and it needs to be passed down through each component
// Parent component must also have @init-node-id listener
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const defaultObjData =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    isObject: true, // These properties are distinct to ObjectBase, !!dont copy them!!
    properties: {aliases: "ObjectName,ObjectName2",},
    display_type: 'ObjectBase',
  }
  console.log("obj_base.vue: ReferenceID is = " + props.id)
  console.log("obj_base.vue: bg_color is " + NS.getNodeData(props.id,"bg_color"))
  NS.contributeNodeData(props.id,defaultObjData);
  //IMPORTANT AS WELL, MAKE SURE TO BE CONSIDERATE OF HOW OFTEN THE REACTIVITY IS UPDATED, CAN LEAD TO VERY SLOW CODE. Call ND.subproperty directly if using v-for on it.
  import { dataHas } from '@/components/editor/nodes/n-utils';
  const ND = computed(() => {
  return NS.getNode(props.id).data;
});
//------------------------------IMPORTANT END-------------------------------------------

function addProperty(){
  const propertyKey = prompt("Type your new property name");
  if(propertyKey==null||propertyKey==""){
    return;
  }
  const propertyValue = prompt("Type initial value");
  NS.setNodeProperty(props.id,propertyKey,propertyValue)
}
function setProperty(inputKey,inputValue){
  NS.setNodeProperty(props.id,inputKey,inputValue)
}
function removeProperty(propertyKey){
  const acceptRemoval = confirm(`Are you sure you would like to delete ${propertyKey}?`)
  if(acceptRemoval){
    NS.removeNodeProperty(props.id,propertyKey)
  }
  else{
    return;
  }
}


</script>

<template >
  <NodeBase 
  :id="id"
  >

    <div class="object-name-container">  
    <HContainer>
      {{ ND.object_name }}  
      <SmallButton @click="NS.swapCanvas(props.id)" style="margin-left:auto;" :id="id" text="↷"></SmallButton>
    </HContainer>
    </div>
      <div class="object-properties-container">
    <div class="property-title" style="font-weight:bold"   @click="listSelection=-1"
    >
      Properties
      <button @click="addProperty()" class="property-list-button">+</button>
    </div>
    <div v-for="(property,title,index) in ND.properties" @click="listSelection=index" class="properties">
      <div v-if="index==listSelection" class="property-selected">
        <button @click="removeProperty(title)" class="property-list-delete" style="margin-right:3px;">✕</button>
          {{ title+" " }}
        <div class="nodrag">
          <input class="property-input"  @input="setProperty(title,$event.target.value)" :value="property" @keyup.enter="listSelection=-1">
        </div>
      </div>
      <div v-else class="property"><div style="font-weight:bold;">{{ title }}</div>{{": " + property }}</div>
    </div>
    
  </div>
  </NodeBase>
</template>



<style scoped>
.property-list-button{
  margin-top: 3px;
  margin-bottom: 0px;
  margin-right:0px;
  margin-left:auto;
  font-size:small;
  border: white 1px solid;
  background: none;
  border-radius: 2px;
  color: white;

}
.property-list-delete{
  margin:0px;
  font-size:small;
  font-weight: bold;
  background:none;
  background-color: none;
  color: rgb(42, 42, 42);
  border:none;
}

.property-list-delete:hover{
  color:white;
}
.property-list-button:active{
  color:white;
}
.object-name-container{
  font-size: 16px;
  background: v-bind('dataHas(ND,"fg_color")');
  color:v-bind('dataHas(ND,"bg_color")');
  margin:0px !important;
  padding-left: 5px;
  padding-bottom: 2px;
  padding-right: 5px;
}
.object-properties-container{
  color: v-bind('dataHas(ND,"bg_color")');
  height: min-content;
  background:white;
  margin: 0px;
  display:flex;
  flex-direction: column;
}
.properties:nth-child(odd){
  background-color: rgb(224, 224, 224);
}

.property{
  display:flex;
  font-family:Verdana, Geneva, Tahoma, sans-serif;
  font-weight: lighter;
  text-align: center;
  line-height: 20px;
  color:rgb(0, 0, 0);
  padding:3px;
  padding-top:0px;
}

.property-title{
  display:flex;
  background: black;
  font-family:Verdana, Geneva, Tahoma, sans-serif;
  font-weight: lighter;
  color:white;
  line-height: 25px;
  padding:3px;
  padding-top:0px;
  border-top:v-bind('dataHas(ND,"bg_color")');
}

.property:hover{
  background: rgb(181, 187, 206);
}
.property-selected{
  display:flex;
  font-family:Verdana, Geneva, Tahoma, sans-serif;
  font-weight: bold;
  color:rgb(51, 51, 51);
  padding:3px;
  line-height: 25px;
  padding:0px;
}
.property-selected:hover{
  background: rgb(181, 187, 206);
}
.property-input{
  height:82%;
  border:none;
  margin:2px;
  width:fit-content;
  margin-left:4px;
  color:gray;
  border:1px gray solid;
  border-radius: 3px;
}
.property-input:focus{
  outline:none;
}
</style>