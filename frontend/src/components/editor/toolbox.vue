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

</style>