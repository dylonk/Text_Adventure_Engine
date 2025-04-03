import { useNodesStore } from "./node_store"
import { ref } from "vue"


let nodeMap = new Map()
const output = ref("TEST")
const outputQueue = []
// syncers
const progressionSyncer = ref(false) // confusing value, but it just alternates between true and false per tick so that outside elements can update if need be
const scopeSyncer = ref(false) // when the position of an item is changed, this ticks for the asset browser

const allowInput = ref(false) // ensures that user input is only accepted during specific times (i.e path hits a prompt node) and not mid logic or something

let canvas = 0
let activePosition = 1 // the node of which the path is currently on
let prevPositions = [] //ONLY PUSHED WHEN AWAIT OR OTHER PATH ABDUCTOR IS CALLED. For when the path is abducted by an await or similar watcher node so the path knows where to return to.
let watching = [] //lists all ids of await function nodes in scope


const start = (compiledGame) =>{
  output.value = "erm"
  nodeMap = compiledGame.nodeMap
  console.log("GAMENODES:",nodeMap)
  processNode(1)
}

const getNode = (nodeID) => { //get node from nodemap
  return nodeMap.get(Number(nodeID))
}
const updateNode = (inputNode) => { //modify node (for updating values within map)
  nodeMap.set(inputNode.id,inputNode)
  return
}



const processNode = (ID) =>{
  const node = getNode(ID)
  if(node.isFunction){
    func(node.funcName,node.funcParams)
  }
}

const nextNode = (sourceHandleIndex) => {
  let targetNode = null; //-1 insists that a node isn't found, other values correspond with node id
  if(getNode(activePosition).outputEdges.hasOwn(sourceHandleIndex)){
    targetNode = getNode(activePosition).outputEdges[sourceHandleIndex]
    activePosition = targetNode
  }
  return targetNode
}

const func = (funcName,funcParams=[]) => { // function node functions
  console.log("[GAME] ",funcName,"(",funcParams,")")
  switch(funcName){
    case "start":{
      nextNode(0)
      break;
    }
    case "prompt":{
      output.value = "PROMPT"
      break;
    }

  }
}



export default{
      start, //initializes game
      getNode, //getnode
      updateNode, //modifynode
      func,
      output,
      processNode,
      nextNode,
}