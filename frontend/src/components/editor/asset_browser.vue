<script setup>
import { useNodesStore } from './nodes/node_store.js'
import { computed, ref } from 'vue'
import ContextMenu from './context_menu.vue'

const object_type_list = [
  'room',
  'item',
  'npc',
  'pathway',
  'custom',
]



const nodesStore = useNodesStore()

// Use computed properties to observe the nodes in the store. Any with object_type_list will be displayed
const objects = computed(() => {
  return nodesStore.nodes.filter(node => object_type_list.includes(node.type));
});

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
  console.log("all nodes: ",nodesStore.nodes)

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







// Handle action for context menu
function handleContextMenuAction(action) {
  action.action()
  isContextMenuVisible.value = false
}

// Close the context menu
function closeContextMenu() {
  isContextMenuVisible.value = false
}


</script>

<template>
    <div class="asset_browser">
      <h3>Asset Browser</h3>
      <div class="objects-container">
        <details>
            <summary class="sum-light">Global</summary>
        </details>
        <div style="height: 0;width: 0; position:relative;left:-28px;top:-31px;">
          <img onload="this.width*=0.45" class="canvas-selector" src="@/assets/Images/editor/canvasselector.png">
        </div>
        <div
          v-for="(object,index) in objects"
          :key="object.id"
          @contextmenu="showContextMenu($event, object.type, object.id)"
        >
          <details>
            <summary v-if="index%2==0" class="sum-dark">        {{ object.data.object_name || 'ERR_UNNAMED_NODE' }}          </summary>
            <summary v-else class="sum-light">        {{ object.data.object_name || 'ERR_UNNAMED_NODE' }}          </summary>
          </details>
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
  flex-direction: column;
  background: rgb(74, 74, 74)
}
.asset-browser-hr{
  margin-top:5px;
  margin-bottom:5px;
}
details summary{
  color:white;
  text-shadow: 0px 1.4px black;
}
.sum-dark{
  background:rgb(100, 100, 100);
  padding:3px;
  padding-left:5px;
  padding-right:5px;
}
.sum-light{
  background:gray;
  padding:3px;
  padding-left:5px;
  padding-right:5px;
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

details summary {
  cursor: pointer;
  font-weight: bold;
}

.canvas-selector{
  position:fixed;
  pointer-events: none;
}
</style>
