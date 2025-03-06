<!---FATHER CLASS OF ALL NODES-->
<script setup>
import { ref, defineProps, computed, watch, defineEmits } from 'vue';
import { HContainer, SmallButton, Tooltip, DebugInfo} from './node_assets/n-component-imports.js';
import useDragAndDrop from '../drag_drop.js';
import help_msg from './help_btn_msg';
import ContextMenu from '../context_menu.vue'
import { Position } from '@vue-flow/core';
import { useNodesStore } from '../nodes/node_store.js'
import { useVueFlow } from '@vue-flow/core';

const { screenToFlowCoordinate, updateNodeData, updateNode, findNode } = useVueFlow()
Position


const nodesStore = useNodesStore()




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
  isContextMenuVisible.value = true//what makes the menu visible
  event.preventDefault()//prevents the default browser context menu from appearing
  //if we're cool being a little messy, we could add a very long switch statement here that adds actions for specific nodes.
    contextMenuActions.value = [//these actions are what will be availible when anything is right clicked. 
      { label: 'Delete', action: () => nodesStore.deleteNode(nodeId) },
      { label: 'Rename', action: () => nodesStore.renameNode(nodeId) },//
      // Add more item-specific actions here.
    ]
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


</script>

<template>
  <div class="outline">
    <div class="node_container" :draggable="draggable" @dragstart="onDragStart($event, props.type)"
        @contextmenu="showContextMenu($event, props.type, props.id)">
        <div class="node_title" :style="{ 'background-image': 'linear-gradient(180deg,' + 'data.bg_color' + ',' + 'data.fg_color' + ')' }">

        
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
}
.outline:active{
  background: blue;
}
.node_container:active{
  outline:4px blue solid;
}

.outline{
  border-radius: 7px;
  background:v-bind('data.fg_color');
  padding:2px;
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
    background-image: linear-gradient(180deg, v-bind('data.bg_color'),v-bind('data.fg_color'));
    text-shadow: v-bind('data.fg_color') -1px 1px, v-bind('data.fg_color') -1px -1px,  v-bind('data.fg_color') -2px 0px;
}
textarea{
    color:blue;
}
</style>