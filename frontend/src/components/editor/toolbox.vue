<script setup>

import useDragAndDrop from './drag_drop.js';
import node_colors from './nodes/node-colors.js'
import { TBNode } from './nodes/n-imports.js'
import { useProjectStore } from './project_store.js';
import tbTop from '../../assets/Images/editor/toolbox-top-posterized.png'
import tbTitle from '../../assets/Images/editor/toolboxtitle.png'
import tbBottom from '../../assets/Images/editor/toolbox-bottom-posterized.png'
import tbMid from '../../assets/Images/editor/toolbox-mid-posterized.png'

</script>
<template>
    <div class="toolbox">
        <img onload="this.width*=0.8" :src="tbTop" class="tb-scroll-image-top">
        <img class="tb_title" onload="this.width*=1" :src="tbTitle">
        <div class="tb-items">
            <a class="tb_subtitle">Objects</a>
                    <TBNode type="room" display_type="Room"/>
                    <TBNode type="item" display_type="Item"/>
                    <TBNode type="npc" display_type="NPC"/>
                    <TBNode type="pathway" display_type="Pathway"/>
                    <TBNode type="custom" display_type="Custom"/>
            <a class="tb_subtitle">Interactive</a>
                    <TBNode type="output" display_type="Console Output"/>
                    <TBNode type="prompt" display_type="Prompt"/>
                    <TBNode type="unimplemented" display_type="Wait"/>
                    <TBNode type="image" display_type="Image"/>
                    <TBNode type="unimplemented" display_type="Modify Image"/>
                    <TBNode type="unimplemented" display_type="Background"/>
                    <TBNode type="unimplemented" display_type="Sound"/>
            <a class="tb_subtitle">Watchers</a>
                    <TBNode type="unimplemented" display_type="Extend Scope"/>
                    <TBNode type="await" display_type="Await"/>
            <a class="tb_subtitle">Value</a>
                    <TBNode type="unimplemented" display_type="Set Property"/>
            <a class="tb_subtitle">Path Control</a>
                <TBNode type="unimplemented" display_type="If"/>
                <TBNode type="unimplemented" display_type="Return"/>
                <TBNode type="unimplemented" display_type="Location"/>
                <TBNode type="unimplemented" display_type="On Player"/>
                <TBNode type="unimplemented" display_type="On Visible"/>
                <TBNode type="unimplemented" display_type="End Game"/>
            <a class="tb_subtitle">Visual</a>
        
            </div>
        <img onload="this.width*=0.8" :src="tbBottom" class="tb-scroll-image-bottom">
    </div>
</template>

<style>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';
@import 'https://fonts.googleapis.com/css2?family=Hurricane';

.toolbox{
    display:flex;
    flex-direction: column;
    width:11.2%;
    min-width:min-content;
    height:100%;
    background-image: url("@/assets/Images/editor/toolbox-mid-posterized.png");
    background-repeat: repeat-y;
    background-size:107%;
}

.tb-items>*{
    margin:6px;
}

.tb_title{

    font-family: "Hurricane", serif;    
    font-size: xx-large;
    padding:0px;
    text-align: center;
    margin: 0 auto;
    margin-bottom:0px;

    width: 90%;
    height:min-content;
    color:rgb(78, 81, 76);
    font-weight:500;
}

.tb-scroll-image-top{
    position:relative;
    margin:0px;
    width:106%;
    z-index:3;
    pointer-events: none;
}
.tb-scroll-image-bottom{
    margin:0px;
    width:106%;
    margin-top:auto;
    z-index:1;
    pointer-events: none;

}
.tb_subtitle{
    font-family: "Hurricane", serif;    
    font-size:30px;
    padding:4px;
    margin: 0 auto;
    margin-bottom:0px;

    width: 100%;
    height:min-content;
    color:rgb(0, 0, 0);
}
.tb-items{
    display:flex;
    flex-direction: column;
    min-width:max-content;
    margin: 8px;
    overflow:auto;
    height:100%;
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
