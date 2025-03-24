<script setup>
import { useNodesStore } from '@/components/editor/nodes/node_store.js'
import { computed, ref } from 'vue'
import ContextMenu from './context_menu.vue'

const object_type_list = [
  'room',
  'item',
  'npc',
  'pathway',
  'custom',
]


import { dataHas, treeify } from '@/components/editor/nodes/n-utils';

const nodesStore = useNodesStore()

// Use computed properties to observe the nodes in the store. Any with object_type_list will be displayed

const objects = ref([]);

const clickedCanvas = ref(0)

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
  console.log("all nodes: ",nodesStore.globalNodes)

  contextMenuId.value = nodeId //the id of the node
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  isContextMenuVisible.value = true//what makes the menu visible
  event.preventDefault()//prevents the default browser context menu from appearing


  //if we're cool being a little messy, we could add a very long switch statement here that adds actions based off nodetype
    contextMenuActions.value = [//these actions are what will be availible when anything is right clicked. 
      { label: 'Delete', action: () => nodesStore.deleteNode(nodeId) },
      { label: 'Rename', action: () => nodesStore.renameNode(nodeId) },//
      // Add more item-specific actions here.
    ]
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
function getDepth(node){
  const depth = dataHas(node.data,"nodeDepth",0)
  let whitespace = ""
  for(let i = 0; i < depth-1; i++){
    whitespace+="│ "
  }
  whitespace+="┕ ▼ "
  return whitespace
}
</script>

<template>
  <div style="display: none">{{ syn }}</div>
    <div class="asset_browser">
      <h3>Objects</h3>
      <div class="objects-container">
            <div v-if="clickedCanvas==0" @click="switchCanvas(0,0)" class="sum-selected">     ▼ Global        </div>
            <div v-else class="sum-light" @click="switchCanvas(0,0)">▼ Global</div>

        <div
          v-for="(object,index) in objects"
          :key="object.id"
          @contextmenu="showContextMenu($event, object.type, object.id)"
        >
            <div v-if="index==clickedCanvas-1" @click="switchCanvas(object.id,index+1)" class="sum-selected">        {{ getDepth(object) + object.data.object_name || 'ERR_UNNAMED_NODE' }}          </div>
            <div v-else-if="index%2==0" @click="switchCanvas(object.id,index+1)" class="sum-dark" style="color:v-bind('object.data.bg_color');">        {{ getDepth(object) + object.data.object_name || 'ERR_UNNAMED_NODE' }}          </div>
            <div v-else @click="switchCanvas(object.id,index+1)" class="sum-light">        {{ getDepth(object) + object.data.object_name || 'ERR_UNNAMED_NODE' }}          </div>
          <div v-if="index==-1" style="height: 0;width: 0; position:relative;left:-28px;top:-31px;">
            <img onload="this.width*=0.45" class="canvas-selector" src="@/assets/Images/editor/canvasselector.png">
          </div>
        </div>
      </div>

      <!-- <h3>Items</h3>
      <ul v-if="items.length > 0">
        <li v-for="item in items" :key="item.id" @contextmenu="showContextMenu($event, 'item', item.id)">
          {{ item.object_name || 'Unnamed Item' }}
        </li>
      </ul>
      <p v-else>No items available</p> -->

      <!-- Context Menu Component -->
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
@import url("https://fonts.googleapis.com/css2?family=Scada");
.asset_browser {
  height:auto;
  display: flex;
  min-width:10dvw;
  flex-direction: column;
  background: rgb(93, 93, 93)
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

.sum-dark{
  color:white;
  min-width:fit-content;
  font-weight:bold;
  background:rgb(100, 100, 100);
  padding:0px;
  padding-left:8px;
  padding-right:5px;
  text-shadow:0px 1px black, -1px 0px black;
  text-overflow: ellipsis;
}
.sum-selected{
  min-width:fit-content;
  color:white;
  font-weight:bold;
  background:rgb(158, 158, 158);
  padding:0px;
  padding-left:8px;
  padding-right:5px;
  text-shadow:0px 1px black, -1px 0px black;
  text-overflow: ellipsis;
}
.sum-light{
  min-width:fit-content;
  color:white;
  font-weight:bold;
  background:gray;
  padding:0px;
  padding-left:8px;
  padding-right:5px;
  text-shadow:0px 1px black, -1px 0px black;
  text-overflow: ellipsis;
}

h3 {
  font-family: "Scada", serif;  
  font-size: 1.2em;
  color: rgb(180, 180, 180);
  margin-left:8px;
  margin-right:8px;
  margin-top:5px;
  margin-bottom:5px;
  padding-right:10px;
  padding-left:10px;
  text-align: center;
  width:max-content;
  border-radius: 5px;
  border: rgb(46, 46, 46) 1.7px solid;

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
  overflow:hidden;
  border-top: solid rgb(47, 47, 47) 1.5px;
  background: rgb(100, 100, 100);

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
