import { property } from 'lodash';
import {defineStore} from 'pinia'
import { ref, watch } from "vue"


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export const useGameStore = defineStore('game', () => {
  

// syncers for outside use
const progressionSyncer = ref(false) // confusing value, but it just alternates between true and false per tick so that outside elements can update if need be
const scopeSyncer = ref(false) // when the position of an item is changed, this ticks for the asset browser
const objectViewerSelected = ref(0) // for the editor preview
const initialized = ref(false)
const isOnline = ref(false)
const allowUserInput = ref(false) // ensures that user input is only accepted during specific times (i.e path hits a prompt node) and not mid logic or something
let debug = 2 // 0 is what the user should be able to see, 1 is light dev debugging, 2 is heavy debugging, 3 includes getnode and very spammy ones

// Actual game stuff starts here
let nodeMap = new Map() // map of nodes stored by ID not name!!
let originalGame = {} // write only
let imageMap = {} // should NOT be edited during the game, its just for synchronizing the images to their respective links {key is name, value is link}
const output = ref("This should not appear, output is not being set")
const outputQueue = ref([])
let choices = []
let watchchoices = [] // calculated when rooms are entered for the first time (These values would never change in the same room, so we get to save some performance there)
const currentImagePath = ref(null)
const canvasID = ref(0)
let canvasesInScope = {}
let activeNode = 1 // the node of which the path is currently on
let prevPlayerPositions = [] // For SETLOCATION. Different from prevActiveNodes. So it knows where to return the player if a return node is called
let prevActiveNodes = [] // For AWAIT. Logic may not necessarily be occurring in the same room as the player is in. Example: Check time is called on player's watch. You don't want to move player position to the watch, but you do want the watch logic to run. Once RETURNLOGIC is called, the original position the logic was in is returned to

const start = (compiledGame,online=true) =>{
  isOnline.value = online
  outputQueue.value = []
  output.value = "Game initialized (If stuck here, press restart!)"
  allowUserInput.value = false;
  archiveOutput()
  choices=[];
  watchchoices=[];
  activeNode = 1;
  currentImagePath.value = null;
  nodeMap = compiledGame.nodeMap
  originalGame = compiledGame
  if(debug>=1) console.log("[GAME] Game initialized. nodeMap:",nodeMap)
  imageMap = compiledGame.images
  if(debug>=2) console.log("[GAME] imageMap is ",imageMap)
  markScope()

  initialized.value = true
  processNode(getNode(1, true))
}
const restartGame = () =>{
  start(originalGame)
}
//gets the image link from the name.
const getImage = (name) => {
  if(debug>=1) console.log("[GAME] Image set to", name)
  if(imageMap.hasOwnProperty(name)){
    if(debug>=1) console.log("[GAME] Image successful!")
    return imageMap[name]
  }
  if(debug>=1) console.log("[GAME] Image unsuccessful")
  return null
}
const getNode = (nodeID, notifyConsole=false) => { //get node from nodemap
  if(nodeID == null) return null
  let nodeExists = nodeMap.get(Number(nodeID))
  nodeExists = nodeExists!=null? nodeExists:null
  if(debug>=3) console.log("[GAME] getNode(",nodeID,") is",nodeExists)
  return nodeExists
}
const updateNode = (inputNode) => { //modify node (for updating values within map)
  nodeMap.set(inputNode.id,inputNode)
  return
}
const getNodeByName = (name) => {
  for (const [id, node] of nodeMap.entries()) {
    if (node.hasOwnProperty("objectName") && node.objectName === name) {
      if(debug>=1) console.log("[GAME] getNodeByName Found", name);
      if (node.obj == null) {
        return node;
      } 
    }
  }
  return null;
};

const getParameter = (node, paramIndex, retrieveArray=true) => { // safer way of retrieving nodes than accessing arrays on nodes that may or may not exist
  if(!node.hasOwnProperty('funcParams')) { if(debug>=2) console.log("[GAME] getParameter on node that does not have funcParams"); return null;}
  if(node.funcParams.length <= paramIndex) { if(debug>=2) console.log("[GAME] getParameter index accessed outside of bounds"); return null;}
  if(retrieveArray==false){
    return node.funcParams[paramIndex].vals[0]
  }
  else return funcParams[paramIndex].vals
}

//this is used for variables in output. It extracts everything from the braces and returns everything in the format blank.blank in an array.
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




// Parse and evaluate a simple expression safely
const safeEvaluate = (expression) => {
  // Convert string numbers to actual numbers
  expression = expression.replace(/\b\d+(\.\d+)?\b/g, match => match);
  
  // Handle equality check (==)
  if (expression.includes("==")) {
    const [left, right] = expression.split("==").map(s => s.trim());
    return parseValue(left) == parseValue(right);
  }
  
  // Handle inequality check (!=)
  if (expression.includes("!=")) {
    const [left, right] = expression.split("!=").map(s => s.trim());
    return parseValue(left) != parseValue(right);
  }
  
  // Handle greater than or equal (>=)
  if (expression.includes(">=")) {
    const [left, right] = expression.split(">=").map(s => s.trim());
    return parseValue(left) >= parseValue(right);
  }
  
  // Handle less than or equal (<=)
  if (expression.includes("<=")) {
    const [left, right] = expression.split("<=").map(s => s.trim());
    return parseValue(left) <= parseValue(right);
  }
  
  // Handle greater than (>)
  if (expression.includes(">")) {
    const [left, right] = expression.split(">").map(s => s.trim());
    return parseValue(left) > parseValue(right);
  }
  
  // Handle less than (<)
  if (expression.includes("<")) {
    const [left, right] = expression.split("<").map(s => s.trim());
    return parseValue(left) < parseValue(right);
  }
  
  // Handle AND (&&)
  if (expression.includes("&&")) {
    const [left, right] = expression.split("&&").map(s => s.trim());
    return safeEvaluate(left) && safeEvaluate(right);
  }
  
  // Handle OR (||)
  if (expression.includes("||")) {
    const [left, right] = expression.split("||").map(s => s.trim());
    return safeEvaluate(left) || safeEvaluate(right);
  }
  
  // Handle boolean values
  if (expression.trim() === "true") return true;
  if (expression.trim() === "false") return false;
  
  // If it's just a single value, return it as a boolean
  return !!parseValue(expression);
};

// Parse a value into its appropriate type
const parseValue = (value) => {
  value = value.trim();
  
  // Handle numbers
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return parseFloat(value);
  }
  
  // Handle strings with quotes
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1);
  }
  
  // Handle booleans
  if (value === "true") return true;
  if (value === "false") return false;
  
  // Handle undefined and null
  if (value === "undefined") return undefined;
  if (value === "null") return null;
  
  // Return as is (likely a variable that will be replaced)
  return value;
};





