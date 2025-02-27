import { defineStore } from 'pinia';
import { reactive,computed, ref } from 'vue';



export const useNodesStore = defineStore('nodes', () => {//nodes store will no longer seperate nodes by type


  const canvasID = ref(0);
  const nodes = ref([
  ]);
  const edges = ref([]); // No implementation atm

  // Collection of all nodes. Must be synced on any node or edge change
  const globalNodes = ref(new Map([ 
    [0,{e:[],n:[]}] // Pop in global canvas because it's technically not a node with an id
  ]))

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

  const globalSync = () => {
    // Store current nodes and edges in canvas object
    const canvas = {
      n: nodes.value,
      e: edges.value,
    }
    // push to map
    globalNodes.value.set(canvasID.value,canvas);
    console.log(`globalSync: `,globalNodes,`updated globalNodes at canvasID `,globalNodes.value.get(canvasID.value).n,`, nodes: `,nodes.value)
    // 
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
    node.data.parentID = canvasID.value;
    
    // node.data.nodeDepth = 1;
    // if(canvasID.value != 0){
    //   node.data.nodeDepth = getNode(canvasID.value).data.nodeDepth + 1
    // }
    

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
    globalSync();
  };

const swapCanvas = (newid) =>{
  globalSync();

  // Clear existing nodes and edges
  nodes.value = [];
  edges.value = [];

  // Retrieve stored data safely
  const canvas = globalNodes.value.get(newid);
  if (canvas) {
    nodes.value = structuredClone(canvas.n); 
    edges.value = structuredClone(canvas.e);
  } else {
    console.warn(`swapCanvas: No nodes found for canvas ${newid}`);
  }

  // Update canvas ID
  canvasID.value = newid;
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
    globalSync();
  };

  const contributeNodeData = (id, inputData, OverwriteExistingData=true) => {
    if(id==-1){
      console.log("contributeNodeData called on toolbox node")
      return;
    }
    console.log("ContributeNodeData Called");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`ContributeNodeData: Node with id ${id} does not exist`);
      return;
    }
    console.log("ContributeNodeData: node exists");
    // if(nodeExists.data.hasOwnProperty('initialized')){
    //   return;
    // }
    if(OverwriteExistingData==true){
    Object.assign(nodeExists.data, inputData)
    }
    if(OverwriteExistingData==false){
      nodeExists.data=Object.assign(inputData,nodeExists.data )
    }
    if(nodeExists.data.hasOwnProperty('initialized'))
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
  const setNodeData = (id, inputKey, inputValue) => {
    console.log("setNodeData Called");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`setNodeData: Node with id ${id} does not exist`);
      return;
    }
    console.log("Key/Value to input", inputKey,inputValue)
    nodeExists.data[inputKey]=inputValue
    console.log("New data of node:", nodeExists.data)
    globalSync();
    return;
  };
  const removeNodeData = (id, inputKey) => {
    console.log("removeNodeData Called");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`removeNodeData: Node with id ${id} does not exist`);
      return;
    }
    console.log("Key to remove", inputKey)
    delete nodeExists.data[inputKey]
    console.log("New data of node:", nodeExists.data)
    globalSync();
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
    globalSync();
    return;
  };
//delete a node by id
const deleteNode = (id) => {
      //removeNodes([id]);
      const nodeId = (id);
    
      // Check if the node exists
      
      const nodeExists = getNode(id,true);
      if (nodeExists) {
        console.log(`Node with id ${id} exists in objects, deleting...`);
        console.log("Before:", nodes);
        //delete the key, and delete the index within the parents key
        globalNodes.value.delete(id)
        if(nodeExists.data.parentID != canvasID.value){ 
          const parentNodes = globalNodes.value.get(nodeExists.data.parentID).n.filter((node) => node.id != nodeId)
          const parentEdges = globalNodes.value.get(nodeExists.data.parentID).e
          const canvas = {
            n: parentNodes,
            e: parentEdges,
          }
          globalNodes.value.set(nodeExists.data.parentID, canvas)
          console.log("deleteNode: Node removed from parent. Parent: ", globalNodes.value[nodeExists.data.parentID].n)
        }
        else{
          nodes.value = nodes.value.filter((node) => node.id != nodeId); //may not always delete a node          
        }
        console.log("After:", nodes);
        globalSync();
        return; 
      }
      console.error(`deleteNode: Node with id ${id} does not exist`);
      return; 
    }; 

