<script setup>
import { ref, defineProps } from 'vue';
import NodeBase from '../node_base.vue'
import { Handle, Position } from '@vue-flow/core';
</script>


<template>
    <NodeBase
        node_title="Prompt"
        node_type="prompt">
            <textarea></textarea>
    </NodeBase>

</template>


<style>

</style>