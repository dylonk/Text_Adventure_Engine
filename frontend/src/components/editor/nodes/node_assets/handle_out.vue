<script setup>
import { Handle, Position } from '@vue-flow/core';
import { ref, defineProps, computed } from 'vue';
const props = defineProps({
    handleID:0
})
console.log(props.handleID);
</script>


<template>
    <Handle :id="'out'+handleID" class="vue-flow__handle" type="source" :position="Position.Right" />

</template>
<style scoped>
.vue-flow__handle{
    border: solid blue 2px;
    background:rgb(255, 255, 255);
    height:24px;
    width:10px;
    border-radius:4px
}

</style>