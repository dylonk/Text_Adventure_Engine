<script setup>
// import TBNode from './nodes/types/prompt.vue'
// import RoomNode from './nodes/types/disabled_room.vue' // Import the RoomNode component
import { ref } from 'vue';
import useDragAndDrop from './drag_drop.js';
// Node imports again
import tbGlobal from './nodes/tb_global.vue'
import { PromptNode, RoomNode,ItemNode } from './nodes/n-imports.js'


</script>
<template>
    <div class="toolbox" @contextmenu="handleRightClick" @click="closeContextMenu">
        <a class="tb_title">Toolbox</a>
        <PromptNode/>
        <ItemNode/>
        <RoomNode/>

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
