import { defineStore } from 'pinia';
import { reactive,computed, ref, toRaw } from 'vue';
import {dataHas}  from './n-utils'
import { stringify, parse,toJSON,fromJSON } from 'flatted';
import node_colors from './node-colors.js'



export const useNodesStore = defineStore('nodes', () => {//nodes store will no longer seperate nodes by type

  const debug = 1;
  const canvasID = ref(0);
  const nodes = ref([
  ]);
  const edges = ref([]);
  const syncer = ref(0)
  const idCounter = ref(1);
  
  // Collection of all nodes. Must be synced on any node or edge change
  let globalNodes = new Map([ 
    [0,{e:[],n:[]}] // Pop in global canvas because it's technically not a node with an id
  ])


  function getGlobalNodes()
  {
    return globalNodes;
  };

  function setGlobalNodes(newNodes)
  {
    globalNodes=newNodes;
  }

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
    console.log(toRaw(globalNodes)); // Look at the raw value
    // Store current nodes and edges in canvas object
    if(important==true){
       syncer.value+=1; 
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
    node.data.srcHandles = 0 //source handles
    node.data.tgtHandles = 0 //target handles
    node.data.inputEdges = {}
    node.data.outputEdges = {}

    node.data.nodeDepth = 1;
    if(canvasID.value != 0){
      node.data.nodeDepth = getNode(canvasID.value, true).data.nodeDepth + 1
    }
    

    //adds the default names
    if (
      node.type == "room" ||
      node.type == "item" ||
      node.type == "pathway" ||
      node.type == "npc" ||
      node.type == "custom"
    ){
      incrementCount(node.type);
      console.log("🦠➕ object name shoudl be", node.type + object_count[node.type]);
      node.data.object_name = node.type + object_count[node.type];
      nodes.value.push(node);
      console.log("🦠➕ After adding:", nodes);

    }
    else if(node.type == "player"){
      node.data.object_name = "player"
      nodes.value.push(node);
      console.log("🦠➕ After adding:", nodes);
    } 
    else {  //if the node is a function
      nodes.value.push(node);
      console.log("🦠➕ function added with id", node.id);
    }
    idCounter.value++;
    globalSync(true);
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
      if(id == canvasID.value){
        swapCanvas(0)
      }
      deleteAllChildren(id);

      const nodeId = (id);
    
      const nodeExists = getNode(id,true);

      //TODO: Need to implement deleting the ID for inputEdge and outputEdge for connected edges
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
          globalNodes.set(Number(nodeExists.data.parentID), canvas)
          console.log("🦠🗑️ deleteNode: Node removed from parent.")
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
    if(!globalNodes.has(id)){
      return;
    }
    for(let key in globalNodes.get(id).n){
      console.log("👼🗑️ deleting node", key.id)
      deleteNode(Number(key.id))
    }
    return;
  }

  const getAllNodes = () => {
    console.log("🦠💯 getAllNodes()")
    return Array.from(globalNodes.values()).flatMap(canv => canv.n)    
    
  };

  const GameNode = (node, childNodes=[], childEdges=[]) => { //Simplifies the nodes for reading and altering
    const gNode = {}
        gNode.id = node.id ? Number(node.id):0
        gNode.parentID = node.data.parentID||node.data.parentID==0 ? Number(node.data.parentID):-1
        gNode.type = node.type ? node.type:"nullType"
        gNode.data = node.data ? {...node.data}:{} // important for removing proxies
        gNode.isObject = node.data.isObject ? node.data.isObject:false 
        gNode.isFunction = node.data.isFunction ? node.data.isFunction:false 
        gNode.edgesIn = node.data.inputEdges ? {...node.data.inputEdges}:{}
        gNode.edgesOut = node.data.outputEdges ? {...node.data.outputEdges}:{}
        gNode.inScope = false

        if(gNode.isObject){
          gNode.objectName = node.data.object_name
          gNode.properties = node.data.properties ? {...node.data.properties}:{}
          gNode.n = childNodes //Stores node IDs
          // no need for global edge store with compiled games
        }
        if(gNode.isFunction){
          gNode.functionName = node.data.function_name
          gNode.functionParams = [...node.data.function_params]   
        }


    console.log("🦠🎮 GameNode(",node,")")
    return gNode
  }
    
  

  const compileGame = () =>{
    globalSync(true)
    const game = {} // any additional props can also be added here
    const allNodes = new Map()
      const nodeGlobal = {
          id: 0,
          parentID: -1,
          type: "global",
          data: {object_name: "Global", isObject: true, parentID:-1,
          },
      }
      const tGN = GameNode(nodeGlobal)
      allNodes.set(0, tGN)


    for(const [ID, canvas] of globalNodes){
      console.log("🚢🎮 compiledNode: ID",ID,"canvas",canvas)
      for(const node of canvas.n){ // go through all nodes per canvas. add them to the map of all nodes
        console.log("🚢🎮 compiledNode: canvas",ID,"node",node)
        // add node to global map
        allNodes.set(node.id,GameNode(node))
        // add child node ids to parent
        const tNode2 = allNodes.get(ID)
        tNode2.n.push(Number(node.id))

        allNodes.set(Number(ID),tNode2) 
      }
      // add edges to canvas
      const tNode = allNodes.get(ID)
      allNodes.set(ID,tNode)
    }
    game.nodeMap=allNodes
    console.log("🚢🎮 GAME COMPILED",game)
    return game
  };




  const getLocalNodeIDs = () => {
    console.log("🦠🆔 getLocalNodeIDs()")
    IDS = []
    for(let i = 0; i < nodes.length; i++){
      IDS.push(nodes[i].id)
    }
    return IDS;
  }

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
    if(id==0){
      console.log("getNode on global (id=0)")
      return  null;
    }
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
      (e) => e.id === edge.id
    );
    
    if (edgeExists) {
      console.error(`📏➕Edge from ${edge.source} to ${edge.target} already exists`);
      return;
    }
    // Ensure the edge has a unique ID if not provided
    if (!edge.id) {
      edge.id = `${edge.sourceHandle}>${edge.targetHandle}`;
    }
    
    // Add any default edge properties if needed
    if (!edge.type) {
      edge.type = 'default';
    }
    // adding connection to node connections
    let srcHandleIndex = edge.id.match(/s(\d+)/);
    let tgtHandleIndex = edge.id.match(/t(\d+)/);
    tgtHandleIndex = tgtHandleIndex[1]
    srcHandleIndex = srcHandleIndex[1]


    getNode(Number(edge.source)).data.outputEdges[Number(srcHandleIndex)]=Number(edge.target)
    getNode(Number(edge.target)).data.inputEdges[Number(tgtHandleIndex)]=Number(edge.source)

    // node.data.srcHandles = 0 //source handles
    // node.data.tgtHandles
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

  const deleteEdgeByHandle = (handleID) => { //should be in the form of 1s0 or 30t12
    console.log("📏🗑️ deleteEdgeByHandle(handleID=", handleID,")")
    for(const edge of edges.value){
      if(edge.id.includes(handleID)) deleteEdge(edge.id)
    }
  }
  const deleteEdge = (id) => {
    console.log("📏🗑️ deleteEdge(id=", id,")")
    const edgeExists = edges.value.find(e => e.id === id);
    if (!edgeExists) {
      console.error(`📏🗑️Edge with id ${id} does not exist`);
      return;
    }
    const e = getEdge(id)
    let srcHandleIndex = id.match(/s(\d+)/); //get the nodes index
    let tgtHandleIndex = id.match(/t(\d+)/);
    tgtHandleIndex = tgtHandleIndex[1] // truncate the t or s from the id
    srcHandleIndex = srcHandleIndex[1]
    delete getNode(Number(e.source)).data.outputEdges[Number(srcHandleIndex)]
    delete getNode(Number(e.target)).data.inputEdges[Number(tgtHandleIndex)]

    edges.value = edges.value.filter(e => e.id !== id);
    console.log("📏🗑️ Edge deleted. Remaining edges:", edges.value);
    globalSync();
  };

  const addHandle = (id, handleType="source") =>{
    console.log("🤹➕  addHandle(id=",id,"node")
    let handleName = ""
    const nodeExists = getNode(id)
    if(nodeExists==null){
      console.warn("🤹➕  addHandle, node not found")
    }
    if(handleType=="source"){
      handleName = id+"s"+nodeExists.data.srcHandles
      nodeExists.data.srcHandles += 1;
      console.log("🤹➕  New handle ID = ",handleName)
      return handleName;
    }
    if(handleType=="target"){
      handleName = id+"t"+nodeExists.data.tgtHandles
      nodeExists.data.tgtHandles += 1;
      console.log("🤹➕  New handle ID = ",handleName)
      return handleName;
    }
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

  // Default global nodes (Player) -------------------
  console.log("id counter is:", idCounter);
  const startNode = {
    type: 'start',
    position: {
      x: 0,
      y: 0,
    },
    id:idCounter.value,    //increments id based on idcounter in node store
    data: {
      bg_color:computed(()=>node_colors[startNode.type+'_bg'] || 'red'),
      fg_color:computed(()=>node_colors[startNode.type+'_fg'] || 'blue'),
      parentID: 0,
    },
    expandParent: true,
  }
  addNode(startNode)

  const playerNode = {
    type: 'player',
    position: {
      x: -200,
      y: 0,
    },
    id:idCounter.value,    //increments id based on idcounter in node store
    data: {
      bg_color:computed(()=>node_colors[playerNode.type+'_bg'] || 'red'),
      fg_color:computed(()=>node_colors[playerNode.type+'_fg'] || 'blue'),
      parentID: 0,
    },
    expandParent: true,
  }
  addNode(playerNode)
  // ---------------------------------------------------

    console.log("🦠🫴 initNodes() done");
  };  



  return {
    //exporting functions
    nodes,
    edges,
    idCounter,
    globalNodes,
    getNode,
    getAllNodes,
    getLocalNodeIDs,
    getCurrentCanvasName,
    getGlobalNodes,
    syncer,
    globalSync,
    localSync,
    swapCanvas,
    initNodes,
    canvasID,
    addNode,
    deleteNode,
    deleteAllChildren,
    renameNode,
    contributeNodeData,
    getNodeData,
    setNodeData,
    removeNodeData,
    getNodeProperties,
    setNodeProperty,
    removeNodeProperty,
    addHandle,
    addEdge,
    updateEdge,
    deleteEdge,
    deleteEdgeByHandle,
    getEdge,
    GameNode,
    compileGame,
    setGlobalNodes
  };
});
