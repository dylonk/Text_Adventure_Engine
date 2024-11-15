// stores/nodesStore.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useNodesStore = defineStore('nodes', () => {
  const nodes = reactive({
    rooms: [],
    items: [],
    prompts: []
  })

  // Add a node to the store
  const addNode = (node) => {
    if (node.type === 'room') {
      console.log('room added to store')
      nodes.rooms.push(node)
    } else if (node.type === 'item') {
      nodes.items.push(node)
    } else if (node.type === 'prompt') {
      nodes.prompts.push(node)
    }
  }

  // Function to set an item as a child of a room
  const setItemParent = (itemId, roomId) => {
    const item = nodes.items.find(item => item.id === itemId)
    if (item) {
      item.parentId = roomId // Set the room ID as the parent of the item
    }
  }

  // Optional: Function to get all items in a room
  const getItemsInRoom = (roomId) => {
    return nodes.items.filter(item => item.parentId === roomId)
  }

  return {
    nodes,
    addNode,
    setItemParent,
    getItemsInRoom
  }
})
