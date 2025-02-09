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
import node_colors from './node-colors.js';

const { screenToFlowCoordinate } = useVueFlow()
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
    id:{ default:-10},
    type: { type: String, default: 'unimplemented' },
    display_type: { type: String, default: 'BadNode' },
    bg_color: { type: String, default: '#FFF' },
    fg_color: { type: String, default: '#000'},
    position: {type: Object, default: () => ({ x: 0, y: 0 })}, //position should be a prop, becuse we're gonna have to retrieve this stuff for project loading

    //THIS IS WHERE ALL OUR NODE DATA BESIDES POSTION, TYPE AND ID SHOULD ACTUALLY GO
    data: {
    type: Object,
    required: true,

  },
    })


console.log('NodeBase received:', {//nodebase init for testing
  id: props.id, 
  type: props.type, 
  idType: typeof props.id
});




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
if(props.containHelp){
    watch(isDisplayTooltip);
}
</script>

<template>
    <div class="node_container" :draggable="true" @dragstart="onDragStart($event, props.type)"
        @contextmenu="showContextMenu($event, props.type, props.id)">
        <div class="node_title" :style="{ 'background-image': 'linear-gradient(180deg,' + bg_color + ',' + fg_color + ')' }">
        <HContainer outerMargin="0px">
        <div>
        {{ props.display_type }}
        </div>
        </HContainer>
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
    background:v-bind(bg_color);
    outline: 1px solid v-bind(fg_color);
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
    background-image: linear-gradient(180deg, v-bind(fg_color),v-bind(bg_color));
    text-shadow: v-bind(fg_color) -1px 1px, v-bind(fg_color) -1px -1px,  v-bind(fg_color) -2px 0px;
}
textarea{
    color:blue;
}
</style>