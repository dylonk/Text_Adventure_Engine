import { defineStore } from "pinia";
import { reactive, computed } from "vue";

<<<<<<< Updated upstream
export const useNodesStore = defineStore("nodes", () => {
  //nodes store seperates nodes by type
  const nodes = reactive({
    objects: [],
    functions: [],
  });
  const allNodes = computed(() => [...nodes.objects, ...nodes.functions]);

=======

export const useNodesStore = defineStore('nodes', () => {//nodes store will no longer seperate nodes by type
  
  const currentWorldSpaceID = ref(0) // 0 Stands for global. Any time you want to return to global set to 0
  const globalNodes = ref([]) // Stores ALL nodes
  const nodes = ref([]); // Stores nodes currently being displayed
  
>>>>>>> Stashed changes
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
  
  function syncNodesWithGlobal(){
    const globalMap = new Map(globalNodes.value.map(node => [node.id, node]));

    nodes.value.forEach(node => {
      if (globalMap.has(node.id)) {
        const globalNode = globalMap.get(node.id);
  
        // Completely replace `data` object so Vue reactivity detects changes
        globalNode.data = JSON.parse(JSON.stringify(node.data)); 
  
        // Ensure top-level properties are updated too
        Object.keys(node).forEach(key => {
          if (key !== 'id' && key !== 'data') {
            globalNode[key] = node[key];
          }
        });
  
        // Notify Vue of the change explicitly
        globalNodes.value = [...globalNodes.value];
  
      } else {
        // If the node does not exist in globalNodes, add it
        globalNodes.value.push(JSON.parse(JSON.stringify(node)));
      }
    });
    nodes.value.splice(0); //emptires nodes
    nodes.value = globalNodes.value.filter(node=>{
      if(node.hasOwnProperty('data')){ 
        if(node.data.hasOwnProperty('parent')){
          if(node.data.parent==currentWorldSpaceID.value){
            console.log("Node Added to Current NodeSpace");
            return true
          }
          else{return false}
        }
        else {return false}
      }
      else {return false}
      });
      console.log("Global Node Sync", nodes)
      console.log("Current Node Sync", nodes)
  }

  // Add a node to the store
  const addNode = (node) => {
<<<<<<< Updated upstream
    console.log("Before adding:", nodes.objects);
    const nodeExists = [...nodes.objects, ...nodes.functions].find(
      (n) => n.id === Number(node.id)
    );
=======
    console.log("Before adding:", globalNodes);
    const nodeExists = globalNodes.value.find((n) => n.id === node.id);
>>>>>>> Stashed changes
    console.log("Adding node:", {
      id: node.id,
      type: node.type,
      idType: typeof node.id,
    });
<<<<<<< Updated upstream
    if (!node.id || nodeExists) {
=======
    node.data.parent = currentWorldSpaceID.value; // Gets the node on which it is placed

    if (!node.id || nodeExists) {   //this should not happen. it's an error message
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      node.object_name = node.type + object_count[node.type];
      nodes.objects.push(node);
      console.log("After adding:", nodes.objects);
    } else {
      //if the node is a function
      nodes.functions.push(node);
=======
      console.log("object name shoudl be", node.type + object_count[node.type]);
      node.data.object_name = node.type + object_count[node.type];
      nodes.value.push(node);
      syncNodesWithGlobal();
      console.log("After adding:", nodes);

    } else {  //if the node is a function
      globalNodes.value.push(node);
      syncNodesWithGlobal();
>>>>>>> Stashed changes
      console.log("function added with id", node.id);
    }
  };

<<<<<<< Updated upstream
  const renameNode = (id) => {
    const nodeExists = [...nodes.objects].find((n) => n.id === Number(id));
=======
const renameNode = (id) => {
    const nodeExists = globalNodes.value.find((n) => n.id === id);
>>>>>>> Stashed changes
    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return;
    }
    const newName = prompt(`Enter a new name for node ${id}:`); // !!NEED TO IMPLEMENT CHECK FOR OBJECT NAME UNIQUENESS
    if (newName !== null) {
      nodeExists.object_name = newName;
    }
  };

<<<<<<< Updated upstream
  //delete a node by id
  const deleteNode = (id) => {
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
    console.log("getNode called on id", id);
    const nodeExists = [...nodes.objects, ...nodes.functions].find(
      (n) => n.id === id
    );
=======
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
    const nodeExists = nodes.value.find((n) => n.id == id);
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
    syncNodesWithGlobal()
    console.log("New data of properties:", nodeExists.data.properties)
    return;
  };
  const removeNodeProperty = (id, inputKey) => {
    console.log("setNodeProperty Called");
    const nodeExists = nodes.value.find((n) => n.id == id);
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
      const nodeInObjectsGlobal = globalNodes.value.find((node) => node.id === nodeId);
      if (nodeInObjectsGlobal) {
        console.log(`Node with id ${id} exists in objects, deleting...`);
        console.log("Before:", globalNodes);
        globalNodes.value = globalNodes.value.filter((node) => node.id !== nodeId);
        syncNodesWithGlobal();
        console.log("After:", globalNodes);
        return; 
      }
    
      // Check if the node exists in functions
      const nodeInFunctions = globalNodes.value.find((node) => node.id === nodeId);
      if (nodeInFunctions) {
        console.log(`Node with id ${id} exists in functions, deleting...`);
        globalNodes.value = globalNodes.value.filter((node) => node.id !== nodeId);
        syncNodesWithGlobal();
    
        return;
      }
    
      // If the node is not found in either store
      console.error(`Node with id ${id} does not exist`);

      return; 
    }; 
const getNode = (id) => {
  console.log("getNode called on id", id)
    const nodeExists = globalNodes.value.find((n) => n.id == id);
>>>>>>> Stashed changes
    if (!nodeExists) {
      console.error(`Node with id ${id} does not exist`);
      return;
    }
    if (
      nodeExists.type == "room" ||
      nodeExists.type == "item" ||
      nodeExists.type == "pathway" ||
      nodeExists.type == "player" ||
      nodeExists.type == "npc" ||
      nodeExists.type == "custom"
    ) {
      console.log(
        "node exists",
        nodeExists,
        "title is",
        nodeExists.object_name
      );
    } else {
      console.log("function node exists", nodeExists);
    }
    return nodeExists;
  };
  // Get all nodes for canvas
  const getAllNodes = () => {
    console.log("getAllNodes called");
    console.log([...nodes.objects, ...nodes.functions]);
    return [...nodes.objects, ...nodes.functions];
  };


const switchCanvas =(canvasID)=>{
  //First need to save current nodes to global
  if(canvasID!=0&&getNode(canvasID)==null){
    return;
  }
  console.log("All nodes currently",globalNodes)
  currentWorldSpaceID.value=canvasID
  syncNodesWithGlobal();
}

const getAllObjects=()=>{
  console.log('Calling getAllObjects')
  console.log(globalNodes);
  const allObjects = globalNodes.value.filter(node=>{
    if(node.hasOwnProperty('data')){ 
      // console.log("BING");
      if(node.data.hasOwnProperty('isObject')){
        // console.log("BING BING");
          return true
      }
      else {return false}
    }
    else {return false}
    });
  console.log('all objects: ',allObjects)
  return allObjects;
}

  return {
    //exporting functions
    nodes,
    globalNodes,
    addNode,
    deleteNode,
    getAllNodes,
    // getItemsInRoom,
    renameNode,
    getNode,
<<<<<<< Updated upstream
    allNodes,
=======
    contributeNodeData,
    setNodeProperty,
    removeNodeProperty,
    switchCanvas,
    getAllObjects,
>>>>>>> Stashed changes
  };
});
