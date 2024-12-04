<script setup>
    import { Handle, Position } from '@vue-flow/core';
</script>
<template>
    <Handle type="target" :position="Position.Right" />
</template>
<style>
.vue-flow__handle {
    height:24px;
    width:8px;
    border-radius:4px
}
</style>