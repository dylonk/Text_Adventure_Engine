<script setup>
import { Handle, Position } from '@vue-flow/core';
import { ref, defineProps, computed } from 'vue';
import { useVueFlow } from '@vue-flow/core';
const props = defineProps({
    handleID:0
})
const { updateNodeInternals } = useVueFlow()

function onInit(){
    updateNodeInternals(['out'+props.handleID])
}
</script>


<template>
<div class="handle_container">
    <Handle :id="'out'+handleID" class="vue-flow__handle" type="source" position="right"/>
</div>

</template>
<style scoped>
.handle_container{
    padding:10px;
    position:absolute;
    right:-3px;
}
.vue-flow__handle{
    border: solid blue 2px;
    background:rgb(255, 255, 255);
    height:24px;
    width:10px;
    border-radius:4px
}

</style>