<script setup>
import { useNodesStore } from './nodes/node_store.js'
import { computed, ref } from 'vue'
import ContextMenu from './context_menu.vue'

const object_type_list = [
  'room',
  'item',
  'npc',
  'pathway',
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
    <h3>Objects</h3>
    <div v-if="objects.length > 0">
      <div
        v-for="object in objects"
        :key="object.id"
        @contextmenu="showContextMenu($event, object.type, object.id)"
      >
        <details>
          <summary>        {{ object.object_name || 'ERR_UNNAMED_NODE' }}          </summary>
          <ul>
            <!-- <li v-for="item in nodesStore.getItemsInRoom(room.id)" :key="item.id">
              {{ item.object_name || 'Unnamed Item' }}        (Item)
            </li> -->
          </ul>
        </details>
      </div>
    </div>
    <p v-else>No objects in world</p>

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
.asset_browser {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-left: solid black 1px;
  background: rgb(255, 255, 255)
}

h3 {
  margin-bottom: 10px;
  font-size: 1.2em;
  color: #000000;
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

details {
  margin-bottom: 10px;
}

details summary {
  cursor: pointer;
  font-weight: bold;
}
</style>
