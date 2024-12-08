<script setup>
import { ref, defineProps } from 'vue';
import NodeBase from '../../node_base.vue'
import { Handle, Position } from '@vue-flow/core';
import { SmallButton, HContainer, HandleIn, HandleOut } from '../../node_assets/n-component-imports';
import node_colors from '../../node-colors';
let response_id = 0;

const ext_stroke_color= node_colors.prompt_stroke;
const ext_bg_color= node_colors.prompt_bg;

const responses = ref([
])

function addResponse(){
    responses.value.push({id:response_id++, text:""})
}
function removeResponse(){
    if(response_id>0){
        responses.value.pop()
        response_id--;
    }
}

function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}
</script>


<template>
    <HandleIn/>
    <HandleOut/>

    <NodeBase
        display_type="Prompt"
        node_type="prompt"
        :bg_color="ext_bg_color"
        :id="id"
        :stroke_color="ext_stroke_color">
        <textarea class="console_response_text" placeholder="Type your console output here."></textarea>
        <div class="user_response_container" v-for="response in responses" :key="response.id">
        <div class="response_title">Response {{ response.id }}</div>
        <textarea class = "user_response_text" id="textbox" placeholder="Type the expected user input here."></textarea>
        <HandleOut :handleID="response_id" style="position:absolute"/>
        </div>
        <HContainer spacing="5px" outerMargin="5px">
        <SmallButton @click="addResponse()" button_text="+" :component_bg_color="ext_bg_color" :component_stroke_color="ext_stroke_color" style="margin-right:5px;"></SmallButton>
        <SmallButton @click="removeResponse()" button_text="-" :component_bg_color="ext_bg_color" :component_stroke_color="ext_stroke_color"></SmallButton>
        </HContainer>
    </NodeBase>

</template>


<style scoped>
    .console_response_text{
        resize:none;
        width:200px;
        height:100px;
        background:rgb(255, 255, 255);
        border:solid v-bind('ext_stroke_color') 1px;
        border-radius:3px;
    }
    .user_response_text{
        resize:none;
        width:200px;
        height:auto;
        color:black;
        background:rgb(255, 255, 255);
        border:solid v-bind('ext_stroke_color') 1px;
        border-radius:3px;
    }
    .user_response_container{
        color: v-bind('ext_stroke_color');
        background:v-bind('ext_bg_color');
        margin: 0px;
        padding-left:10px;
        padding-bottom:5px;
    }
    .response_title{
        display:flex;
    }
</style>