const getAllNodes = () => {
  return Array.from(globalNodes.value.values()).flatMap(canv => canv.n)
}
const getNode = (id, doGlobal=false) => {
  if(id<-1){
    console.error(`getNode called with invalid id, id is ${id}`)
    return false;
  }
  if(id==-1){
    console.log("getNode called on toolbox node")
    return;
  }
    console.log("getNode called on id", id, ". doGlobal=", doGlobal)
    const nodeExists = nodes.value.find((n) => n.id == id);
    if(doGlobal){
      globalSync();
      const globalNodesArray = getAllNodes()
      console.log("removeNode(global): globalNodesArray",globalNodesArray)
      const nodeExistsGlobal = globalNodesArray.find((n) => n.id == id)
      console.log("removeNode(global): node to remove",nodeExistsGlobal)
      if (!nodeExistsGlobal) {
        console.error(`Node with id ${id} does not exist`);
        return false;
      }
      return nodeExistsGlobal;
    }

    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return false;
    }
  if (nodeExists.type == 'room' || nodeExists.type == 'item' || nodeExists.type == 'pathway' || nodeExists.type == 'player' || nodeExists.type == 'npc' || nodeExists.type == 'custom'){
    console.log("node exists", nodeExists, "title is", nodeExists.data.object_name);
  }
  else {
    console.log("function node exists", nodeExists);
  }
    //globalSync(); // might be necessary? SHAKY
    return nodeExists
}
  // NEW: Add an edge to the store
  const addEdge = (edge) => {
    console.log("Adding edge:", edge);
    // Check if the edge already exists
    const edgeExists = edges.value.find(
      (e) => e.id === edge.id || (e.source === edge.source && e.target === edge.target)
    );
    
    if (edgeExists) {
      console.error(`Edge from ${edge.source} to ${edge.target} already exists`);
      return;
    }
    
    // Ensure the edge has a unique ID if not provided
    if (!edge.id) {
      edge.id = `e-${edge.source}-${edge.target}`;
    }
    
    // Add any default edge properties if needed
    if (!edge.type) {
      edge.type = 'default';
    }
    
    // Add the edge
    edges.value.push(edge);
    console.log("After adding edge:", edges.value);
    globalSync();
  };

  // NEW: Update an edge
  const updateEdge = (id, newData) => {
    const edgeIndex = edges.value.findIndex(e => e.id === id);
    if (edgeIndex === -1) {
      console.error(`Edge with id ${id} does not exist`);
      return;
    }
    
    edges.value[edgeIndex] = { ...edges.value[edgeIndex], ...newData };
    console.log("Edge updated:", edges.value[edgeIndex]);
    globalSync();
  };

  // NEW: Delete an edge
  const deleteEdge = (id) => {
    const edgeExists = edges.value.find(e => e.id === id);
    if (!edgeExists) {
      console.error(`Edge with id ${id} does not exist`);
      return;
    }
    
    edges.value = edges.value.filter(e => e.id !== id);
    console.log("Edge deleted. Remaining edges:", edges.value);
    globalSync();
  };

  // NEW: Get an edge
  const getEdge = (id) => {
    return edges.value.find(e => e.id === id);
  };


  return {
    //exporting functions
    getAllNodes,
    nodes,
    edges,
    globalSync,
    swapCanvas,
    canvasID,
    addNode,
    deleteNode,
    renameNode,
    getNode,
    contributeNodeData,
    setNodeData,
    removeNodeData,
    setNodeProperty,
    removeNodeProperty,
    addEdge,
    updateEdge,
    deleteEdge,
    getEdge
  };
});
