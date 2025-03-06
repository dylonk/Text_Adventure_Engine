import { defineStore } from 'pinia';
import { reactive,computed, ref, toRaw } from 'vue';
import {dataHas}  from './n-utils'
import { stringify, parse,toJSON,fromJSON } from 'flatted';



export const useNodesStore = defineStore('nodes', () => {//nodes store will no longer seperate nodes by type

  const debug = 1;
  const canvasID = ref(0);
  const nodes = ref([
  ]);
  const edges = ref([]); // No implementation atm
  const syncer = ref(0)
  const idCounter = ref(1);

  // Collection of all nodes. Must be synced on any node or edge change
  const globalNodes = new Map([ 
    [0,{e:[],n:[]}] // Pop in global canvas because it's technically not a node with an id
  ])

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

  const globalSync = (important=false) => {
    // Store current nodes and edges in canvas object
    if(important==true){
       syncer.value+=1; 
      console.log("SYNCER ACTIVATED", syncer.value)
    }
       const canvas = {
      n: [...nodes.value],
      e: [...edges.value],
    }
    // push to map
    globalNodes.set(canvasID.value,canvas);
    console.log(`   🌎🔄 globalSync: `,globalNodes,`updated globalNodes at canvasID `,globalNodes.get(canvasID.value).n,`, nodes: `,nodes.value)
    // 
  }
  const localSync = () => { //gets nodes as they are within the global map
    console.log("   🏠🔄 localSync()")
    const canvas = globalNodes.get(canvasID.value);
    console.log("   🏠🔄 localSync current canvas node =", canvas)
    if(canvas == null || canvas.hasOwnProperty('n') == null){
      console.warn("   🏠🔄 localSync failed, null canvasID or property")
      return;
    }
    nodes.value = parse(stringify(canvas.n)); 
    edges.value = parse(stringify(canvas.e));
  }

  // Add a node to the store
  const addNode = (node) => {
    console.log("🦠➕ addNode: Before adding:", nodes);
    const nodeExists = nodes.value.find((n) => n.id === node.id);
    console.log("🦠➕ addNode: Adding node:", {
      id: node.id,
      type: node.type,
      idType: typeof node.id,
      data: node.data
    });
    

    if (!node.id || nodeExists) {   //this should not happen. it's an error message
      console.error(`🦠➕Node with id ${node.id} already exists`);
      return;
    }
    node.data.parentID = canvasID.value;
    
    node.data.nodeDepth = 1;
    if(canvasID.value != 0){
      node.data.nodeDepth = getNode(canvasID.value, true).data.nodeDepth + 1
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
      console.log("🦠➕ object name shoudl be", node.type + object_count[node.type]);
      node.data.object_name = node.type + object_count[node.type];
      nodes.value.push(node);
      console.log("🦠➕ After adding:", nodes);

    } else {  //if the node is a function
      nodes.value.push(node);
      console.log("🦠➕ function added with id", node.id);
    }
    idCounter.value++;
    globalSync();
  };

const swapCanvas = (newid) =>{
  globalSync(true);
  console.log("🖼️↔️ swapCanvas(",newid,")")

  nodes.value = [];
  edges.value = [];

  const canvas = structuredClone(parse(stringify(toRaw(globalNodes.get(newid)))));

  if (canvas != null) {
    nodes.value = parse(stringify(canvas.n)); 
    edges.value = parse(stringify(canvas.e));
  } else {
    console.warn(`🖼️↔️ swapCanvas: No node found for canvas ${newid}`);
  }

  canvasID.value = newid;
  
};

const renameNode = (id) => {
    console.log("🦠🔤 renameNode(id=",id,")")
    
    const nodeExists = getNode(id,true);

    if (!nodeExists) {
      console.error(`🦠🔤 Node with id ${id} does not exist`);
      return;
    }

    console.log("🦠🔤 this node exists at", nodeExists.position);
    const newName = prompt(`Enter a new name for node ${id}:`); // !!NEED TO IMPLEMENT CHECK FOR OBJECT NAME UNIQUENESS
    if (newName !== null) { 
      nodeExists.data.object_name = newName;
    }

    if(dataHas(nodeExists.data,"parentID") == canvasID.value ){ //if node has parent equal to current canvas
      localSync();
    }
  };

const contributeNodeData = (id, inputData) => { // For creating the data that will be with the node initially, only runs through once.

    console.log("💾🫳🏽 ContributeNodeData(id=",id,"inputData=,",inputData,")");
    if(id==-1){
      console.log("💾🫳🏽 contributeNodeData called on toolbox node")
      return;
    }
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`💾🫳🏽 ContributeNodeData: Node with id ${id} does not exist`);
      return;
    }
    // if(nodeExists.data.hasOwnProperty('initialized')){ //Node already instanciated, if you need to set, use setNodeData
    //   console.log("💾🫳🏽 contributeNodeData on node that has already been initialized, returning")
    //   return;
    // }
  
    Object.keys(inputData).forEach(function(k){
      if(!nodeExists.data.hasOwnProperty(k)) nodeExists.data[k]=inputData[k];
    })
    

    console.log("💾🫳🏽 Data to input", inputData)
    console.log("💾🫳🏽 New data of node:", nodeExists.data)
    globalSync();
    return;
  };


  const getNodeData = (id, dataProperty = "") => {  // DO NOT USE IN A WATCHER OR COMPUTE FUNCTION (spam) gets data of node safely. dataProperty to be subbed in instances where you'd do something like node.data.obj_name for safety
    console.log("💾🔙 getNodeData(id=",id,"dataProperty=",dataProperty,")")
    const nodeExists = getNode(id,true)
    if(nodeExists==null){
      console.log("💾🔙 Node does not exist")
      return null;
    }
    if(!nodeExists.hasOwnProperty("data")){
      console.log("💾🔙 Node does not have property data")
      return null;
    }
    if(dataProperty==""){
      console.log("💾🔙 Node exists, data=", nodeExists.data)
      return nodeExists.data
    }
    if(nodeExists.data.hasOwnProperty(dataProperty)){
      console.log("💾🔙 Node exists, data property ",dataProperty,"=", nodeExists.data[dataProperty])
      return nodeExists.data[dataProperty]
    }
    else{
      console.log("💾🔙 Node data property does not exist")
      return null;
    }
  }
  // ONLY FOR USE IN OBJECTS, SETS DATA.PROPERTIES
  const setNodeProperty = (id, inputKey, inputValue) => {
    console.log("⚙️🟰 setNodeProperty(id=",id,"inputKey=",inputKey,"inputValue=",inputValue);
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`setNodeProperty: Node with id ${id} does not exist`);
      return;
    }
    if(!(nodeExists.data.hasOwnProperty('properties'))){
      console.error(`setNodeProperty: Node with ${id} does not have properties`)
      return;
    }
    nodeExists.data.properties[inputKey]=inputValue
    console.log("⚙️🟰 New data of properties:", nodeExists.data.properties)
    globalSync();
    return;
  };
  const setNodeData = (id, inputKey, inputValue) => {
    console.log("💾🟰 setNodeData(id=", id, "inputKey=",inputKey, "inputValue=", inputValue,")");
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
    console.log("💾❎ removeNodeData(id=",id,"inputKey=",inputKey,")");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`💾❎ removeNodeData: Node with id ${id} does not exist`);
      return;
    }
    console.log("💾❎ Key to remove", inputKey)
    delete nodeExists.data[inputKey]
    console.log("💾❎ New data of node:", nodeExists.data)
    globalSync();
    return;
  };
  const removeNodeProperty = (id, inputKey) => {
    console.log("⚙️❎ removeNodeProperty(",id,",",inputKey,")");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`⚙️❎removeNodeProperty: Node with id ${id} does not exist`);
      return;
    }
    if(!(nodeExists.data.hasOwnProperty('properties'))){
      console.error(`⚙️❎ removeNodeProperty: Node with ${id} does not have properties`)
      return;
    }
    console.log("⚙️❎ Key to remove", inputKey)
    delete nodeExists.data.properties[inputKey]
    console.log("⚙️❎ New data of properties:", nodeExists.data.properties)
    globalSync();
    return;
  };
