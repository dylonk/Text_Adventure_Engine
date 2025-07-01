<script setup>
import { ref } from 'vue';
import { useProjectStore } from '../editor/project_store';

const projectStore = useProjectStore();
const tutorialTexts = [
    "",
    "Welcome to the Magiquill tutorial! Here you will learn the basics of the engine.",
    "Magiqull uses a system of nested canvases to represent objects:rooms, npcs, items, and even the player all fall under this umbrella.",
    "Currently, you're in the global Canvas. There's a few things you can do here, but for now you can think of it as a sort of world map, a canvas in which all your rooms are stored.",
    "Try placing a room now by dragging a room node in from the toolbox on the left. It's the very first node type from the top.",
    "Great! Now that you have your node placed, you can right click it in the canvas and press 'rename' to give it a name. You can delete or copy/paste nodes from the same menu.",
    "Now is a good time to introduce the object viewer on the right. If you've only been following the tutorial, you should see the player and the room you just made within the global canvas. Try clicking on the room you just made within the object viewer.",
    "You should now be looking at an empty canvas! This is the room you just made. You can tell which canvas you're in from the display in the top right, and you can collapse and uncollapse objects in the object viewer using the small arrows to the left of their names.",
    "Lets get started with some logic! The counterpart of an object node is a function node. While object nodes essentially exist just to hold and organize data, function nodes actually make things happen. ",
    "Go back to the 'global' canvas using the object viewer, and drag in a 'console output' node (The white one, just under the 'interactive' heading). This is the most basic function, and one you'll probably be using a lot. Click the text box within and type something.",
    "These function nodes need to be strung together with edges in order to do anything. They execute in sequence from left to right, and only one function node can be executed at a time. Drag a line from the right handle of the 'start' node to the left handle of your new console output node.",
    "this lines are called 'edges', and they can be thought of as the flow of a games logic. A game is, in a way, an elaborate flowchart. You can click the destination node's left handle to delete all edges leading to it.",
    "You just made a very basic game. In the top left of the screen, click 'view' and then 'preview' from the dropdown. This button lets you test out your game, exactly as it will appear when published. ",
    "Your console output node should fire and you should see your text. The 'start' node fittingly executes when you start the game. Click the preview button from the dropdown again to close out the preview.",
    "Now that we have a basic idea of how to navigate the editor, lets go through some of the important nodes.",
    "The 'await' node is, in many ways, the most useful function node in the editor. It *awaits* a text input from the user, and then executes the function node that follows it.",
    "It sounds simple enough, but in order for an await node to fire, it must be *in scope*. Whether an await node is *in scope* depends where the await node is, relative to where the player is. This might sound confusing at first, so let's do an example.",
    "Try dragging an await node from the toolbox into the global canvas. Type 'breathe' into the expected text box, set store last location to false, and then connect it to a console output node using an edge. The console output could say something like, 'You take a deep breath'.",
    "Now, go to preview again, and try typing 'breathe'. The console output should fire.",
    "An await node in the global canvas is always in scope, meaning it will execute when it's input is typed, no matter where the player is. Await nodes like 'check inventory', 'examine self', and 'check health' are usually placed in global, as they can be accessed from anywhere and have the same behavior no matter the player's location.",
    "Lets start doing some advanced functionality by creating a common text adventure scenario step by step: the player in a room, with a key and a locked door.",
    "first off, lets start the game by putting the player in the room you made. Drag in a 'set location' node, set the target to the player and the location to the room. Hook it up to the right of the console output node you made earlier, or just directly to the start node.",
    "They key and the door will both be item nodes. All object nodes: Items, NPCs and rooms, basically work in the same way. It's more of a of a helpful distinction for the you, the creator, than anything.",
    "An items location is determined by the canvas it's placed within. For now, lets navigate to your room's canvas, then drag two item nodes in there. Right click rename the items to 'key' and 'door'",
    "It's not just rooms that have their own canvases; items do too. click the key item you just made in the object viewer to navigate into its canvas.",
    "Just like any other canvas, you can place all kinds of nodes here. Drag in an await node and set it to await 'pick up key'. This await will be in scope while the player is in the room, because the associated item will be in the same canvas as the player.",
    "Once you've done that, drag in a 'set location' node, set the target to the key, and the location to the player. This adds the key to the players inventory. If you feel like it, you can also add any other key-related awaits you want. 'examine key' is a good one to start with, hooked up to a console output describing the key.", 
    "Now, you don't want to be able to pick up the key if it's already in your inventory. It's time to learn about 'if' nodes. An if node chooses which path to move forward with, based on some condition. Drag one into the canvas, and hook it up in between the await node and the set location node. It should look like this INSERT IMAGE LATER.",
    "In the 'condition' text box, type 'key.location!=player'. If you're familiar with coding, this style will probably feel natural to you, but if not you can press the 'help' button to see the syntax tips. This if statement evaluates whether or not the key is in the players inventory.",
    "Hook up the top condition (the one that fires if the player doesn't have the key) to the setlocation node you made earlier. If you want, you can also add a console output and hook it up to the 'else' statement, saying something like 'you already have the key'.",
    "Navigate back to the room's canvas and take a look at the door you just made. The horizontal grey and white text bars are *properties*. A property is essentially any aspect of an object that you want to control and use. For this door, we're going to want to track whether it's open or not.",
    "Press the '+' button in the top right of the door node to add a property. Name it 'isOpen' and put the value as 'false '.",
    ""


]

const nextStep=()=>{projectStore.nextTutorialStep()};
const previousStep=()=>{projectStore.prevTutorialStep()};
const endTutorial=()=>{projectStore.endTutorial()};
</script>


<template>
    <div class="tutorial-widget" >
        <div class="tutorial-text">{{ tutorialTexts[projectStore.tutorialStep] }}</div>
        <div class="tutorial-controls">
            <button v-if="projectStore.tutorialStep > 1"  @click="previousStep">Previous</button>
            <button @click="nextStep">Next</button>
            <button @click="endTutorial">Skip Tutorial</button>
        </div>
    </div>

</template>
<style scoped>

@import url("https://fonts.googleapis.com/css2?family=Eagle+Lake&display=swap");



.tutorial-widget {
    position: absolute;
    left: 835px;
    font-size: small;
    background: rgb(7, 255, 44);
    width: 300px;
    height: 250px;
    overflow: hidden;
    color: rgb(255, 255, 255);
    z-index: 4;
    
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Keeps text at top, buttons at bottom */
    padding: 10px;
    box-sizing: border-box;
}

.tutorial-text {
    font-family: "Eagle Lake", serif;
    font-size: 14px;
    overflow-y: auto;
    flex: 1; /* This makes it take remaining space */
    color: rgb(22, 116, 239);
}

.tutorial-controls {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 10px;
}
.tutorial-controls button {
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #fff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.tutorial-controls button:hover {
  background: rgba(255, 255, 255, 0.2);
}

</style>