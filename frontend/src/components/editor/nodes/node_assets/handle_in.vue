<script setup>
import { Handle, Position } from '@vue-flow/core';
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
    handleID:0,
})


</script>
<template>
    <Handle :id="'in'+handleID" class="vue-flow__handle" type="target" :position="Position.Left" />
</template>
<style scoped>
.vue-flow__handle{
    /* position:relative;
    top: calc(100+calc(v-bind(handleID)*20))px; */
    border: solid blue 2px;
    background:rgb(255, 255, 255);
    height:24px;
    width:10px;
    border-radius:4px
}
</style>