<script>
import { ref } from 'vue';
import useDragAndDrop from '../drag_drop.js';

const node_title = ref("Prompt")

const { onDragStart } = useDragAndDrop()
</script>


<template>
    <div class="component_container" :draggable="true">
        <div class="component_title">
           a {{ node_title }}
        </div>
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
.component_container>input{
    background:rgb(186, 186, 186)
}
.component_title{
    padding:3px;
}
</style>