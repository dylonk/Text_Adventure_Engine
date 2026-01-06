<script setup>
import { Handle, Position } from '@vue-flow/core';
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
    id: -10,
    hasConnection: false,
})
import { useNodesStore } from '@/components/editor/nodes/node_store'
const NS = useNodesStore()

const handleTitle = ref("badhandle")
handleTitle.value = NS.addHandle(props.id,'source')


//trying out a similar function to that found in handle_in, only with handle_out. This is so when an out handle is deleted
function deleteEdges(){
    NS.deleteEdgeByHandle(handleTitle.value)
}

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
    right:12px;
    width: 0px;
    height: 0px;
}
.vue-flow__handle{
    position:relative;
    outline: solid rgb(0, 0, 0) 2px;
    background:rgb(255, 255, 255);
    height:16px;
    width:12px;
    border-radius:100%;
}
    </style>