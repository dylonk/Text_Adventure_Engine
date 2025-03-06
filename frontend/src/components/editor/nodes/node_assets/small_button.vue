<script setup>
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
    id: -10,
    text:String,
    style_selection:0,
})
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()

</script>
<template>
<button class="small_button">{{ text }}</button>
</template>
<style scoped>
    .small_button{
        height:20px;
        width:20px;
        color: v-bind('NS.getNode(id).data.fg_color');
        font-weight: 800;
        background:v-bind('NS.getNode(id).data.bg_color');
        border:v-bind('NS.getNode(id).data.fg_color') solid 1px;
        border-top:white solid 1px;
        border-left: white solid 1px;
        border-radius: 3px;
        filter: brightness(120%);
        text-shadow: 1px 1px white; 
    }
    .small_button:hover{
        filter: brightness(140%);
    }
    .small_button_s1{
        height:20px;
        width:20px;
        color: white;
        font-weight: 800;
        border:v-bind('NS.getNode(id).data.fg_color') solid 1px;
        border-top:none;
        border-radius: 3px;
        background-image:linear-gradient(180deg,v-bind('NS.getNode(id).data.bg_color'),v-bind('NS.getNode(id).data.fg_color'));
    }
    .small_button_s1:hover{
        background-image: linear-gradient(180deg,v-bind('NS.getNode(id).data.bg_color'), v-bind('NS.getNode(id).data.fg_color'),v-bind('NS.getNode(id).data.fg_color'));
    }
</style>