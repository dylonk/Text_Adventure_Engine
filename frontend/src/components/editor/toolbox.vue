<script setup>
import TBNode from './nodes/prompt.vue'
import RoomNode from './nodes/room.vue' // Import the RoomNode component
import { ref } from 'vue';

import useDragAndDrop from './drag_drop.js';


const roomData = ref([  //hoiw rooms are represented in the toolbox
    {
        id: 1,
        node_type: 'Room',
        output_handle: true,
        input_handle: false,
        items: [
            { id: 1, name: 'Key' },
            { id: 2, name: 'Lamp' }
        ]
    }
]);

const contextMenuVisible = ref(false); //the context menu is the right click menu, which in the future will be used for creating rooms or items.
const contextMenuPosition = ref({ x: 0, y: 0 });
const contextMenuType = ref('empty'); // Track the type of context menu (right now empty or room, but will include objects and maybe more in future)
const selectedRoomId = ref(null); // Track the selected room for renaming

const addRoom = () => {     //adds a room to the toolbox
    roomData.value.push({
        id: Date.now(),
        node_type: 'Room',
        output_handle: true,
        input_handle: false,
        items: []
    });
    contextMenuVisible.value = false; // Hide context menu after creating a room
};

const renameRoom = (newName) => { //function for renaming a room
    const room = roomData.value.find(r => r.id === selectedRoomId.value); //
    if (room) { 
        room.node_type = newName; 
    } 
    contextMenuVisible.value = false; 
};

const handleRightClick = (event) => {//right click will open the context menu when the toolbox is clicked
    event.preventDefault();
    event.stopPropagation(); // Stop event propagation. This keeps the context menus seperate
    if (!event.target.closest('.component_container')) {    //trying to keep from firing when clickiung on room
    console.log('Right-clicked on empty:'); // Debugging
    contextMenuPosition.value = { x: event.clientX, y: event.clientY };
    contextMenuVisible.value = true;
    contextMenuType.value = 'empty';    //if right click on tempty toolbox area, contextmenu is of empty type
    contextMenuVisible.value = true;
    }
};

const handleRoomRightClick = ({ id,type, x, y }) => {    //right click for opening the room context menu
    console.log('Right-clicked on room:', { id, type, x, y }); // Debugging
    if(type==='room')
    {
        console.log('Right-clicked on room:', { id, type, x, y }); // Debugging
    contextMenuPosition.value = { x, y }; 
    contextMenuType.value = 'room'; 
    selectedRoomId.value = id; 
    contextMenuVisible.value = true; 
    }   

};

const closeContextMenu = () => {//context menu closing function.
    contextMenuVisible.value = false;
};


</script>
<template>
    <div class="toolbox" @contextmenu="handleRightClick" @click="closeContextMenu">
        <a class="tb_title">
        Toolbox
        </a>
        <TBNode></TBNode>
        <RoomNode
            v-for="room in roomData"
            :key="room.id"
            :id="room.id"
            :node_type="room.node_type"
            :output_handle="room.output_handle"
            :input_handle="room.input_handle"
            :items="room.items"
            @showContextMenu="handleRoomRightClick"
        ></RoomNode>
        <div v-if="contextMenuVisible" :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }" class="context-menu">
            <ul v-if="contextMenuType === 'empty'">
                <li @click="addRoom">CREATE ROOM</li>
            </ul>
            <ul v-if="contextMenuType === 'room'"> 
                <li @click="renameRoom(prompt('Enter new room name'))">RENAME ROOM</li> 
            </ul>
        </div>
    </div>
</template>

<style>
.toolbox{
    display:flex;
    flex-direction: column;
    height:100%;
    background:rgb(225, 225, 225);
}
.toolbox>*{
    margin:20px;
}

.tb_title{
    padding:8px;
    text-align: center;
    margin: 0 auto;
    margin-bottom:0px;

    width: 100%;
    height:min-content;
    color:rgb(255, 255, 255);
    background:rgb(189, 189, 189);
    font-weight:800;
    font-size:18px;
}


.context-menu {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.context-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.context-menu li {
    padding: 10px;
    cursor: pointer;
}

.context-menu li:hover {
    background: #f0f0f0;
}
</style>







