<!---FATHER CLASS OF ALL NODES-->
<script setup>
import { ref, defineProps, computed, watch, defineEmits, onMounted } from 'vue';
import { HContainer, SmallButton, Tooltip, DebugInfo} from './node_assets/n-component-imports.js';
import useDragAndDrop from '../drag_drop.js';
import help_msg from './help_btn_msg';
import ContextMenu from '../context_menu.vue'
import { Position } from '@vue-flow/core';
import { useNodesStore } from '../nodes/node_store.js'
import { useVueFlow } from '@vue-flow/core';

const { screenToFlowCoordinate, updateNodeData, updateNode, findNode, updateNodeInternals } = useVueFlow()
Position


const nodesStore = useNodesStore()


//yes, this is very similar or even identical to the one in the asset browser. But one day it might not be.

const actionsByType = {
//these are actions that all nodes have. You can always delete a node.
commonActions: [
  {label: 'Delete', action: () => nodesStore.deleteNode(contextMenuId.value) },
  {label: 'Copy', action: () => nodesStore.copyNode(contextMenuId.value) },
],
//these are actions that all objects have. Rename node for now.
objectActions: [
  {label: 'Rename', action: () => nodesStore.renameNode(contextMenuId.value) },
]

//later we can have actions for specific node types. I just don't know of any right now.
//it will probably be mostly function nodes, considering objects are essentially all the same.
}

//contextmenu stuff
const isContextMenuVisible = ref(false)
const contextMenuId = ref(null)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuActions=ref()


// Show the context menu on right-click
function showContextMenu(event, nodeType, nodeId) {
    console.log("Context Menu Triggered:", {
    nodeId, 
    nodeType, 
  });




  contextMenuId.value = nodeId //the id of the node
  const { realx, realy } = screenToFlowCoordinate({
  realx: event.clientX,
  realy: event.clientY,
})
  contextMenuPosition.value = { x: realx, y: realy }; // Update reactive state  console.log("context menu position is ",contextMenuPosition.value)
  event.preventDefault()//prevents the default browser context menu from appearing

  if(!nodeType||nodeType=='player'||nodeType=='start') 
  {
    return;
  }
  const thisNode=nodesStore.getNode(nodeId)

  isContextMenuVisible.value = true//what makes the menu visible



  contextMenuActions.value = [//these actions are what will be availible when anything is right clicked. 
      ...actionsByType.commonActions,
      // Add more item-specific actions here.
    ]

    //if the node is an object, add object actions
    if (thisNode.data.isObject) {
    contextMenuActions.value = [
      ...contextMenuActions.value, // Keep previous actions
      ...actionsByType.objectActions, // Add object-specific actions
    ];
  }
}

// Handle action for context menu
function handleContextMenuAction(action) {
  action.action()
  isContextMenuVisible.value = false
}

// Close the context menu
function closeContextMenu() {
  isContextMenuVisible.value = false
}

const props = defineProps({
    id:-10,
    type: { type: String, default: 'unimplemented' },
    position: {type: Object, default: () => ({ x: 0, y: 0 })}, //position should be a prop, becuse we're gonna have to retrieve this stuff for project loading
    draggable: false,

    //THIS IS WHERE ALL OUR NODE DATA BESIDES POSTION, TYPE AND ID SHOULD ACTUALLY GO
    data: {
      defineData:true,
    },
  })

  const defaultObjData =  { //This is the data that this component contributes. Any existing properties within the functional node data will be replaced
    properties: {},
    initialized:true
  }
  nodesStore.contributeNodeData(props.id,defaultObjData,false);

console.log('NodeBase received:', {//nodebase init for testing
  id: props.id, 
  type: props.type, 
  idType: typeof props.id,
  data: props.data,
});

const emit = defineEmits(['init-node-id'])
function sendInitNodeId(){
  emit('init-node-id')
}

// I suppose we shouldn't be using built in updateNode functions
// updateNode(props.id, {data:{bg_color: temp_bg_color, fg_color:temp_fg_color}})
// updateNodeData(props.id, props.data); // This is how data is stored within the node itself. Everything in the data object gets eaten
sendInitNodeId();

function helpMessage(){
    let message = "";
    for(const key in help_msg){
        if(key==props.type){
            console.log("Tooltip Message: "+help_msg[key]);
            message=help_msg[key];
        }
    }
    return message;
}
const tooltip = ref(helpMessage());

const { onDragStart } = useDragAndDrop();
// if(props.containHelp){
//     watch(isDisplayTooltip);
// }
if(nodesStore.getNode(props.id)) nodesStore.getNode(props.id).data.srcHandles = 0
if(nodesStore.getNode(props.id)) nodesStore.getNode(props.id).data.tgtHandles = 0


onMounted(()=>{
  console.log("🦠🐎 Node Mounted, ID=",props.id)
  updateNodeInternals([props.id])
})

</script>

<template>
    <div v-if="data.tbStyle" class="node_container" :draggable="draggable" @dragstart="onDragStart($event, props.type)"
        @contextmenu.prevent.stop="showContextMenu($event, props.type, props.id)">
        <div v-if="data.isObject"  class="node_title">
        
        
        <div>
        <HContainer outer-margin="">
          {{ data.display_type }}
        <div v-if="props.id!=-1" class="node-id">
        {{" ID:" + props.id}}
        </div>
        </HContainer>
        </div>
        </div>
        <div v-if="!data.isObject" class="node_title">
        
        
        <div>
        <HContainer outer-margin="">
          {{ data.display_type }}
        <div v-if="props.id!=-1" class="node-id">
        {{" ID:" + props.id}}
        </div>
        </HContainer>
        </div>
        </div>
        <ContextMenu
      v-if="isContextMenuVisible"
      :position="contextMenuPosition"
      :actions="contextMenuActions"
      @action="handleContextMenuAction"
      @hide-context-menu="closeContextMenu"
    />
      <slot></slot>
    </div>
    <div v-else class="node_container tbStyle" :draggable="draggable" @dragstart="onDragStart($event, props.type)"
        @contextmenu="showContextMenu($event, props.type, props.id)">
        <div class="node_title tbStyle">

        
        <div>
        <HContainer outer-margin="">
          {{ data.display_type }}
        <div v-if="props.id!=-1" class="node-id">
        {{" ID:" + props.id}}
        </div>
        </HContainer>
        </div>
        </div>
        
        <ContextMenu
      v-if="isContextMenuVisible"
      :position="contextMenuPosition"
      :actions="contextMenuActions"
      @action="handleContextMenuAction"
      @hide-context-menu="closeContextMenu"
    />
      <slot></slot>
    </div>
</template>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';
*{
        font-family: 'Syne Mono', monospace;

}

.node_container{
    overflow:hidden;
    background:v-bind('data.bg_color');
    height:fit-content;
    width:fit-content;
    min-height: 4px;
    display:flex;
    flex-direction: column;
    border-radius: 6px;
    border-bottom:v-bind('data.fg_color') 4px solid;
}

.node_container:active{
  outline:2px blue solid;
}


.node-id{
  margin-left:auto;
  text-shadow:none;
  color:white;
  margin-right:0px;
}
.node_title{
    font-family: 'Syne Mono', monospace;
    color:rgb(255, 255, 255);
    width:100%;
    font-weight: 800;
    font-size:14px;
    margin:0px;
    padding:0px;
    padding-left:5px;
    padding-right:5px;
    background: v-bind('data.fg_color');
}
.node_title.tbStyle{
  color:v-bind('data.fg_color');
  background:v-bind('data.bg_color');
}
.node_container.tbStyle{
  border-bottom:black 4px solid;
}

textarea{
    color:blue;
}
</style>