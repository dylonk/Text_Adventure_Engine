<script setup>
import { useNodesStore } from './nodes/stores/node_store.js'
import { computed, ref } from 'vue'
import ContextMenu from './context_menu.vue'

const nodesStore = useNodesStore()

// Use computed properties to observe the nodes in the store
const rooms = computed(() => nodesStore.nodes.rooms)
const items = computed(() => nodesStore.nodes.items)

const isContextMenuVisible = ref(false)
const contextMenuId = ref(null)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuActions=ref()
const newRoomName = ref('')
const editingRoom = ref(null)

// Show the context menu on right-click
function showContextMenu(event, itemType, itemId) {
  contextMenuId.value = itemId
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  isContextMenuVisible.value = true
  event.preventDefault()
  
  // Dynamically set actions based on itemType (e.g., rooms or items)
  if (itemType === 'room') {
    contextMenuActions.value = [
      { label: 'Rename', action: () => startEditing(itemId) },//
      { label: 'Delete', action: () => deleteRoom(itemId) },//

      // Future actions can go here, e.g., 'Delete', etc.
    ]
  } else if (itemType === 'item') {
    contextMenuActions.value = [
      { label: 'Delete', action: () => deleteItem(itemId) },
      // Add more item-specific actions here.
    ]
  }
}

function startEditing(roomId) {
  console.log("Renaming room");
  editingRoom.value = roomId;

  // Find the current room
  const currentRoom = nodesStore.nodes.rooms.find(r => r.id === roomId);

  // Use a prompt to ask for a new room name, pre-filling with the current name
  const userInput = prompt(
    "Enter a new name for the room:",
    currentRoom?.node_title || "Unnamed Room"
  );

  // If the user provides a new name (not null or empty), set it
  if (userInput && userInput.trim()) {
    currentRoom.node_title = userInput.trim(); // Update the name in the store immediately
  }

  // Reset editing state
  editingRoom.value = null;
  newRoomName.value = '';
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

// Deleting an item (future functionality)
function deleteItem(itemId) {
  console.log("deleting item id", itemId)
  nodesStore.deleteNode(itemId); // Remove from the store
}
function deleteRoom(roomId) {
  console.log("deleting room id", roomId)
  nodesStore.deleteNode(roomId); // Remove from the store
}
</script>

<template>
  <div class="asset_browser">
    <h3>Rooms</h3>
    <div v-if="rooms.length > 0">
      <div 
        v-for="room in rooms" 
        :key="room.id" 
        @contextmenu="showContextMenu($event, 'room', room.id)"
      >
        <details>
          <summary>{{ room.node_title }}</summary>
          <ul>
            <li v-for="item in nodesStore.getItemsInRoom(room.id)" :key="item.id">
              {{ item.node_title }} (Item)
            </li>
          </ul>
        </details>
      </div>
    </div>
    <p v-else>No rooms available</p>

    <h3>Items</h3>
    <ul v-if="items.length > 0">
      <li v-for="item in items" :key="item.id" @contextmenu="showContextMenu($event, 'item', item.id)">
        {{ item.node_title || 'Unnamed Item' }}
      </li>
    </ul>
    <p v-else>No items available</p>

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
}

h3 {
  margin-bottom: 10px;
  font-size: 1.2em;
  color: #333;
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
