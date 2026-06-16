import { defineStore } from 'pinia';
import { reactive,computed, ref, toRaw } from 'vue';
import {dataHas}  from './n-utils'
import { stringify, parse,toJSON,fromJSON } from 'flatted';
import node_colors from './node-colors.js'
import cloneDeep from 'lodash/cloneDeep'
import { inventoryMessageNode } from './n-imports';
import { add, forEach } from 'lodash';



export const useNodesStore = defineStore('nodes', () => {//nodes store will no longer seperate nodes by type

  const debug = 0;
  const canvasID = ref(0);
  const nodes = ref([
  ]);
  const edges = ref([]);
  const syncer = ref(0)
  const idCounter = ref(1);
  const projectImages = ref({}) // list of all the image links. key is image name, value is the link. Used for downloading images UNIMPLEMENTED
  const allowUserInput = ref(true)

  //clipboardNode is the node that is currently in the clipboard to be pasted
  let clipboardNode=  ref(null);

  
  // Collection of all nodes. Must be synced on any node or edge change
  let globalNodes = new Map([ 
    [0,{e:[],n:[]}] // Pop in global canvas because it's technically not a node with an id
  ])



  function getGlobalNodes()
  {
    return globalNodes;
  };

  const setGlobalNodes = (newNodes) => {
    // Normalize all keys to numbers on load
    const normalized = new Map();
    for (const [key, value] of newNodes.entries()) {
      normalized.set(Number(key), value);
    }
    globalNodes = normalized;
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
    // 
  }
  const localSync = () => { //gets nodes as they are within the global map

    if(debug >= 1)console.log("[EDITOR]   🏠🔄 localSync()")
    const canvas = globalNodes.get(canvasID.value);
    if(debug >= 1)console.log("[EDITOR]   🏠🔄 localSync current canvas node =", canvas)
    if(canvas == null || canvas.hasOwnProperty('n') == null){
      console.warn("   🏠🔄 localSync failed, null canvasID or property")
      return;
    }
    nodes.value = parse(stringify(canvas.n)); 
    edges.value = parse(stringify(canvas.e));
  }

  // Add a node to the store. manually set parent id when you want the node placed somewhere other than the current canvas
  const addNode = (node,parentID=null) => {
    if(debug >= 1)console.log("[EDITOR]🦠➕ addNode: Before adding:", globalNodes);
    const nodeExists = nodes.value.find((n) => n.id === node.id);
    if(debug >= 1)console.log("[EDITOR]🦠➕ addNode: Adding node:", {
      id: node.id,
      type: node.type,
      idType: typeof node.id,
      data: node.data
    });
    

    if (!node.id || nodeExists) {   //this should not happen. it's an error message
      console.error(`🦠➕Node with id ${node.id} already exists`);
      return;
    }
    node.data.tbStyle= true,
    node.data.srcHandles = 0 //source handles
    node.data.tgtHandles = 0 //target handles
    node.data.inputEdges = {}
    node.data.outputEdges = {}
    if(parentID!=null && parentID != canvasID.value ){ // if the node is being added automatically and it doesn't go on the current canvas, init parentid and depth properly
      node.data.nodeDepth = getNode(parentID, true).data.nodeDepth + 1;
      node.data.parentID = parentID;
      if(debug>=1) console.log("[EDITOR]🦠➕ parentID  should be", node.data.parentID, "node depth should be", node.data.nodeDepth);
          //adds the default names
    if (
      node.type == "room" ||
      node.type == "item" ||
      node.type == "pathway" ||
      node.type == "npc" ||
      node.type == "custom"
    ){
      incrementCount(node.type);
      if(debug >= 1)console.log("[EDITOR]🦠➕ object name should be", node.type + object_count[node.type]);
      node.data.object_name = node.type + object_count[node.type];
      node.data.isObject = true;
      if(debug >= 1)console.log("[EDITOR]🦠➕ After adding:", nodes);
    }
    else if(node.type == "player"){
      node.data.object_name = "player"
      nodes.value.push(node);
      if(debug >= 1)console.log("[EDITOR]🦠➕ After adding:", nodes);
    } 
    else {  // function node going into non-active canvas
      const targetCanvas = globalNodes.get(parentID);
      if (targetCanvas) {
        targetCanvas.n.push(node);
        globalNodes.set(parentID, targetCanvas);  // may be redundant since it's a ref, but explicit
      } else {
        // canvas doesn't exist yet for this parent, initialize it
        globalNodes.set(parentID, { n: [node], e: [] });
      }
      idCounter.value++;
      globalSync();
      if(debug >= 1)console.log("globalNodes after inventoryMessage add:", 
  [...globalNodes.entries()].map(([k,v]) => ({id:k, nodes:v.n.map(n=>n.id)}))
)
    }
    idCounter.value++;
    //if the node is an item, we're going to also add a default inventory message node.

      
    }
    else{ //otherwise do the defaults
      node.data.parentID = canvasID.value;
      node.data.nodeDepth = 1;
      if(canvasID.value != 0){  //if it's not in global, calculate depth
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
      if(debug >= 1)console.log("[EDITOR]🦠➕ object name should be", node.type + object_count[node.type]);
      node.data.object_name = node.type + object_count[node.type];
      node.data.isObject = true;
      nodes.value.push(node);
      if(debug >= 1)console.log("[EDITOR]🦠➕ After adding:", nodes);
    }
    else if(node.type == "player"){
      node.data.object_name = "player"
      nodes.value.push(node);
      if(debug >= 1)console.log("[EDITOR]🦠➕ After adding:", nodes);
    } 
    else {  //if the node is a function
      nodes.value.push(node);
      if(debug >= 1)console.log("[EDITOR]🦠➕ function added with id", node.id);
    }
    idCounter.value++;
    //if the node is an item, we're going to also add a default inventory message node.
  }
    
    if(node.type == "item"){
      if(debug>=1) console.log("[EDITOR]🦠➕ Adding default inventory message");
          const inventoryMessageNode = {
            type: "inventoryMessage",
            position: {x:0,y:0},
            id:idCounter.value,    //increments id based on idcounter in node store
            data: {
              bg_color: node_colors['inventoryMessage_bg'] || 'red',  // ← resolve immediately
              fg_color: node_colors['inventoryMessage_fg'] || 'blue', // ← resolve immediately
              nodeDepth: getNode(node.id, true).data.nodeDepth + 1
            },
            expandParent: true,
            parentID: node.id,//the parent is the node initially placed
          }
      //inventoryMessageNode.data.function_params[0]=  "You have a " + node.data.object_name;  //default inventory message
      addNode(inventoryMessageNode,node.id);
    };
      
  };


const swapCanvas = (newid) => {
  globalSync(true);
  newid = Number(newid);

  const canvas = globalNodes.get(newid);
  nodes.value = [];
  edges.value = [];

  if (canvas != null) {
    nodes.value = parse(stringify(canvas.n));
    edges.value = parse(stringify(canvas.e));
  } else {
    console.warn(`🖼️↔️ swapCanvas: No node found for canvas ${newid}`);
  }

  canvasID.value = newid;
  localSync();
}

const renameNode = (id) => {
    if(debug >= 1)console.log("[EDITOR]🦠🔤 renameNode(id=",id,")")
    
    const nodeExists = getNode(id,true);

    if (!nodeExists) {
      console.error(`🦠🔤 Node with id ${id} does not exist`);
      return;
    }

    if(debug >= 1)console.log("[EDITOR]🦠🔤 this node exists at", nodeExists.position);
    
    // Store the old name before changing it
    const oldName = nodeExists.data.object_name;
    console.log("[DEBUG] Old name:", oldName);
    
    const newName = prompt(`Enter a new name for node ${id}:`);
    if(debug >= 1)console.log("[DEBUG] New name:", newName);
    
    if (newName !== null && newName !== oldName) { 
      nodeExists.data.object_name = newName;
      
      // Update all Set Property nodes that reference this renamed node
      const allNodes = getAllNodes(false, "node");
      if(debug >= 1)console.log("[DEBUG] Total nodes to check:", allNodes.length);
      
      allNodes.forEach(node => {
        if(debug >= 1)console.log("[DEBUG] Checking node:", node.id, "function_name:", node.data?.function_name);
        if(debug >= 1)console.log("[DEBUG] Function params:", node.data?.function_params);
        
        // Check if this is a Set Property node
        if (node.data?.function_name === 'setproperty' && 
            node.data?.function_params) {
          
          console.log("[DEBUG] Found dropdown node:", node.id);
          
          // Find the Target_dropdown parameter
          const targetParam = node.data.function_params.find(
            param => param.name === 'Target_dropdown'
          );
          
          console.log("[DEBUG] Target param:", targetParam);
          
          // If the Target_dropdown contains the old name, update it
          if (targetParam && 
              targetParam.vals && 
              targetParam.vals.length > 0) {
            console.log("[DEBUG] Current target value:", targetParam.vals[0]);
            if (targetParam.vals[0] === oldName) {
              targetParam.vals[0] = newName;
              console.log(`[EDITOR]🦠🔤 Updated Set Property node ${node.id} target from "${oldName}" to "${newName}"`);
            }
          }
        }
      });
      
      globalSync(true);
    }

    if(dataHas(nodeExists.data,"parentID") == canvasID.value ){ 
      localSync();
    }
  };

  const getProjectImageNames = () => {
    const imageNames = Object.keys(projectImages.value)
    console.log("[EDITOR] retrieved project images", imageNames)
    return imageNames
  }

  const pushProjectImage = (imageName, imageLink) => {
    projectImages.value[imageName]=imageLink
    console.log("[EDITOR] Project Images are now:", projectImages.value)
  }

  const getProjectImageLink = (imageName) => {
    
    console.log("[EDITOR] Image for node is ",projectImages.value[imageName])
    return projectImages.value[imageName]
  }


const contributeNodeData = (id, inputData) => { // For creating the data that will be with the node initially, only runs through once.

    if(debug >= 1)console.log("[EDITOR]💾🫳🏽 ContributeNodeData(id=",id,"inputData=,",inputData,")");
    if(id==-1){
      if(debug >= 1)console.log("[EDITOR]💾🫳🏽 contributeNodeData called on toolbox node")
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
    
    if(debug >= 1)console.log("[EDITOR]💾🫳🏽 Data to input", inputData)
    if(debug >= 1)console.log("[EDITOR]💾🫳🏽 New data of node:", nodeExists.data)
    globalSync();
    return;
  };

const contributeFunctionParameters = (id,paramName, paramArray) => { 
  if(debug >= 1)console.log("[EDITOR]🔧🫳🏽 contributeFunctionParameters(",id,paramName,paramArray,")")
  let param = {name: paramName,vals: paramArray} // paramArray MUST ALWAYS BE AN ARRAY
  const nodeExists = getNode(id)
  if(!nodeExists){
    return;
  }
  if(nodeExists.data.hasOwnProperty("function_params")){
    for(const parameter of nodeExists.data.function_params){
      if(param.name == parameter.name){
        if(debug >= 1)console.log("[EDITOR] Parameter exists, ignoring")
        return;
      }
    }
    if(debug >= 1)console.log("[EDITOR] Pushing param:", param)
    nodeExists.data.function_params.push(param)
    if(debug >= 1)console.log("[EDITOR] Node parameters after:", nodeExists.data.function_params)
    globalSync();
    return;
  }
}

const getParam=(id,paramName)=>{
  if(debug >= 1)console.log("[EDITOR]🔧🔙 getParam(",id,paramName,")")

  const nodeExists = getNode(id)
  if(!nodeExists || !nodeExists.data.hasOwnProperty("function_params")){
    return null;
  }
  for(const parameter of nodeExists.data.function_params){
    if(paramName == parameter.name){
      if(debug >= 1)console.log("[EDITOR] Parameter exists:", parameter)
      return parameter.vals;
    }
  }
}

  const getNodeData = (id, dataProperty = "") => {  // DO NOT USE IN A WATCHER OR COMPUTE FUNCTION (spam) gets data of node safely. dataProperty to be subbed in instances where you'd do something like node.data.obj_name for safety
    if(debug >= 1)console.log("[EDITOR]💾🔙 getNodeData(id=",id,"dataProperty=",dataProperty,")")
    const nodeExists = getNode(id,true)
    if(nodeExists==null){
      if(debug >= 1)console.log("[EDITOR]💾🔙 Node does not exist")
      return null;
    }
    if(!nodeExists.hasOwnProperty("data")){
      if(debug >= 1)console.log("[EDITOR]💾🔙 Node does not have property data")
      return null;
    }
    if(dataProperty==""){
      if(debug >= 1)console.log("[EDITOR]💾🔙 Node exists, data=", nodeExists.data)
      return nodeExists.data
    }
    if(nodeExists.data.hasOwnProperty(dataProperty)){
      if(debug >= 1)console.log("[EDITOR]💾🔙 Node exists, data property ",dataProperty,"=", nodeExists.data[dataProperty])
      return nodeExists.data[dataProperty]
    }
    else{
      if(debug >= 1)console.log("[EDITOR]💾🔙 Node data property does not exist")
      return null;
    }
  }
  // ONLY FOR USE IN OBJECTS, SETS DATA.PROPERTIES
  const setNodeProperty = (id, inputKey, inputValue) => {
    if(debug >= 1)console.log("[EDITOR]⚙️🟰 setNodeProperty(id=",id,"inputKey=",inputKey,"inputValue=",inputValue);
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
    if(debug >= 1)console.log("[EDITOR]⚙️🟰 New data of properties:", nodeExists.data.properties)
    globalSync();
    return;
  };
  const setNodeData = (id, inputKey, inputValue) => {
    if(debug >= 1)console.log("[EDITOR]💾🟰 setNodeData(id=", id, "inputKey=",inputKey, "inputValue=", inputValue,")");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`setNodeData: Node with id ${id} does not exist`);
      return;
    }
    //console.log("[EDITOR]Key/Value to input", inputKey,inputValue)
    nodeExists.data[inputKey]=inputValue
    //console.log("[EDITOR]New data of node:", nodeExists.data)
    globalSync();
    return;
  };
  const removeNodeData = (id, inputKey) => {
    console.log("[EDITOR]💾❎ removeNodeData(id=",id,"inputKey=",inputKey,")");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`💾❎ removeNodeData: Node with id ${id} does not exist`);
      return;
    }
    console.log("[EDITOR]💾❎ Key to remove", inputKey)
    delete nodeExists.data[inputKey]
    console.log("[EDITOR]💾❎ New data of node:", nodeExists.data)
    globalSync();
    return;
  };
  const removeNodeProperty = (id, inputKey) => {
    console.log("[EDITOR]⚙️❎ removeNodeProperty(",id,",",inputKey,")");
    const nodeExists = getNode(id);
    if (!nodeExists) {
      console.error(`⚙️❎removeNodeProperty: Node with id ${id} does not exist`);
      return;
    }
    if(!(nodeExists.data.hasOwnProperty('properties'))){
      console.error(`⚙️❎ removeNodeProperty: Node with ${id} does not have properties`)
      return;
    }
    console.log("[EDITOR]⚙️❎ Key to remove", inputKey)
    delete nodeExists.data.properties[inputKey]
    console.log("[EDITOR]⚙️❎ New data of properties:", nodeExists.data.properties)
    globalSync();
    return;
  };
