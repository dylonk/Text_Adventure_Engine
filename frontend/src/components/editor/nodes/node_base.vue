<!---FATHER CLASS OF ALL NODES-->
<script setup>
import { ref, defineProps, computed, watch } from 'vue';
import { HContainer, SmallButton, Tooltip } from './node_assets/n-component-imports.js';
import useDragAndDrop from '../drag_drop.js';
import help_msg from './help_btn_msg';
import ContextMenu from '../context_menu.vue'
import { Position } from '@vue-flow/core';
import { useNodesStore } from '../nodes/node_store.js'
import { useVueFlow } from '@vue-flow/core';


const { screenToFlowCoordinate } = useVueFlow()



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
    idType: typeof nodeId
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
    id:{ default:-1},
    node_type:String, //NODE TYPE IS EXCLUSIVELY FOR COMMUNICATING, should not appear in finished product
    display_type: { type: String, default: 'UnnamedType' },
    bg_color: { type: String, default: '#FFF' },
    stroke_color: { type: String, default: '#000'},
    //children: { type: Array, default: () => [] }, // Define items as an array prop with a default empty array
    // Moving these guys to their respective places
    //node_properties: { type: Array, default: () => [] },
    //associated_function: String, //For when we actually start programming the script stuff
    //function_arguments: {type: Array, default: () => []},
    Position: {type: Object, default: () => ({ x: 0, y: 0 })}, //position should be a prop, becuse we're gonna have to retrieve this stuff for project loading
    containHelp: false, // Allows for the help button to appear on the topbar of a node. Used for TBNodes
})

console.log('NodeBase received:', {//nodebase init for testing
  id: props.id, 
  type: props.node_type, 
  idType: typeof props.id
});


let isDisplayTooltip = ref(false);

function helpToggle(){
    isDisplayTooltip = !isDisplayTooltip;
    console.log("toggledTooltip " + isDisplayTooltip);
}

function helpMessage(){
    let message = "";
    for(const key in help_msg){
        if(key==props.node_type){
            console.log("Tooltip Message: "+help_msg[key]);
            message=help_msg[key];
        }
    }
    return message;
}
const tooltip = ref(helpMessage());

const { onDragStart } = useDragAndDrop();
if(props.containHelp){
    watch(isDisplayTooltip);
}
</script>

<template>
    <div class="node_container" :draggable="true" @dragstart="onDragStart($event, props.node_type)"
        @contextmenu="showContextMenu($event, props.node_type, props.id)">
        <div class="node_title" :style="{ 'background-image': 'linear-gradient(180deg,' + bg_color + ',' + stroke_color + ')' }">
        <HContainer outerMargin="0px">
        <div>
        {{ props.display_type }}
        </div>
        <SmallButton @click="helpToggle()" v-if='containHelp' :component_bg_color="bg_color" :component_stroke_color="stroke_color" button_text="?" style="margin:5px; margin-right:0px;">
        </SmallButton>
        </HContainer>
        </div>
        <Tooltip v-if="isDisplayTooltip" :tooltip_info="tooltip"></Tooltip>
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
    background:v-bind(bg_color);
    outline: 1px solid v-bind(stroke_color);
    height:fit-content;
    width:fit-content;
    display:flex;
    flex-direction: column;
    border-radius: 6px;
}
.node_container:active{
    outline:2px rgb(0, 0, 255) solid;
}
.node_container>*{
    margin:10px;
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
    text-shadow: v-bind(stroke_color) -1px 1px, v-bind(stroke_color) -1px -1px,  v-bind(stroke_color) -2px 0px;
}
textarea{
    color:blue;
}
</style>