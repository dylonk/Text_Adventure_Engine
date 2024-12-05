import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useNodesStore = defineStore('nodes', () => {//nodes store seperates nodes by type
  const nodes = reactive({
    objects: [],
    functions: [],
  });

  const object_count = reactive({ //For making unique object names
    total:0, //just using total for now reallym but if you want to make unique ones go ahead im lazy
    room:0,
    item:0,
    npc: 0,
    pathway: 0,
    custom: 0,
  })
  function incrementCount(key) {
    if (key in object_count) {
      object_count[key]++;
    } else {
      console.error(`Key "${key}" does not exist in object_count.`);
    }
  }

  // Add a node to the store
  const addNode = (node) => {
    const nodeExists = [...nodes.objects, ...nodes.functions].find((n) => n.id === node.id);
    if (!node.id || nodeExists) {
      console.error(`Node with id ${node.id} already exists`);
      return;
    }
    //adds the default names
    if (node.type == 'room' || node.type == 'item' || node.type == 'pathway' || node.type == 'player' || node.type == 'npc' || node.type == 'custom') {
      incrementCount(node.type);
      node.object_name = node.type + object_count[node.type];
      nodes.objects.push(node);
    } else {
      nodes.functions.push(node);
    }
  };

const renameNode = (id) => {
    const nodeExists = [...nodes.objects].find((n) => n.id === id);
    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return;
    }
    const newName = prompt(`Enter a new name for node ${id}:`); // !!NEED TO IMPLEMENT CHECK FOR OBJECT NAME UNIQUENESS
    if (newName !== null) {
      nodeExists.object_name = newName;
    }
  };


  // Delete a node by ID
  const deleteNode = (id) => {
    console.log("deleting node from node store id:",id);
    nodes.objects = nodes.objects.filter((node)=>node.id !== id);
    nodes.functions = nodes.functions.filter((node) => node.id !== id);
  };

const getNode = (id) => {
  console.log("getNode called on id", id)
    const nodeExists = [...nodes.objects, ...nodes.functions].find((n) => n.id === id);
    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return;
    }
  if (nodeExists.type == 'room' || nodeExists.type == 'item' || nodeExists.type == 'pathway' || nodeExists.type == 'player' || nodeExists.type == 'npc' || nodeExists.type == 'custom'){
    console.log("node exists", nodeExists, "title is", nodeExists.object_name);
  }
  else {
    console.log("function node exists", nodeExists);
  }
    return nodeExists
}
  // Get all nodes for canvas
  const getAllNodes = () => {
    return [...nodes.objects, ...nodes.functions];
  };
// // Optional: Function to get all items in a room
//   const getItemsInRoom = (roomId) => {
//     return nodes.items.filter(item => item.parentId === roomId)
//   }

  return {//exporting functions
    nodes,
    addNode,
    deleteNode,
    getAllNodes,
    // getItemsInRoom,
    renameNode,
    getNode
  };
});
