<script setup>
import { ref, defineProps } from 'vue';
import NodeBase from '../node_base.vue'
import { Handle, Position } from '@vue-flow/core';
</script>


<template>
    <NodeBase
        display_type="Prompt"
        node_type="prompt">
            <textarea></textarea>
    </NodeBase>

</template>


<style>

</style>