<script setup>
import { useNodesStore } from '@/components/editor/nodes/node_store.js'
import { computed, ref } from 'vue'
import ContextMenu from './context_menu.vue'
import NestedObject from './nodes/node_assets/nested_object.vue'

const object_type_list = [
  'room',
  'item',
  'npc',
  'pathway',
  'player',
  'custom',
]


import { dataHas, treeify } from '@/components/editor/nodes/n-utils';
import { VueFlow } from '@vue-flow/core'
import CanvasSelector from './canvasSelector.vue'

const nodesStore = useNodesStore()

// Use computed properties to observe the nodes in the store. Any with object_type_list will be displayed

const objects = ref([]);

const clickedCanvas = ref(0)

const isContextMenuVisible = ref(false)
const contextMenuId = ref(null)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuActions=ref()




//I'm putting context menu actions of the asset browser in here instead of context_menu.vue. 
// It would be nice to have it be one size fits all (A lot of this will probably be copypasted to node_base.vue), 
// but this way we can have seperate actions for the asset browser and canvas nodes, which could come in handy

const actionsByType = {

//these are actions that all nodes have. You can always delete a node.
commonActions: [
  {label: 'Delete', action: () => nodesStore.deleteNode(contextMenuId.value) },
],
//these are actions that all objects have. Rename node for now.
objectActions: [
  {label: 'Rename', action: () => nodesStore.renameNode(contextMenuId.value) },
]

//later we can have actions for specific node types. I just don't know of any right now.
//it will probably be mostly function nodes, considering objects are essentially all the same.
}
// Show the context menu on right-click
function showContextMenu(event) {
  // Check if event is an object with event and id properties. this way it can handle either a direct or nested event.
  const contextEvent = event.event || event
  const nodeId = event.id || event

  console.log("Context Menu Triggered:", { nodeId })
  contextMenuId.value = nodeId
  //we're gonna want to have the node so we can use it's data to determine context meny behavior
  const thisNode=nodesStore.getNode(nodeId)
  const nodeType=thisNode.type

  //first off, you can't do anything to these nodes or nodes with no type. (If we want to later editing the logic shouldn't be too hard)
  if(!nodeType||nodeType=='player'||nodeType=='start') 
  {
    return;
  }

  // Set context menu position
  contextMenuPosition.value = { 
    x: contextEvent.clientX, 
    y: contextEvent.clientY-75 
  }

  isContextMenuVisible.value = true//what makes the menu visible
  console.log("context menu position is ",contextMenuPosition.value)
  console.log("context menu id is ",contextMenuId.value)
  contextEvent.preventDefault()


  //if we're cool being a little messy, we could add a very long switch statement here that adds actions based off nodetype
    contextMenuActions.value = [//these actions are what will be availible when anything is right clicked. 
      ...actionsByType.commonActions,
      // Add more item-specific actions here.
    ]

    //if the node is an object, add object actions
    if (object_type_list.includes(nodeType)) {
    contextMenuActions.value = [
      ...contextMenuActions.value, // Keep previous actions
      ...actionsByType.objectActions, // Add object-specific actions
    ];
  }
}



function syncAssetBrowser(){
  objects.value = treeify(nodesStore.getAllNodes().filter(node => object_type_list.includes(node.type)))
}
const syn = computed( ()=>{
  syncAssetBrowser()
  return nodesStore.syncer
})



// Handle action for context menu
function handleContextMenuAction(action) {
  action.action()
  isContextMenuVisible.value = false
}

// Close the context menu
function closeContextMenu() {
  isContextMenuVisible.value = false
}
function switchCanvas(id, assetBrowserIndex){
  console.log("asset_browser.vue: swapping canvas" ,nodesStore.getAllNodes())
  nodesStore.swapCanvas(Number(id));
  syncAssetBrowser()
  clickedCanvas.value = assetBrowserIndex
}

</script>

<template>
  <div style="display: none">{{ syn }}</div>
    <div class="asset_browser">
      <div class="selector-text">Current Canvas</div>
      <CanvasSelector></CanvasSelector>
      <div class="selector-text">Object Tree</div>
      <div class="objects-container">
        <NestedObject :n="objects"  @ov-context-clicked="showContextMenu($event)" 
        />
      </div>

      <ContextMenu
        v-if="isContextMenuVisible"
        :position="contextMenuPosition"
        :actions="contextMenuActions"
        @action="handleContextMenuAction"
        @hide-context-menu="closeContextMenu"
      />
    </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans");
.asset_browser {
  height:auto;
  display: flex;
  font-size:1rem;
  width:250px;
  justify-content: center;
  flex-direction: column;
  background:#060022;
  justify-content: space-between;
}

.asset-browser-hr{
  margin-top:5px;
  margin-bottom:5px;
}
.ab-object{
  display:flex;
  flex-direction: row;
  height:min-height;
}

.selector-text{
    position:relative;
    font-size:0.8rem;
    padding: 0 0.5rem;
    white-space: nowrap;
    color:rgb(255, 255, 255);
    text-overflow:ellipsis;
    z-index:4;
    font-family: 'Josefin Sans', sans-serif;
}

h3 {
  position:relative;
  font-size:0.8rem;
  padding: 0 0.5rem;
  white-space: nowrap;
  color:rgb(255, 255, 255);
  text-overflow:ellipsis;
  z-index:4;
  font-family: 'Josefin Sans', sans-serif;
  font-weight: normal;
  text-align: left;
  width:auto;
  border-bottom: none;
}

ul {
  margin-left: 20px;
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
  font-size: 1em;
  color: #444;
}

.objects-container {
  height: 100%;
  overflow-y:scroll;
  overflow-x:scroll;
  width:auto;
  background:#060022;
}

details div {
  cursor: pointer;
  font-weight: bold;
}

.canvas-selector{
  position:fixed;
  pointer-events: none;
}
</style>
