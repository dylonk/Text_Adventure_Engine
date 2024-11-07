<script setup>
import TBNode from './nodes/prompt.vue'
import useDragAndDrop from './drag_drop.js';
</script>
<template>
    <div class = "toolbox">
        <a class="tb_title">
        Toolbox
        </a>
        <TBNode></TBNode>
    </div>
</template>

<style>
.toolbox{
    display:flex;
    flex-direction: column;
    outline: 2px solid rgb(0, 0, 0);
    height:100%;
    background:rgb(225, 225, 225);
}
.toolbox>*{
    margin:10px;
}

.tb_title{
    padding:8px;
    text-align: center;
    margin: 0 auto;
    width: 100%;
    height:min-content;
    color:black;
    font-weight:600;
    font-size:18px;
}
</style>