//this is the same thing without the curly braces, used for extracting variables from conditions. still returns an array of all the variable strings.
const extractVariableReferences = (inputText) => {
  // Match things like room1.cleanliness or player.health (basic dot notation)
  const regex = /\b([a-zA-Z_]\w*\.[a-zA-Z_]\w*)\b/g;
  let matches = [];
  let match;

  while ((match = regex.exec(inputText)) !== null) {
    matches.push(match[1]);
  }

  return matches;  // Return all the extracted references
};


//this is used for variables in output, as well as conditionals. It takes something like room1.cleanliness and finds the value.
//something like room1.location will be a little different becuse it's not an acutal data property. Thats what the if statements are for
const getValueFromNode = (reference) => { 

  const parts = reference.split('.');
  const nodeName = parts[0];
  const propertyName = parts[1];

  const node = getNodeByName(nodeName);

  if (!node) {
    if(debug>=2) console.warn(`[GAME] ❌ Node not found for name "${nodeName}"`);
    return null;
  }

  if(debug>=2) console.log(`[GAME] ✅ Found node:`, node);

  if (!node.data) {
    console.warn(`[GAME] ❌ Node "${nodeName}" has no data property`);
    return null;
  }

  if (!node.data.properties) {
    if(debug>=2) console.warn(`[GAME] ❌ Node "${nodeName}" has no 'properties' field in its data`);
    return null;
  }
  //can also get the location. well have to make sure nobody uses a custom "location" property
  if(propertyName=="location"){
      const locId=node.parentID;
      console.log("[GAME] locId", locId)
      if(locId==0) return "Global";
      else{
        const locNode = getNode(locId);
        console.log("[GAME] locNode", locNode)
        if(locNode==null) {
          return "Unknown";
        }
        else {
          console.log("[GAME] locNode.data.objectName", locNode.objectName)
          return locNode.objectName;
        }
      }
  }
  else if (!(propertyName in node.data.properties)) {
    if(debug>=2) console.warn(`[GAME] ❌ Property "${propertyName}" not found in node "${nodeName}"'s properties`);
    return null;
  }

  const value = node.data.properties[propertyName];
  if(debug>=2) console.log(`[GAME] ✅ getValueFromNode("${reference}") =`, value);
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

// const getImages = (currentCanvas) => { //this formatting is so that Game.vue can use the canvas ref to live update the images
//   imagesArray = currentCanvas
//   let nodeExists = getNode(currentCanvas)
//   if(!nodeExists || !nodeExists.hasOwnProperty("images")){
//     return [];
//   }
//   return Object.values(nodeExists.images) // returns an array of the objects images
// }

// const addImageToViewport = (imageObject) => { // To be implemented  later maybe
//   //PAY ATTENTION
//   //IMAGE MUST BE IN FORMAT
//   // imageObject{name:"name",xpos,ypos,... whatever data}
//   // Offline images, maybe store images by name when downloading the zip?
// }

const processNode = (iNode) =>{
  if(iNode == null){
    archiveOutput();
    outputText("End of game reached");
    if(debug>=1) console.log("[GAME] End of game nodeMap:", nodeMap)

    return;
  }
  // Add awaits to choices here
  activeNode = iNode.id
  if(debug>=3) console.log("[GAME] 🦠🔍 Parsing node:",iNode.id, iNode)
  else if(debug>=2) console.log("[GAME] 🦠🔍 Parsing",iNode.type," node id",iNode.id )
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
// CHOICES NEED TO BE INTERPRETED AT CALL TIME, SOME SITUATIONS MAY NOT ALLOW FOR PRECOMPUTATION, SUCH AS IF A CHOICE HAS AN ALIAS THAT CHANGES BETWEEN THE TIMES OF THE ROOM CALCULATION AND THE PLAYER INTERACTING

const addChoice = (choiceText, originNodeID, originHandleID, doPushChoice=true) =>{
  if(debug>=3) console.log("[GAME] addChoice(text=",choiceText,"originID=",originNodeID,"handleID=",originHandleID)
  const choice = {
    text: choiceText,
    nodeID: originNodeID,
    handleID: originHandleID,
  }
  if(doPushChoice) choices.push(choice)
  return choice
}

function calculateAwaits(node){
  if(node.hasOwnProperty('awaitChoices')) return node.awaitChoices;  // awaitChoices have already been calculated, just returning the precalculated choices
  if(!node.hasOwnProperty('isObject') || !node.isObject) return [];
  let nodeAwaitChoices = [] 
  const nodeChildren = node.n
  for(let i = 0; i < nodeChildren.length; i++){
    let child = getNode(nodeChildren[i])
    if(child==null) continue;
    if(child.type == 'await'){
      const choiceText = getParameter(child,0) // gets the first param
      const nodeID = nodeChildren[i].id
      const handleID = 0;
      nodeAwaitChoices.push(addChoice(choiceText,nodeID,handleID,false))
    }
  }
  if(debug>=2) console.log("[GAME] Calculated Await choices for node",node.id,"are", nodeAwaitChoices)
  return nodeAwaitChoices
}

const getChildrenOfType = (typeToRetrieve, parent, onlyRetrieveFirstInstance=true) => { // returns node id (or ids) of matching children. For use in nodes like PlayerEnter
  const parentChildren = parent.n
  if(onlyRetrieveFirstInstance){
    for(let i = 0; i < parentChildren.length; i++){
      const child = getNode(parentChildren[i])
      if(child==null) continue;
      if(child.type == typeToRetrieve){
        if(debug>=1) console.log("[GAME] getChildrenOfType, child of type", typeToRetrieve, "found at node",child.id)
        return child.id
      } 
    }
  }
  else{
    let typeMatched = []
    for(let i = 0; i < parentChildren.length; i++){
      const child = getNode(parentChildren[i])
      if(child==null) continue;
      if(child.type == typeToRetrieve){
        typeMatched.push(child.id)
      } 
    }
    return typeMatched
  }
}

const markScope = () =>{ // Marks the scope of the nodes that are being watched between room changes
  for(const [nodeID,statements] of Object.entries(canvasesInScope)){
    let markedNode = getNode(nodeID)
    if(markedNode==null) continue
    markedNode.inScope  = false;
    updateNode(markedNode)
  }
  canvasesInScope = {} // Remove all canvases currently in scope
  let tChoices = []


  // Calculate awaits for player
  let playerNode = getNode(2)
  if(playerNode==null){if(debug>=1)console.log("[GAME] markScope player is null"); return;}
  tChoices = calculateAwaits(playerNode)
  if(tChoices!=[]) playerNode.awaitChoices = tChoices;
  playerNode.inScope = true;
  canvasesInScope[Number(playerNode.id)] = tChoices
  updateNode(playerNode)

  // Calculate awaits for player sibling (player's parent's other children)
  let playerParent = getNode(playerNode.parentID)
  if(playerParent!=null){
    const playerSiblings = playerParent.n
    for(let i = 0; i < playerSiblings.length;i++){
      let playerSibling = getNode(playerSiblings[i])
      if(playerSibling==null) continue; 
      tChoices = calculateAwaits(playerSibling)
      if(tChoices!=[]) playerSibling.awaitChoices=tChoices;
      playerSibling.inScope=true;
      canvasesInScope[Number(playerSibling.id)] = tChoices
      updateNode(playerSibling)
    }
  }

  // Calculate awaits for player's children


  return;
}
const onPlayerSwitchRoom = () => { // Must be performed upon a player room change, updates scope, gets the node to start on
  markScope()
  const player = getNode(2) 
  const foundPlayerEnterNode = getNode(getChildrenOfType("playerenter",player)) // gets the first playerEnter node in the room
  scopeSyncer.value = !scopeSyncer.value
  processNode(foundPlayerEnterNode)
  return
}


const nextNodeFromHandle = (sourceHandleIndex, sourceNodeID=activeNode) => {
  let targetNode = null; //null insists that a node isn't found, 
  let oldActiveNode = sourceNodeID
  if(getNode(sourceNodeID).hasOwnProperty("edgesOut") && getNode(sourceNodeID).edgesOut.hasOwnProperty(sourceHandleIndex)){
    targetNode = getNode(sourceNodeID).edgesOut[sourceHandleIndex]
    activeNode = targetNode
  }
  // TODO: make sure something happens when next handle is null (outside of this function of course)
  if(debug>=1)console.log("[GAME] next node from ID", oldActiveNode ,"handle",sourceHandleIndex,"is",targetNode)
  if(targetNode==null){
    outputText("End of game logic reached");
    if(debug>=1) console.log("End of game nodeMap:", nodeMap)
  }
   targetNode = getNode(targetNode)
  return targetNode
}

const func = (iNode) => { // function node functions
  const funcName = iNode.functionName
  const funcParams = iNode.functionParams
  if(debug>=2)console.log("[GAME] func( ",funcName,",",funcParams,")")
  switch(funcName){
    case "start":{
      archiveOutput()
      processNode(nextNodeFromHandle(0))
      break;
    }
    case "prompt":{ // most of the prompt logic is not handled here, just sets the choices and output
      choices = []
      let outputTextWithReplacements = funcParams[0].vals[0];  // Get the input text (e.g., "{room1.cleanliness}")
      // Replace any curly-brace references with actual values
      outputTextWithReplacements = replaceBracesWithValues(outputTextWithReplacements);
      // Output the final text with replaced values
      outputText(outputTextWithReplacements);
      for(let i = 0; i < funcParams[1].vals.length; i++){
        addChoice(funcParams[1].vals[i],iNode.id,i+1)
      }
      allowUserInput.value = true;
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
        if(debug>=1) console.log("[GAME] setLocation target null")
        break;
      }
      if(debug>=1) console.log("[GAME] setLocation Target found", target.id)
      let targetParent = getNode(target.parentID)
      if(debug>=1) console.log("[GAME] setLocation Searching for destination")
      let destination = getNodeByName(funcParams[1].vals[0])
      if(debug>=1) console.log("[GAME] setLocation Destination found", destination.id)

      if(target==null||targetParent==null||destination==null){
        console.log("[GAME] setlocation had null return", target, targetParent, destination)
        processNode(nextNodeFromHandle(0))
        break;
      }

      target.parentID = destination.id // add new destination id to parent
      destination.n.push(target.id) // add child to destination


      var index = targetParent.n.indexOf(target.id)
      if(index !== -1) targetParent.n.splice(index,1)

      updateNode(target)
      updateNode(targetParent)
      updateNode(destination)

      onPlayerSwitchRoom()

      if(debug>=1) console.log("[GAME] setlocation successful",target,targetParent,destination)
      // processNode(nextNodeFromHandle(0)) TODO: ADD RETURNS

      break;
    }
    case "setproperty":{
      let target = getNodeByName(funcParams[0].vals[0])
      if(target == null){
        break;
      }
      if(debug>=1) console.log("[GAME] setLocation Target found", target.id, target.objectName)
      console.log( "check this out" ,funcParams[1].vals[0], funcParams[2].vals[0])
      let propertyName = funcParams[1].vals[0]
      let newValue = funcParams[2].vals[0]
      target.properties[propertyName] = funcParams[2].vals[0]
      updateNode(target)
      console.log("[GAME] setproperty successful",target)
      processNode(nextNodeFromHandle(0))
      break;  
    }
    case "image":{
      currentImagePath.value = getImage(funcParams[0].vals[0])
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
    case "if":
    {
      //its actually going to calculate all the conditions before it even runs and just store them as an array of bools. 
      //The first true is the path it will take
      //marginally more computation intensive? yeah. but easier to write on a deadline
      const conditionBools=[];
      //iterates through all the funcparams, which should be all the textboxes.
      for(let i = 0; i < funcParams.length; i++){
        let stringToEval=funcParams[i].vals[0];
        console.log("[GAME] stringToEval before value extraction = ", stringToEval)

        //extract all the variables in the string
        let vars = extractVariableReferences(stringToEval);
        //the below loop iterates through all the variables in the string and then replaces them with their values
        vars.forEach(reference => {
          const value = getValueFromNode(reference);
          if (value !== null) {

            // Replace the reference in the text with the actual value
            //also add quotes if the value is a string
            const replacement = typeof value === 'string' ? 
            `"${value}"` : value;
            stringToEval = stringToEval.replaceAll(reference, replacement);
          }
        });
        //then pushes the result of the if or else to the bool array.
        console.log("[GAME] stringToEval after value extraction = ", stringToEval)  
        const bool = safeEvaluate(stringToEval);
        conditionBools.push(bool);
      }

      for(let i = 0; i < conditionBools.length; i++){
        if(conditionBools[i]){
          processNode(nextNodeFromHandle(i));
          break;
        }
      } 
      // If we got here, no condition was true, so follow the else handle
      processNode(nextNodeFromHandle(conditionBools.length));
      break;
    }
    case "playerenter":{
      processNode(nextNodeFromHandle(0))
      break
    }
    case "await":{
      processNode(nextNodeFromHandle(0))
      break  
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
// does the same as user Text but for anything that may be considered a 'choice' (prompts, awaits, whaaaatever)
const interpretedTexts = []
interpretedTexts.push(text.toLowerCase().replace(/\s/g, ""))
return interpretedTexts
}

const userResponse=(text)=>{ // Compares user text to possible choices
  console.log("[GAME] userResponse was", text)
  if(text == "printnodes") console.log("CONSOLE COMMAND, printnodes",nodeMap)
  allowUserInput.value = false;
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
      getImage,
      onPlayerSwitchRoom,
      canvasID,
      progressionSyncer,
      scopeSyncer,
      currentImagePath,
      outputText,
      archiveOutput,
      initialized,
      objectViewerSelected,
      func,
      output,
      outputQueue,
      getChildrenOfType,
      getParameter,
      processNode,
      nextNodeFromHandle,
      userResponse,
      addChoice,
      markScope,
      interpretUserText,
      allowUserInput,
      interpretGameText,
      getNodeMap,
      setNodeMap,
      getNodeByName,
      getGame
    }
});