//delete a node by id
  const deleteNode = (id) => {
      //removeNodes([id]);
      
      console.log("🦠🗑️ deleteNode(id=",id,")")
      deleteAllChildren(id);
      const nodeId = (id);
    
      if(id == canvasID.value){
        swapCanvas(0)
      }
      const nodeExists = getNode(id,true);
      if (nodeExists) {
        console.log(`Node with id ${id} exists in objects, deleting...`);
        console.log("Before:", nodes);
        //delete the key, and delete the index within the parents key
        globalNodes.delete(id)
        if(nodeExists.data.parentID != canvasID.value){ 
          const parentNodes = globalNodes.get(nodeExists.data.parentID).n.filter((node) => node.id != nodeId)
          const parentEdges = globalNodes.get(nodeExists.data.parentID).e
          const canvas = {
            n: parentNodes,
            e: parentEdges,
          }
          globalNodes.set(nodeExists.data.parentID, canvas)
          console.log("deleteNode: Node removed from parent. Parent: ", globalNodes[nodeExists.data.parentID].n)
        }
        else{
          nodes.value = nodes.value.filter((node) => node.id != nodeId); //may not always delete a node          
        }
        console.log("After:", nodes);
        globalSync(true);
        return; 
      }
      console.error(`deleteNode: Node with id ${id} does not exist`);
      return; 
  }; 
  const deleteAllChildren = (id) => { // recursive function to delete children nodes of node
    console.log("👼🗑️ deleteAllChildren(id=",id,")")
    console.log("👼🗑️ globalNodes.get(",id,")",globalNodes.get(id))
    
  };

  const getAllNodes = () => {
    console.log("🦠💯 getAllNodes()")
    return Array.from(globalNodes.values()).flatMap(canv => canv.n)
  };
  const getNode = (id, doGlobal=false) => {
    console.log("   🦠🫴 getNode(id=", id, "doGlobal=", doGlobal,")")
    if(id<-1){
      console.error(`   🦠🫴 getNode called with invalid id, id is ${id}`)
      return null;
    }
    if(id==-1){
      console.log("   🦠🫴 getNode called on toolbox node")
      return  null;
    }
    // if(id==0){
    //   console.log("getNode on global (id=0)")
    //   return  null;
    // }
      let nodeExists = nodes.value.find((n) => n.id == id);
      if(doGlobal == true){
        globalSync();
        const allNodes = getAllNodes()
        console.log("   🦠🫴 getNode(global): globalNodesArray",allNodes)
        nodeExists = allNodes.find((n) => n.id == id)
        console.log("   🦠🫴 getNode(global): node to return",nodeExists)
        if (nodeExists == null) {
          console.warn(`   🦠🫴 getNode(global) Node with id ${id} does not exist`);
          return null;
        }
        return nodeExists;
      }

      if (!nodeExists) {
        console.warn(`   🦠🫴 getNode(local) Node with id ${id} does not exist`);
        return null;
      }
    if (nodeExists.type == 'room' || nodeExists.type == 'item' || nodeExists.type == 'pathway' || nodeExists.type == 'player' || nodeExists.type == 'npc' || nodeExists.type == 'custom'){
      console.log("   🦠🫴 getNode(local) node exists", nodeExists, "title is", nodeExists.data.object_name);
    }
    else {
      console.log("   🦠🫴 getNode(local) function node exists", nodeExists);
    }
      //globalSync(); // might be necessary? SHAKY
      return nodeExists
  };
  const addEdge = (edge) => {
    console.log("📏➕ Adding edge:", edge);
    // Check if the edge already exists
    const edgeExists = edges.value.find(
      (e) => e.id === edge.id || (e.source === edge.source && e.target === edge.target)
    );
    
    if (edgeExists) {
      console.error(`📏➕Edge from ${edge.source} to ${edge.target} already exists`);
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
    console.log("📏➕ After adding edge:", edges.value);
    globalSync();
  };

  const getCurrentCanvasName = () => {
    console.log("🖼️🔤 getCurrentCanvasName()")
    if(canvasID.value == 0){
      return "Global"
    }
    else if(canvasID.value < 0){
      return "BadNode"
    }
    else{
      const nodeTitle = getNode(canvasID.value, true)
      console.log("🖼️🔤 getCurrentCanvasName nodeTitle=",nodeTitle)
      if(nodeTitle == null){
        console.log("🖼️🔤 getCurrentCanvas = NodeNotFound")
        return "NodeNotFound"
      }
      else{
        if(nodeTitle.hasOwnProperty("data") && nodeTitle.data.hasOwnProperty("object_name")) {
          return nodeTitle.data.object_name;
        }
        else{
          return "NodeHasNoName"
        }
      }
    }
  };
  const getNodeProperties = (id, doGlobal=false) => { // DO NOT USE IN A WATCHER OR COMPUTE FUNCTION (spam), returns an array
    console.log("⚙️⬅️ getNodeProperties(id=", id, ",doGlobal=", doGlobal,")")
    const nodeExists = getNode(id,true,true);
    // && nodeExists.hasProperty(data) && nodeExists.data.hasOwnProperty(properties)
    if(nodeExists != null){
      if(nodeExists.data.properties==null){
        return [];
      }
      console.log("⚙️⬅️ Successful getNodeProperties! Properties:", nodeExists.data.properties)
      return nodeExists.data.properties;
    }
    else{
      return [];
    }
  };
  const getEdge = (id) => {
    console.log("📏⬅️ getEdge(id=", id,")")
    return edges.value.find(e => e.id === id);
  };
  const updateEdge = (id, newData) => {
    console.log("📏🆙 updateEdge(id=", id, ",newData=", newData,")")
    const edgeIndex = edges.value.findIndex(e => e.id === id);
    if (edgeIndex === -1) {
      console.error(`Edge with id ${id} does not exist`);
      return;
    }
    
    edges.value[edgeIndex] = { ...edges.value[edgeIndex], ...newData };
    console.log("📏🆙Edge updated:", edges.value[edgeIndex]);
    globalSync();
  };

  const deleteEdge = (id) => {
    console.log("📏🗑️ deleteEdge(id=", id,")")
    const edgeExists = edges.value.find(e => e.id === id);
    if (!edgeExists) {
      console.error(`📏🗑️Edge with id ${id} does not exist`);
      return;
    }
    
    edges.value = edges.value.filter(e => e.id !== id);
    console.log("📏🗑️ Edge deleted. Remaining edges:", edges.value);
    globalSync();
  };

  const initNodes = () => {   //the node portion of initting a new project. currently empties nodes/edges, resets object counts and idcounter
    console.log("🦠🫴 initNodes()");
    nodes.value = [];
    edges.value = [];
    object_count.total = 0;
    object_count.room = 0;
    object_count.item = 0;
    object_count.npc = 0;
    object_count.pathway = 0;
    object_count.custom = 0;
    globalSync();
    idCounter.value = 1;
    canvasID.value = 0;
    console.log("🦠🫴 initNodes() done");
  };  



  return {
    //exporting functions
    nodes,
    edges,
    idCounter,
    getNode,
    getAllNodes,
    getCurrentCanvasName,
    syncer,
    globalSync,
    localSync,
    swapCanvas,
    initNodes,
    canvasID,
    addNode,
    deleteNode,
    renameNode,
    contributeNodeData,
    getNodeData,
    setNodeData,
    removeNodeData,
    getNodeProperties,
    setNodeProperty,
    removeNodeProperty,
    addEdge,
    updateEdge,
    deleteEdge,
    getEdge,
  };
});
