import { defineStore } from 'pinia';
import { reactive,computed } from 'vue';
import { useVueFlow } from '@vue-flow/core'
const { setNodes } = useVueFlow(); // Grab the setNodes method from VueFlow
const vueflowInstance = useVueFlow(); 
import { toRaw } from 'vue';
const { removeNodes } = useVueFlow()



export const useNodesStore = defineStore('nodes', () => {//nodes store seperates nodes by type
  const nodes = reactive({
    objects: [],
    functions: [],
  });
  const allNodes = computed(() => [...nodes.objects, ...nodes.functions]);

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
    console.log("Before adding:", nodes.objects);
    const nodeExists = [...nodes.objects, ...nodes.functions].find((n) => n.id === Number(node.id));
    console.log("Adding node:", {
      id: node.id,
      type: node.type,
      idType: typeof node.id
    });
    if (!node.id || nodeExists) {
      console.error(`Node with id ${node.id} already exists`);
      return;
    }
    //adds the default names
    if (node.type == 'room' || node.type == 'item' || node.type == 'pathway' || node.type == 'player' || node.type == 'npc' || node.type == 'custom') {
      incrementCount(node.type);
      node.object_name = node.type + object_count[node.type];
      nodes.objects.push(node);
      console.log("After adding:", nodes.objects);

    } else {  //if the node is a function
      nodes.functions.push(node);
      console.log("function added with id", node.id);

    }

  };

const renameNode = (id) => {
    const nodeExists = [...nodes.objects].find((n) => n.id === Number(id));
    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return;
    }
    const newName = prompt(`Enter a new name for node ${id}:`); // !!NEED TO IMPLEMENT CHECK FOR OBJECT NAME UNIQUENESS
    if (newName !== null) { 
      nodeExists.object_name = newName;
    }
  };

//delete a node by id
const deleteNode = (id) => {
      removeNodes([id]);
       const nodeId = Number(id);
    
      // Check if the node exists in objects
      const nodeInObjects = nodes.objects.find((node) => node.id === nodeId);
      if (nodeInObjects) {
        console.log(`Node with id ${id} exists in objects, deleting...`);
        console.log("Before:", nodes.objects);
        nodes.objects = nodes.objects.filter((node) => node.id !== nodeId);
        console.log("After:", nodes.objects);
        return; 
      }
    
      // Check if the node exists in functions
      const nodeInFunctions = nodes.functions.find((node) => node.id === nodeId);
      if (nodeInFunctions) {
        console.log(`Node with id ${id} exists in functions, deleting...`);
        nodes.functions = nodes.functions.filter((node) => node.id !== nodeId);

    
        return;
      }
    
      // If the node is not found in either store
      console.error(`Node with id ${id} does not exist`);

      return; 
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
    console.log("getAllNodes called");
    console.log([...nodes.objects, ...nodes.functions]);
   return [...nodes.objects, ...nodes.functions];
  };

  return {//exporting functions
    nodes,
    addNode,
    deleteNode,
    getAllNodes,
    // getItemsInRoom,
    renameNode,
    getNode,
    allNodes
  };
});
