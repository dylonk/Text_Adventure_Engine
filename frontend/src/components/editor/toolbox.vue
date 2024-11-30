<script setup>

import useDragAndDrop from './drag_drop.js';

import { TBNode } from './nodes/n-imports.js'


</script>
<template>
    <div class="toolbox">
        <a class="tb_title">Toolbox</a>
        <a class="tb_subtitle">Objects</a>
        <TBNode node_type="prompt" display_type="Prompt" node_color="green"></TBNode>
        <a class="tb_subtitle">Interactive</a>
        <a class="tb_subtitle">Logic</a>

    </div>
</template>

<style>
@import 'https://fonts.googleapis.com/css?family=Pixelify+Sans';

.toolbox{
    display:flex;
    flex-direction: column;
    height:100%;
    background:rgb(225, 225, 225);
    border-right: 2px solid black;
    border-radius: 3px;
}
.toolbox>*{
    margin:20px;
}

.tb_title{

    font-family: 'Pixelify Sans'; font-size: 22px;
    padding:8px;
    text-align: center;
    margin: 0 auto;
    margin-bottom:0px;

    width: 100%;
    height:min-content;
    color:rgb(255, 255, 255);
    background:rgb(189, 189, 189);
    background-image: linear-gradient(180deg, rgb(206, 206, 206), rgb(169, 169, 169));
    font-weight:800;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

.tb_subtitle{
    font-family: 'Pixelify Sans';
    padding:6px;
    margin: 0 auto;
    margin-bottom:0px;

    width: 100%;
    height:min-content;
    color:rgb(128, 128, 128);
    font-weight:600;
    font-size:14px;
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
