import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useNodesStore = defineStore('nodes', () => {
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

  // Delete a node by ID
  const deleteNode = (id) => {
    console.log("deleting node from node store id",id)
    nodes.rooms = nodes.rooms.filter((node) => node.id !== id);
    nodes.items = nodes.items.filter((node) => node.id !== id);
    nodes.prompts = nodes.prompts.filter((node) => node.id !== id);
  };

// Optional: Function to get all items in a room


  // Get all nodes for canvas
  const getAllNodes = () => {
    return [...nodes.rooms, ...nodes.items, ...nodes.prompts];
  };

  const getItemsInRoom = (roomId) => {
    return nodes.items.filter(item => item.parentId === roomId)
  }

  return {
    nodes,
    addNode,
    deleteNode,
    getAllNodes,
    getItemsInRoom
  };
});
