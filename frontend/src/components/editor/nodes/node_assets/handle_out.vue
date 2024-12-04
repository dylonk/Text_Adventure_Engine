<script setup>
import { Handle, Position } from '@vue-flow/core';
</script>
<template>
    <Handle class="vue-flow__handle" type="source" :position="Position.Left" />
</template>
<style>
.vue-flow__handle{
    border: solid black 1px;
    background:rgb(255, 255, 255);
    height:24px;
    width:8px;
    border-radius:4px
}
</style>