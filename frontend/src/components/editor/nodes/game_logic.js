import {defineStore} from 'pinia'
import { useNodesStore } from "./node_store"
import { ref } from "vue"

export const useGameStore = defineStore('game', () => {

let nodeMap = new Map()
const output = ref("TEST")
const outputQueue = []
const choices = []
// syncers
const progressionSyncer = ref(false) // confusing value, but it just alternates between true and false per tick so that outside elements can update if need be
const scopeSyncer = ref(false) // when the position of an item is changed, this ticks for the asset browser
const objectViewerSelected = ref(0)
const initialized = ref(false)

const allowInput = ref(false) // ensures that user input is only accepted during specific times (i.e path hits a prompt node) and not mid logic or something

let canvasID = ref(0)

let activeNode = 1 // the node of which the path is currently on
let prevPositions = [] //ONLY PUSHED WHEN AWAIT OR OTHER PATH ABDUCTOR IS CALLED. For when the path is abducted by an await or similar watcher node so the path knows where to return to.
let watching = [] //lists all ids of await function nodes in scope


const start = (compiledGame) =>{
  output.value = "erm"
  nodeMap = compiledGame.nodeMap
  console.log("[GAME] Game initialized. nodeMap:",nodeMap)
  markScope()
  initialized.value = true
  processNode(1)
}

const getNode = (nodeID, notifyConsole=false) => { //get node from nodemap
  let nodeExists = nodeMap.get(Number(nodeID))
  nodeExists = nodeExists!=null? nodeExists:null
  if(notifyConsole) console.log("[GAME] getNode(",nodeID,") is",nodeExists)
  return nodeExists
}
const updateNode = (inputNode) => { //modify node (for updating values within map)
  nodeMap.set(inputNode.id,inputNode)
  return
}



const processNode = (ID) =>{
  console.log("[GAME] 🦠🔍 Parsing node:",ID)
  const node = getNode(Number(ID))
  console.log("[GAME] 🦠🔍 Parsed node is:", node)
  if(node.isFunction){
    func(node.functionName,node.functionParams)
  }
}

const markScope = () =>{
  const node = getNode(Number(2))
  if(getNode(2).parentID == 0){
    node.inScope = true
  }
  updateNode(node)
}

const nextNode = (sourceHandleIndex) => {
  let targetNode = null; //-1 insists that a node isn't found, other values correspond with node id
  if(getNode(activeNode).edgesOut.hasOwnProperty(sourceHandleIndex)){
    targetNode = getNode(activeNode).edgesOut[sourceHandleIndex]
    activeNode = targetNode
  }
  // TODO: make sure something happens when next handle is null (outside of this function of course)
  return targetNode
}

const func = (funcName,funcParams=[]) => { // function node functions
  console.log("[GAME] func( ",funcName,",",funcParams,")")
  switch(funcName){
    case "start":{
      processNode(Number(nextNode(0)))
      break;
    }
    case "prompt":{
      output.value = funcParams[0].vals[0] //Console Output
      choices.value = [...funcParams[1].vals] //All
      console.log("[GAME] prompt function choices = ", choices.value)
      break;
    }

  }
}

const interpretUserText=(text)=>{ //This is the system responsible for allowing aliases, making verbs variable and soforth.
// $alias{Object1} adds all of object1's aliases to array of interpreted texts
// $property{Object1,health} outputs the property
const interpretedTexts = []

}

const interpretGameText=(text)=>{
// does the same as user Text but for 
}

const userResponse=(text)=>{ // Compares user text to possible choices
  for(const i = 0; i < choices.length; i++){
    if(text == "") processNode(Number(nextNode(0)))
    if(text == choices.value[i]){
      processNode(Number(nextNode(i+1)))
      return;
    }
  }
  processNode(Number(nextNode(0)))
  return;
}

return{
      start, //initializes game
      getNode, //getnode
      updateNode, //modifynode
      canvasID,
      progressionSyncer,
      scopeSyncer,
      initialized,
      objectViewerSelected,
      func,
      output,
      processNode,
      nextNode,
      userResponse,
      markScope,
      interpretUserText,
}
});