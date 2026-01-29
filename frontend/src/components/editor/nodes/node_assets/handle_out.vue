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
        <Handle @mousedown="deleteEdges()" :id="handleTitle" class="vue-flow__handle" type="source" :position="Position.Right" />
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
    outline: solid #505050 2px;
    background:rgb(255, 255, 255);
    height:16px;
    width:12px;
    border-radius:100%;
    transition: all 0.05s ease-in-out;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.486);

}
.vue-flow__handle:hover, .vue-flow__handle:active {
    outline: solid rgb(44, 44, 255) 4px;
}
    </style>