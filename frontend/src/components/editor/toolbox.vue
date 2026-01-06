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
        <div class="tb-items">
            <a class="tb_subtitle">Objects</a>
                <div class="tb-group">
                    <TBNode type="room" display_type="Room"/>
                    <TBNode type="item" display_type="Item"/>
                    <TBNode type="npc" display_type="NPC"/>
                    <TBNode type="pathway" display_type="Pathway"/>
                    <TBNode type="custom" display_type="Custom"/>
                </div>
            <a class="tb_subtitle">Interactive</a>
                <div class="tb-group">
                    <TBNode type="consoleoutput" display_type="Console Output"/>
                    <TBNode type="prompt" display_type="Prompt"/>
                    <!-- <TBNode type="inventoryMessage" display_type="Inventory Message"/>
                    <TBNode type="showInventoryMessages" display_type="Show Inventory Messages"/> -->
                    <TBNode type="wait" display_type="Wait"/>
                    <TBNode type="image" display_type="Image"/>
                </div>
            <a class="tb_subtitle">Path Control</a>
            <div class="tb-group">
                <TBNode type="await" display_type="Await"/>
                <TBNode type="playerenter" display_type="On Player Enter"/>
                <TBNode type="returnplayer" display_type="Return Player"/>
                <TBNode type="repeater" display_type="Repeater"/>
                <TBNode type="if" display_type="If"/>
            </div>
            <a class="tb_subtitle">Value</a>
            <div class="tb-group">
                <TBNode type="setproperty" display_type="Set Property"/>
                <TBNode type="setlocation" display_type="Set Player Location"/>
            </div>
                <!-- <a class="tb_subtitle">TO IMPLEMENT</a>
                <TBNode type="unimplemented" display_type="Extend Scope"/>
                <TBNode type="unimplemented" display_type="Background"/>
                <TBNode type="unimplemented" display_type="Sound"/>
         -->
            </div>
    </div>
</template>

<style>
@import 'https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap';
@import 'https://fonts.googleapis.com/css2?family=Hurricane';

.toolbox{
    display:flex;
    flex-direction: column;
    width:fit-content;
    height:100%;
    background:#5d5d5d;
}

.tb-items>*{
    margin:6px;
}
.tb-group{
    display:flex;
    flex-direction: column;
    gap:0.75rem;
    margin:0.75rem;
}

.tb_title{

    font-size:large;
    padding:0px;
    text-align: left;
    margin: 0 auto;
    margin-bottom:0px;

    width: 90%;
    height:min-content;
    color:rgb(255, 255, 255);
    font-weight:500;
}
.tb_subtitle{
    font-size:1rem;
    padding:4px;
    margin: 0 auto;
    margin-bottom:0px;
    font-family: 'RetroQuill';
    width: 100%;
    height:min-content;
    background:black;
    color:rgb(255, 255, 255);
}
.tb-items{
    display:flex;
    flex-direction: column;
    min-width:max-content;
    background: #383838;    

    overflow:auto;
    scrollbar-gutter: stable;
    height:100%;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
.tb-items::-webkit-scrollbar {
  display: none;
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
