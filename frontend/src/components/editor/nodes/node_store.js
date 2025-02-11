import { defineStore } from 'pinia';
import { reactive,computed, ref } from 'vue';



export const useNodesStore = defineStore('nodes', () => {//nodes store will no longer seperate nodes by type
  const nodes = ref([
  ]);
  const edges = ref([]) // No implementation atm

  const object_count = reactive({
    //For making unique object names
    total: 0, //just using total for now reallym but if you want to make unique ones go ahead im lazy
    room: 0,
    item: 0,
    npc: 0,
    pathway: 0,
    custom: 0,
  });
  function incrementCount(key) {
    if (key in object_count) {
      object_count[key]++;
    } else {
      console.error(`Key "${key}" does not exist in object_count.`);
    }
  }

  // Add a node to the store
  const addNode = (node) => {
    console.log("Before adding:", nodes);
    const nodeExists = nodes.value.find((n) => n.id === node.id);
    console.log("Adding node:", {
      id: node.id,
      type: node.type,
      idType: typeof node.id,
      data: node.data
    });

    if (!node.id || nodeExists) {   //this should not happen. it's an error message
      console.error(`Node with id ${node.id} already exists`);
      return;
    }

    //adds the default names
    if (
      node.type == "room" ||
      node.type == "item" ||
      node.type == "pathway" ||
      node.type == "player" ||
      node.type == "npc" ||
      node.type == "custom"
    ) {
      incrementCount(node.type);
      console.log("object name shoudl be", node.type + object_count[node.type]);
      node.data.object_name = node.type + object_count[node.type];
      nodes.value.push(node);
      console.log("After adding:", nodes);

    } else {  //if the node is a function
      nodes.value.push(node);
      console.log("function added with id", node.id);
    }
  };

const renameNode = (id) => {
    const nodeExists = nodes.value.find((n) => n.id === id);
    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return;
    }

    console.log("this node exists at", nodeExists.position);
    const newName = prompt(`Enter a new name for node ${id}:`); // !!NEED TO IMPLEMENT CHECK FOR OBJECT NAME UNIQUENESS
    if (newName !== null) { 
      nodeExists.data.object_name = newName;
    }
  };

  const contributeNodeData = (id, inputData, OverwriteExistingData=true) => {
    console.log("ContributeNodeData Called");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`ContributeNodeData: Node with id ${id} does not exist`);
      return;
    }
    console.log("ContributeNodeData: node exists");
    if(OverwriteExistingData==true){
    Object.assign(nodeExists.data, inputData)
    }
    if(OverwriteExistingData==false){
      nodeExists.data=Object.assign(inputData,nodeExists.data )
    }
    console.log("Data to input", inputData)
    console.log("New data of node:", nodeExists.data)
    return;
  };
  // ONLY FOR USE IN OBJECTS, SETS DATA.PROPERTIES
  const setNodeProperty = (id, inputKey, inputValue) => {
    console.log("setNodeProperty Called");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`setNodeProperty: Node with id ${id} does not exist`);
      return;
    }
    if(!(nodeExists.data.hasOwnProperty('properties'))){
      console.error(`setNodeProperty: Node with ${id} does not have properties`)
      return;
    }
    console.log("Key/Value to input", inputKey,inputValue)
    nodeExists.data.properties[inputKey]=inputValue
    console.log("New data of properties:", nodeExists.data.properties)
    return;
  };
  const removeNodeProperty = (id, inputKey) => {
    console.log("setNodeProperty Called");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`removeNodeProperty: Node with id ${id} does not exist`);
      return;
    }
    if(!(nodeExists.data.hasOwnProperty('properties'))){
      console.error(`removeNodeProperty: Node with ${id} does not have properties`)
      return;
    }
    console.log("Key to remove", inputKey)
    delete nodeExists.data.properties[inputKey]
    console.log("New data of properties:", nodeExists.data.properties)
    return;
  };
//delete a node by id
const deleteNode = (id) => {
      //removeNodes([id]);
       const nodeId = (id);
    
      // Check if the node exists
      const nodeInObjects = nodes.value.find((node) => node.id === nodeId);
      if (nodeInObjects) {
        console.log(`Node with id ${id} exists in objects, deleting...`);
        console.log("Before:", nodes);
        nodes.value = nodes.value.filter((node) => node.id !== nodeId);
        console.log("After:", nodes);
        return; 
      }
    
      // Check if the node exists in functions
      const nodeInFunctions = nodes.value.find((node) => node.id === nodeId);
      if (nodeInFunctions) {
        console.log(`Node with id ${id} exists in functions, deleting...`);
        nodes.value = nodes.value.filter((node) => node.id !== nodeId);

    
        return;
      }
    
      // If the node is not found in either store
      console.error(`Node with id ${id} does not exist`);

      return; 
    }; 
const getNode = (id) => {
  console.log("getNode called on id", id)
    const nodeExists = nodes.value.find((n) => n.id === id);
    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return;
    }
  if (nodeExists.type == 'room' || nodeExists.type == 'item' || nodeExists.type == 'pathway' || nodeExists.type == 'player' || nodeExists.type == 'npc' || nodeExists.type == 'custom'){
    console.log("node exists", nodeExists, "title is", nodeExists.data.object_name);
  }
  else {
    console.log("function node exists", nodeExists);
  }
    return nodeExists
}

  return {
    //exporting functions
    nodes,
    addNode,
    deleteNode,
    renameNode,
    getNode,
    contributeNodeData,
    setNodeProperty,
    removeNodeProperty,
  };
});
