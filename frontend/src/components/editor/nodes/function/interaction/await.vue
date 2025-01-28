<script setup>
import { ref, defineProps } from 'vue';
import NodeBase from '../../node_base.vue'
import { Handle, Position } from '@vue-flow/core';
import { SmallButton, HContainer, HandleIn, HandleOut } from '../../node_assets/n-component-imports.js';
import node_colors from '../../node-colors.js';
import FunctionBase from '../func_base.vue'
let response_id = 0;

const ext_stroke_color= node_colors.await_stroke;
const ext_bg_color= node_colors.await_bg;

const responses = ref([
])



const props = defineProps({ //this fixes the handleout ID error! by explicitly receiving the id as a prop, the id is correct from the moment of initialization! always define props!
  id: { default: -1 }, // Receives the ID from the parent
  Position: { type: Object, default: () => ({ x: 0, y: 0 }) },
});


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
    <HandleOut/>
    <FunctionBase
        display_type="Await"
        :id="id||-10"
        node_type="await"
        :bg_color="ext_bg_color"
        :stroke_color="ext_stroke_color">
        <div class="response_title">User Input</div>
        <textarea class = "user_response_text" id="textbox" placeholder="Type the expected user input here."></textarea>
    </FunctionBase>


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
        margin-top:0px;
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