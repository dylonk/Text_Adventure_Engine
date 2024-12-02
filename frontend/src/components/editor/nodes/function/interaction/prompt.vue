<script setup>
import { ref, defineProps } from 'vue';
import NodeBase from '../../node_base.vue'
import { Handle, Position } from '@vue-flow/core';

let response_id = 0;

const prompt_stroke_color= "rgb(50, 100, 50)";
const prompt_bg_color= "rgb(200, 245, 170)";

const responses = ref([
])

function addResponse(){
    responses.value.push({id:response_id++, text:""})
}
function removeResponse(){
    responses.value.push({id:response_id++, text:""})
}
function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}
</script>


<template>
    <NodeBase
        display_type="Prompt"
        node_type="prompt"
        :bg_color="prompt_bg_color"
        :stroke_color="prompt_stroke_color">
        <textarea class="console_response_text"></textarea>
        <div class="user_response_container" v-for="response in responses" :key="response.id">
        <div class="response_title">Response {{ response.id }}</div>
        <textarea class = "user_response_text" id="textbox"></textarea>
        </div>
        <button @click="addResponse()" class="add_response_button">+</button>
    </NodeBase>

</template>


<style scoped>
    .console_response_text{
        resize:none;
        width:200px;
        height:100px;
        background:rgb(255, 255, 255);
        border:solid v-bind('prompt_stroke_color') 1px;
        border-radius:3px;
    }
    .user_response_text{
        resize:none;
        width:200px;
        height:auto;
        color:black;
        background:rgb(255, 255, 255);
        border:solid v-bind('prompt_stroke_color') 1px;
        border-radius:3px;
    }
    .add_response_button{
        height:20px;
        width:20px;
        color: v-bind('prompt_stroke_color');
        font-weight: 800;
        border:v-bind('prompt_stroke_color') solid 1px;
        border-radius: 3px;
        background:white;
        margin-top:10px;
    }
    .add_response_button:hover{
        background-image: linear-gradient(180deg,white,white,v-bind(prompt_stroke_color));
    }
    .user_response_container{
        color: v-bind('prompt_stroke_color');
        background:v-bind('prompt_bg_color');
        margin: 0px;
        padding-left:10px;
        padding-bottom:5px;
    }
    .response_title{
        display:flex;
    }
</style>