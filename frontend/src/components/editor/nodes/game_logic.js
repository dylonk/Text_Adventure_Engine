import {defineStore} from 'pinia'
import { ref } from "vue"


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const useGameStore = defineStore('game', () => {
  
let nodeMap = new Map() // map of nodes stored by ID not name!!
let originalGame = {} // write only
let imageMap = {} // should NOT be edited during the game, its just for synchronizing the images to their respective links {key is name, value is link}
const output = ref("This should not appear, output is not being set")
const outputQueue = ref([])
let choices = []
let promptchoices = []
let watchchoices = []
let currentImages = []



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
  outputQueue.value = []
  output.value = "Game initialized"
  archiveOutput()
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
const getNodeByName = (name) => {
  for (const [id, node] of nodeMap.entries()) {
    if (node.hasOwnProperty("objectName") && node.objectName === name) {
      console.log("Found", name);
      if (node.obj == null) {
        console.log("[GAME] getNodeByName(", name, ") is", node);
        return node;
      } else {
        return node.obj;
      }
    }
  }
  return null;
};

const updateNode = (inputNode) => { //modify node (for updating values within map)
  nodeMap.set(inputNode.id,inputNode)
  return
}

//this is used for variables in output
const extractBracesContent = (inputText) => {
  const regex = /\{([^}]+)\}/g;  // Match anything inside { }
  let matches = [];
  let match;

  // Find all matches
  while ((match = regex.exec(inputText)) !== null) {
    matches.push(match[1]);  // match[1] is the content inside the curly braces
  }

  return matches;  // Return all the extracted references
};
//this is used for variables in output. It takes something like room1.cleanliness and finds the value.
const getValueFromNode = (reference) => {
  const parts = reference.split('.');
  const nodeName = parts[0];
  const propertyName = parts[1];

  console.log(`[GAME] 🔍 Looking up reference: "${reference}"`);
  console.log(`[GAME] 🧩 Parsed node = "${nodeName}", property = "${propertyName}"`);

  const node = getNodeByName(nodeName);

  if (!node) {
    console.warn(`[GAME] ❌ Node not found for name "${nodeName}"`);
    return null;
  }

  console.log(`[GAME] ✅ Found node:`, node);

  if (!node.data) {
    console.warn(`[GAME] ❌ Node "${nodeName}" has no data property`);
    return null;
  }

  if (!node.data.properties) {
    console.warn(`[GAME] ❌ Node "${nodeName}" has no 'properties' field in its data`);
    return null;
  }

  if (!(propertyName in node.data.properties)) {
    console.warn(`[GAME] ❌ Property "${propertyName}" not found in node "${nodeName}"'s properties`);
    return null;
  }

  const value = node.data.properties[propertyName];
  console.log(`[GAME] ✅ getValueFromNode("${reference}") =`, value);
  return value;
};

//this function takes in a string and replaces all references to variables with their actual values
const replaceBracesWithValues = (inputText) => {
  // Extract all references inside curly braces
  let extractedReferences = extractBracesContent(inputText);

  // For each extracted reference, replace the placeholder in the input text with its value
  extractedReferences.forEach(reference => {
    const value = getValueFromNode(reference);  // Get the actual value for the reference
    if (value !== null) {
      // Replace the reference in the text with the actual value
      inputText = inputText.replace(`{${reference}}`, value);
    }
  });

  return inputText;
};



const getImages = (currentCanvas) => { //this formatting is so that Game.vue can use the canvas ref to live update the images
  imagesArray = currentCanvas
  let nodeExists = getNode(currentCanvas)
  if(!nodeExists || !nodeExists.hasOwnProperty("images")){
    return [];
  }
  return Object.values(nodeExists.images) // returns an array of the objects images
}

const addImageToViewport = (imageObject) => {
  //PAY ATTENTION
  //IMAGE MUST BE IN FORMAT
  // imageObject{name:"name",xpos,ypos,... whatever data}
  // Offline images, maybe store images by name when downloading the zip?
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
const archiveOutput = () =>{
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
  return;
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
      archiveOutput()
      processNode(nextNodeFromHandle(0))
      break;
    }
    case "prompt":{ // most of the prompt logic is not handled here, just sets the choices and output
      allowInput.value = true
      choices = []
      outputText(funcParams[0].vals[0]) //Console Output
      for(let i = 0; i < funcParams[1].vals.length; i++){
        addChoice(funcParams[1].vals[i],iNode.id,i+1)
      }
      console.log("[GAME] prompt function choices = ", choices)
      break;
    }
    case "output":{
      let outputTextWithReplacements = funcParams[0].vals[0];  // Get the input text (e.g., "{room1.cleanliness}")
  
      // Replace any curly-brace references with actual values
      outputTextWithReplacements = replaceBracesWithValues(outputTextWithReplacements);
    
      // Output the final text with replaced values
      outputText(outputTextWithReplacements);
      processNode(nextNodeFromHandle(0))
      break;
    }
    case "setlocation":{
      let target = getNodeByName(funcParams[0].vals[0])
      if(target == null){
        break;
      }
      console.log("Target found", target)
      let targetParent = getNode(target.parentID)
      console.log("Searching for destination")
      let destination = getNodeByName(funcParams[1].vals[0])
      console.log("Destination found", destination);

      if(target==null||targetParent==null||destination==null){
        console.log("[GAME] setlocation had null return", target, targetParent, destination)
        processNode(nextNodeFromHandle(0))
        break;
      }

      target.parentID = destination.id // add new destination id to parent
      targetParent = targetParent.n.filter(child => child != target.id) // remove child from parent
      destination.push(target.id) // add child to destination

      updateNode(target)
      updateNode(targetParent)
      updateNode(destination)

      scopeSyncer.value = !scopeSyncer.value
      console.log("[GAME] setlocation successful",target,targetParent,destination)
      processNode(nextNodeFromHandle(0))

      break;
    }

    case "setproperty":{
      let target = getNodeByName(funcParams[0].vals[0])
      if(target == null){
        break;
      }
      console.log("Target found", target)
      target.data[funcParams[1].vals[0]] = funcParams[2].vals[0]
      updateNode(target)
      console.log("[GAME] setproperty successful",target)
      processNode(nextNodeFromHandle(0))
      break;  
    }
    case "image":{
      processNode(nextNodeFromHandle(0))
      break;
    }
    case "wait": {
      const waitTime = parseInt(funcParams[0].vals[0]); // assuming this is a string number
      console.log(`[GAME] ⏳ Waiting for ${waitTime}ms...`);
      // Await the sleep, then process the next node
      sleep(waitTime).then(() => {
        processNode(nextNodeFromHandle(0));
      });
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
      archiveOutput();
      processNode(nextNodeFromHandle(choices[i].handleID,choices[i].nodeID))
      return;
    }
  }
  archiveOutput();
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
function getGame()
{
  const gameToReturn=originalGame;
  gameToReturn.nodeMap=nodeMap;
  return gameToReturn;
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
      archiveOutput,
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
      setNodeMap,
      getNodeByName,
      getGame
    }
});