//delete a node by id
  const deleteNode = (id) => {
      //removeNodes([id]);
      
      console.log("[EDITOR]🦠🗑️ deleteNode(id=",id,")")
      if(id == canvasID.value){
        swapCanvas(0)
      }
      deleteAllChildren(id);

      const nodeId = (id);
    
      const nodeExists = getNode(id,true);

      //TODO: Need to implement deleting the ID for inputEdge and outputEdge for connected edges
      if (nodeExists) {
        console.log(`Node with id ${id} exists in objects, deleting...`);
        console.log("[EDITOR]Before:", nodes);
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
          console.log("[EDITOR]🦠🗑️ deleteNode: Node removed from parent.")
        }
        else{
          nodes.value = nodes.value.filter((node) => node.id != nodeId); //may not always delete a node          
        }
        console.log("[EDITOR]After:", nodes);
        globalSync(true);
        return; 
      }
      console.error(`deleteNode: Node with id ${id} does not exist`);
      return; 
  }; 
  const deleteAllChildren = (id) => { // recursive function to delete children nodes of node
    console.log("[EDITOR]👼🗑️ deleteAllChildren(id=",id,")")
    console.log("[EDITOR]👼🗑️ globalNodes.get(",id,")",globalNodes.get(id))
    if(!globalNodes.has(id)){
      return;
    }
    for(let key in globalNodes.get(id).n){
      console.log("[EDITOR]👼🗑️ deleting node", key.id)
      deleteNode(Number(key.id))
    }
    return;
  }

  const getAllNodes = (onlyObjects=false, returnType="node") => {
    if(debug >= 1)console.log("[EDITOR]🦠💯 getAllNodes(onlyObjects=",onlyObjects,"returnType=",returnType,")")
    let returnedNodes = Array.from(globalNodes.values()).flatMap(canv => canv.n)    
    let tReturnedNodes = []
    if(onlyObjects==true) returnedNodes = returnedNodes.filter((node)=>node.data.hasOwnProperty('isObject'))
    if(returnType=="title" && onlyObjects == true){
      for(let i = 0 ; i < returnedNodes.length; i++){
        tReturnedNodes.push(returnedNodes[i].data.object_name)
      }
      returnedNodes = tReturnedNodes
    }
    if(debug >= 1)console.log("[EDITOR]🦠💯 returnedNodes=",returnedNodes)
    return returnedNodes
  };

  const GameNode = (iNode, childNodes=[]) => { //Simplifies the nodes for reading and altering
    let node = cloneDeep(iNode)
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
          gNode.images = {} // images that the canvas currently is displaying.
          // no need for global edge store with compiled games
        }
        if(gNode.isFunction){
          gNode.functionName = node.data.function_name
          gNode.functionParams = [...node.data.function_params]   
        }


    if(debug >= 1)console.log("[EDITOR]🦠🎮 GameNode(",node,")")
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
      console.log("[EDITOR]🚢🎮 compiledNode: ID",ID,"canvas",canvas)
      for(const node of canvas.n){ // go through all nodes per canvas. add them to the map of all nodes
        console.log("[EDITOR]🚢🎮 compiledNode: canvas",ID,"node",node)
        // add node to global map
        allNodes.set(Number(node.id),GameNode(node))
        // add child node ids to parent
        const tNode2 = allNodes.get(Number(ID))
        console.log("[EDITOR]🚢🎮 tNode2",tNode2)
        tNode2.n.push(Number(node.id))  //THERES A BUG THAT HAPPENS SOMETIMES ON THIS LINE THAT PREVENTS GAME FROM COMPILING
        allNodes.set(Number(ID),tNode2) 
      }
    }
    game.nodeMap=allNodes
    game.images = projectImages.value
    console.log("[EDITOR]🚢🎮 GAME COMPILED",game)
    return game
  };




  const getLocalNodeIDs = () => {
    console.log("[EDITOR]🦠🆔 getLocalNodeIDs()")
    IDS = []
    for(let i = 0; i < nodes.length; i++){
      IDS.push(nodes[i].id)
    }
    return IDS;
  }

  const getNode = (id, doGlobal=false) => {
    if(debug >= 1)console.log("[EDITOR]   🦠🫴 getNode(id=", id, "doGlobal=", doGlobal,")")
    if(id<-1){
      console.error(`   🦠🫴 getNode called with invalid id, id is ${id}`)
      return null;
    }
    if(id==-1){
      console.log("[EDITOR]   🦠🫴 getNode called on toolbox node")
      return  null;
    }
    if(id==0){
      console.log("[EDITOR]getNode on global (id=0)")
      return  null;
    }
      let nodeExists = nodes.value.find((n) => n.id == id);
      if(doGlobal == true){
        globalSync();
        const allNodes = getAllNodes()
        if(debug >= 1)console.log("[EDITOR]   🦠🫴 getNode(global): globalNodesArray",allNodes)
        nodeExists = allNodes.find((n) => n.id == id)
        if(debug >= 1)console.log("[EDITOR]   🦠🫴 getNode(global): node to return",nodeExists)
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
      if(debug >= 1)console.log("[EDITOR]   🦠🫴 getNode(local) node exists", nodeExists, "title is", nodeExists.data.object_name);
    }
    else {
      if(debug >= 1)console.log("[EDITOR]   🦠🫴 getNode(local) function node exists", nodeExists);
    }
      //globalSync(); // might be necessary? SHAKY
      return nodeExists
  };

  const addEdge = (edge) => {
    console.log("[EDITOR]📏➕ Adding edge:", edge);
    // Check if the edge already exists
    const edgeExists = edges.value.find(
      (e) => e.id === edge.id
    );
    
    if (edgeExists) {
      console.error(`📏➕Edge from ${edge.source} to ${edge.target} already exists`);
      return;
    }

    //checks if any edges exist from the current source
    /*
    console.log("[EDITOR]📏➕ Checking if any edges exist from the current source", edge.source)
    const edgeDoubleSource = edges.value.find(
      (e) => e.source === edge.source 
    );

    if(edgeDoubleSource){
      console.error(`can't have multiple edges from source ${edge.source}`)
      return;
    }
    */
    
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

    const edgeSrc =  getNode(Number(edge.source))
    if(!edgeSrc.data.hasOwnProperty('outputEdges')) edgeSrc.data.outputEdges = {}
    edgeSrc.data.outputEdges[Number(srcHandleIndex)]=Number(edge.target)
    const edgeTgt = getNode(Number(edge.target))
    if(!edgeTgt.data.hasOwnProperty('inputEdges')) edgeTgt.data.inputEdges = {}
    edgeTgt.data.inputEdges[Number(tgtHandleIndex)]=Number(edge.source)

    // node.data.srcHandles = 0 //source handles
    // node.data.tgtHandles
    // Add the edge
    edges.value.push(edge);
    console.log("[EDITOR]📏➕ After adding edge:", edges.value);
    globalSync();
  };

  const getCurrentCanvasName = () => {
    console.log("[EDITOR]🖼️🔤 getCurrentCanvasName()")
    if(canvasID.value == 0){
      return "Global"
    }
    else if(canvasID.value < 0){
      return "BadNode"
    }
    else{
      const nodeTitle = getNode(canvasID.value, true)
      console.log("[EDITOR]🖼️🔤 getCurrentCanvasName nodeTitle=",nodeTitle)
      if(nodeTitle == null){
        console.log("[EDITOR]🖼️🔤 getCurrentCanvas = NodeNotFound")
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
  const getProjectImages = () =>{ //for compiler
    let destructuredImages = {}
    if(projectImages==undefined || projectImages.value==undefined || projectImages.value==null) return {}
    for (const [key, value] of Object.entries(projectImages.value)) {
      destructuredImages[key]=value
    }
    return destructuredImages
  }
  const setProjectImages = (imagesObject) =>{ // for compiler
    projectImages.value = imagesObject
  }
  const getNodeProperties = (id, doGlobal=false) => { // DO NOT USE IN A WATCHER OR COMPUTE FUNCTION (spam), returns an array
    console.log("[EDITOR]⚙️⬅️ getNodeProperties(id=", id, ",doGlobal=", doGlobal,")")
    const nodeExists = getNode(id,true,true);
    // && nodeExists.hasProperty(data) && nodeExists.data.hasOwnProperty(properties)
    if(nodeExists != null){
      if(nodeExists.data.properties==null){
        return [];
      }
      console.log("[EDITOR]⚙️⬅️ Successful getNodeProperties! Properties:", nodeExists.data.properties)
      return nodeExists.data.properties;
    }
    else{
      return [];
    }
  };
  const getEdge = (id) => {
    console.log("[EDITOR]📏⬅️ getEdge(id=", id,")")
    return edges.value.find(e => e.id === id);
  };
  const updateEdge = (id, newData) => {
    console.log("[EDITOR]📏🆙 updateEdge(id=", id, ",newData=", newData,")")
    const edgeIndex = edges.value.findIndex(e => e.id === id);
    if (edgeIndex === -1) {
      console.error(`Edge with id ${id} does not exist`);
      return;
    }
    
    edges.value[edgeIndex] = { ...edges.value[edgeIndex], ...newData };
    console.log("[EDITOR]📏🆙Edge updated:", edges.value[edgeIndex]);
    globalSync();
  };

  const deleteEdgeByHandle = (handleID) => { //should be in the form of 1s0 or 30t12
    console.log("[EDITOR]📏🗑️ deleteEdgeByHandle(handleID=", handleID,")")
    for(const edge of edges.value){
      if(edge.id.includes(handleID)) deleteEdge(edge.id)
    }
  }
  const deleteEdge = (id) => {
    console.log("[EDITOR]📏🗑️ deleteEdge(id=", id,")")
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
    console.log("[EDITOR]📏🗑️ Edge deleted. Remaining edges:", edges.value);
    globalSync();
  };

  const addHandle = (id, handleType="source") =>{
    console.log("[EDITOR]🤹➕  addHandle(id=",id,"node")
    let handleName = ""
    const nodeExists = getNode(id)
    if(nodeExists==null){
      console.warn("🤹➕  addHandle, node not found")
    }
    if(handleType=="source"){
      handleName = id+"s"+nodeExists.data.srcHandles
      nodeExists.data.srcHandles += 1;
      console.log("[EDITOR]🤹➕  New handle ID = ",handleName)
      return handleName;
    }
    if(handleType=="target"){
      handleName = id+"t"+nodeExists.data.tgtHandles
      nodeExists.data.tgtHandles += 1;
      console.log("[EDITOR]🤹➕  New handle ID = ",handleName)
      return handleName;
    }
  };

  const initNodes = () => {   //the node portion of initting a new project. currently empties nodes/edges, resets object counts and idcounter
    console.log("[EDITOR]🦠🫴 initNodes()");
    nodes.value = [];
    edges.value = [];
    setGlobalNodes(new Map());  //I added of this line of code because the player and its children were being preserved on init of new project.
    object_count.total = 0;
    object_count.room = 0;
    object_count.item = 0;
    object_count.npc = 0;
    object_count.pathway = 0;
    object_count.custom = 0;
    globalSync();
    idCounter.value = 1;
    projectImages.value={}
    canvasID.value = 0;

  // Default global nodes (Player) -------------------
  console.log("[EDITOR]id counter is:", idCounter);
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

    console.log("[EDITOR]🦠🫴 initNodes() done");
    console.log("[EDITOR]🦠🫴 Project initted with nodes", nodes.value);
  };  



//this makes a copy of the node with the given id and puts it in the clipboard
//just because it's created doesn't mean it's added to the array. it shouldn't mess with anything
const copyNode = (id) => {
  const node = getNode(id);

  // Avoid copying reactive/proxy properties
  clipboardNode.value = cloneDeep({
    type: node.type,
    data: node.data,
  });

  console.log("[EDITOR]🦠📋 copyNode(id=", id, ")");
};
//adds a new node from the clipboard. takes position as argument.
//was a little torn about whether to put this in canvas or not but we've been having all this functionality in nodestore so far.
const pasteNode = (pos) => {
  const node = clipboardNode.value;
  const newNode = {
    type: node.type,
    position: pos,
    id: idCounter.value,
    data: cloneDeep(node.data),
    expandParent: true,
  };

  addNode(newNode);
  globalSync();
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
    getProjectImageNames,
    pushProjectImage,
    getProjectImageLink,
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
    projectImages,
    getProjectImages,
    setProjectImages,
    deleteEdge,
    deleteEdgeByHandle,
    getEdge,
    GameNode,
    compileGame,
    contributeFunctionParameters,
    getParam,
    setGlobalNodes,
    copyNode,
    pasteNode
  };
});
