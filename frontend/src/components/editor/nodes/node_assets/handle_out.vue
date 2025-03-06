<script setup>
import { Handle, Position } from '@vue-flow/core';
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
    id: -10,
})
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()

const handleTitle = ref("badhandle")
handleTitle.value = NS.addHandle(props.id,'source')


</script>


<template>
    <div class="handle-container">
        <Handle :id="handleTitle" class="vue-flow__handle" type="source" :position="Position.Right" />
    </div>
</template>
<style scoped>
.handle-container{
    position:absolute;
    margin:0px;
    padding:0px;
    right:10px;
    width: 0px;
    height: 0px;
}
.vue-flow__handle{
    position:relative;
    border: solid blue 2px;
    background:rgb(255, 255, 255);
    height:24px;
    width:10px;
    border-radius:4px
}
</style>