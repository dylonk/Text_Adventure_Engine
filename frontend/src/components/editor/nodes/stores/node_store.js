import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useNodesStore = defineStore('nodes', () => {//nodes store seperates nodes by type
  const nodes = reactive({
    rooms: [],
    items: [],
    prompts: [],
  });

  // Add a node to the store
  const addNode = (node) => {
    const nodeExists = [...nodes.rooms, ...nodes.items, ...nodes.prompts].find((n) => n.id === node.id);
    if (!node.id || nodeExists) {
      console.error(`Node with id ${node.id} already exists`);
      return;
    }

    if (node.type === 'room') {
      nodes.rooms.push(node);
    } else if (node.type === 'item') {
      nodes.items.push(node);
    } else if (node.type === 'prompt') {
      nodes.prompts.push(node);
    }
  };

const renameNode = (id) => {
    const nodeExists = [...nodes.rooms, ...nodes.items, ...nodes.prompts].find((n) => n.id === id);
    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return;
    }
    const newName = prompt(`Enter a new name for node ${id}:`);
    if (newName !== null) {
      nodeExists.node_title = newName;
    }  
  };


  // Delete a node by ID
  const deleteNode = (id) => {
    console.log("deleting node from node store id:",id)
    nodes.rooms = nodes.rooms.filter((node) => node.id !== id);
    nodes.items = nodes.items.filter((node) => node.id !== id);
    nodes.prompts = nodes.prompts.filter((node) => node.id !== id);
  };

const getNode = (id) => {
  console.log("getNode called", id)
    const nodeExists = [...nodes.rooms, ...nodes.items, ...nodes.prompts].find((n) => n.id === id);
    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return;
    }
    console.log("node exists", nodeExists)
    return nodeExists
}
  // Get all nodes for canvas
  const getAllNodes = () => {
    return [...nodes.rooms, ...nodes.items, ...nodes.prompts];
  };
// Optional: Function to get all items in a room
  const getItemsInRoom = (roomId) => {
    return nodes.items.filter(item => item.parentId === roomId)
  }

  return {//exporting functions
    nodes,
    addNode,
    deleteNode,
    getAllNodes,
    getItemsInRoom,
    renameNode,
    getNode
  };
});
