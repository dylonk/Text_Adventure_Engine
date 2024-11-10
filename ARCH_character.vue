<script setup>
import { ref, defineProps } from 'vue';
import useDragAndDrop from '../../drag_drop.js';
import ObjectNode from './types/object.vue'; // Import the ItemNode component

const props = defineProps({
    id:Number,
    node_type:"Room",
    output_handle:Boolean,
    input_handle:Boolean,
    items: { type: Array, default: () => [] }, // Define items as an array prop with a default empty array
    name:String// gotta have a name!
})
const emit = defineEmits(['showContextMenu']);//showcontext menu emit interacts with toolbox screen
const { onDragStart } = useDragAndDrop();//uses the same drag and drop functionality as the "prompt". I still won't lie I don't know exactly what prompts are meant to be, even though its been explained
const isDropdownOpen = ref(false);//tracks whether the rooms dropdown is open in the toolbar

const selectedItemId = ref(null); // Reactive reference to store the selected item ID
const selectedRoomId = ref(null); // Reactive reference to store the selected room ID

const toggleDropdown = () => { isDropdownOpen.value = !isDropdownOpen.value; };//toggles dropdown menu for the room

const handleRightClick = (event) => { //when right clicked, shows the context menu of the room
    event.preventDefault();
    console.log('Right-click detected on room node'); // Debugging
    emit('showContextMenu', { id: props.id, type: 'room', x: event.clientX, y: event.clientY }); //emits showcontextmeny, used below
};

const handleRoomRightClick = ({ id, type, x, y }) => {
    console.log('Right-clicked on room node:', { id, type, x, y });
    if (type === 'room') {
        contextMenuPosition.value = { x, y };
        contextMenuType.value = 'room';
        selectedRoomId.value = id;
        contextMenuVisible.value = true;
    }
};

const handleItemRightClick = (item, event) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent propagation to the room's context menu
    selectedItemId.value = item.id;
    selectedRoomId.value = item.roomId; // Store the room ID of the item for later
    console.log('Right-click detected on item in handleItemRightClick in item.vue:', item); // Debugging
    emit('showItemContextMenu', { id: item.id, type: 'item', x: event.clientX, y: event.clientY });//emits item context menu event
};
</script>


<template>
    <div class="component_container" :draggable="true" @dragstart="onDragStart($event, 'output')" @contextmenu="handleRightClick">
        <div class="component_title" @click="toggleDropdown">
           {{ props.name }}
        </div>
        <ul v-if="isDropdownOpen">  <!---if the dropdown is open, displays the child items-->
            <li v-for="item in props.items" :key="item.id" @contextmenu="handleItemRightClick(item, $event)">
                <ItemNode :id="item.id" :name="item.name" :description="item.description" :roomId="props.id" />
            </li>
        </ul>
        <input>
    </div>
</template>


<style>
.component_container{
    padding:10px;
    background:rgb(255, 255, 255);
    outline: 2px solid black;
    height:fit-content;
    width:fit-content;
}

.component_container > input { background: rgb(186, 186, 186); }
.component_title { padding: 3px; cursor: pointer; }

</style>