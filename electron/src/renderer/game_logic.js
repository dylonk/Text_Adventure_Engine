import {defineStore} from 'pinia'
import { ref } from "vue"

export const useGameStore = defineStore('game', () => {

let nodeMap = new Map()
let originalGame = {} // write only
const output = ref("TEST")
const outputQueue = ref([])
let choices = []
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
  output.value = "Game initialized"
  outputQueue.value = []
  choices=[];
  activeNode = 1;
  nodeMap = compiledGame.nodeMap
  originalGame = compiledGame
  console.log("[GAME] Game initialized. nodeMap:",nodeMap)
  markScope()
  initialized.value = true
  processNode(getNode(1, true))
}

const restartGame = () =>{
  start(originalGame)
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



const processNode = (iNode) =>{
  if(iNode == null){ output.value="End of game reached"; return;}
  // Add awaits to choices here
  activeNode = iNode.id
  console.log("[GAME] 🦠🔍 Parsing node:",iNode.id)
  console.log("[GAME] 🦠🔍 Parsed node is:", iNode)
  if(iNode.isFunction){
    func(iNode)
  }
}

const outputText = (text) =>{
  if(output.value!="")output.value += `\n`+text
  else output.value += text
}
const textNext = () =>{
  outputQueue.value.push(output.value)
  output.value = ""
}

const addChoice = (choiceText, originNodeID, originHandleID) =>{
  console.log("[GAME] addChoice(text=",choiceText,"originID=",originNodeID,"handleID=",originHandleID)
  const choice = {
    text: choiceText,
    nodeID: originNodeID,
    handleID: originHandleID,
  }
  choices.push(choice)
}

const markScope = () =>{
  const node = getNode(Number(2))
  if(getNode(2).parentID == 0){
    node.inScope = true
  }
  updateNode(node)
}

const nextNodeFromHandle = (sourceHandleIndex, sourceNodeID=activeNode) => {
  let targetNode = null; //null insists that a node isn't found, 
  let oldActiveNode = sourceNodeID
  if(getNode(sourceNodeID).hasOwnProperty("edgesOut") && getNode(sourceNodeID).edgesOut.hasOwnProperty(sourceHandleIndex)){
    targetNode = getNode(sourceNodeID).edgesOut[sourceHandleIndex]
    activeNode = targetNode
  }
  // TODO: make sure something happens when next handle is null (outside of this function of course)
  console.log("[GAME] next node from ID", oldActiveNode ,"handle",sourceHandleIndex,"is",targetNode)
  if(targetNode==null) outputText("End of game logic reached");
  targetNode = getNode(targetNode)
  return targetNode
}

const func = (iNode) => { // function node functions
  const funcName = iNode.functionName
  const funcParams = iNode.functionParams
  console.log("[GAME] func( ",funcName,",",funcParams,")",iNode)
  switch(funcName){
    case "start":{
      processNode(nextNodeFromHandle(0))
      break;
    }
    case "prompt":{ // most of the prompt logic is not handled here, just sets the choices and output
      choices = []
      outputText(funcParams[0].vals[0]) //Console Output
      for(let i = 0; i < funcParams[1].vals.length; i++){
        addChoice(funcParams[1].vals[i],iNode.id,i+1)
      }
      console.log("[GAME] prompt function choices = ", choices)
      break;
    }
    case "output":{
      outputText(funcParams[0].vals[0])
      processNode(nextNodeFromHandle(0))

      break;
    }

  }
}

const interpretUserText=(text)=>{ //This is the system responsible for allowing aliases, making verbs variable and soforth.
// $alias{Object1} adds all of object1's aliases to array of interpreted texts
// $property{Object1,health} outputs the property

// For now just pushing a stripped lowercase version of the usertext
const interpretedTexts = []
interpretedTexts.push(text.toLowerCase().replace(/\s/g, ""))
console.log("[GAME] userResponse converted to", interpretedTexts)
return interpretedTexts
}

const interpretGameText=(text)=>{
// does the same as user Text but for console output
const interpretedTexts = []
interpretedTexts.push(text.toLowerCase().replace(/\s/g, ""))
return interpretedTexts
}

const userResponse=(text)=>{ // Compares user text to possible choices
  console.log("[GAME] userResponse was", text)
  const userText = interpretUserText(text)
  for(let i = 0; i < choices.length; i++){
    if(userText[0] == choices[i].text){
      textNext();
      processNode(nextNodeFromHandle(choices[i].handleID,choices[i].nodeID))
      return;
    }
  }
  textNext();
  processNode(nextNodeFromHandle(0))
  return;
}




//included getter and setter for nodemap to preemptively avoid the kind of issue we had with nodestore
function getNodeMap()
{
  return nodeMap;
}
function setNodeMap(newmap)
{
  nodeMap=newmap;
}

return{
      start, //initializes game
      restartGame,
      getNode, //getnode
      updateNode, //modifynode
      canvasID,
      progressionSyncer,
      scopeSyncer,
      outputText,
      textNext,
      initialized,
      objectViewerSelected,
      func,
      output,
      outputQueue,
      processNode,
      nextNodeFromHandle,
      userResponse,
      addChoice,
      markScope,
      interpretUserText,
      interpretGameText,
      getNodeMap,
      setNodeMap
}
});