<script setup>
import { Handle, Position } from '@vue-flow/core';
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
    id: -10,
})
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()
const handleTitle = ref("badhandle")

handleTitle.value = NS.addHandle(props.id,'target')
function deleteEdges(){
    NS.deleteEdgeByHandle(handleTitle.value)
}
</script>


<template>
    <div class="handle-container">
        <Handle @click="deleteEdges()" :id="handleTitle" class="vue-flow__handle" type="target" :position="Position.Left" />
    </div>
</template>
<style scoped>
.handle-container{
    position:absolute;
    margin:0px;
    padding:0px;
    left:0px;
    width: 0px;
    height: 0px;
}
.vue-flow__handle{
    position:relative;
    outline: solid #a852ac 2px;
    background:rgb(255, 255, 255);
    height:16px;
    width:12px;
    border-radius:100%;
    transition: all 0.05s ease-in-out;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.486);
}
.vue-flow__handle:hover{
    outline: solid rgb(255, 44, 44) 4px;
}
</style>