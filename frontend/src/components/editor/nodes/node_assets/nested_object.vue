<script setup>
import { defineProps, ref } from 'vue';
import NestedObject from './nested_object.vue'
import { HContainer } from './n-component-imports';
import { useNodesStore } from '@/components/editor/nodes/node_store'

const NS = useNodesStore()

const displayTree = ref(true)

const props = defineProps({
    n:{
        val:{
            data:{
                object_name:"Nested Node Broken",
                nodeDepth: 0
            },
            id:-10
        },
        children:[]
    },
    isEven:true,
})


function toggleTree(){
    displayTree.value = !displayTree.value
    console.log("🪹👁️ nested_object.vue tree vis toggled")
}

</script>

<template>
<div  style="min-width:100%; width:fit-content;">
    <div v-if="isEven" class="row" @contextmenu="$emit('ov-context-clicked',n.val.id)" @click="NS.swapCanvas(n.val.id)">
        <HContainer style="width:100%" spacing="0px">

            &nbsp;
            <div v-for="i in n.val.data.nodeDepth" class="indent">●</div>
            <div v-if="n.children.length>0">
                <div class="arrow" v-if="displayTree==true" @click="toggleTree()">⏷</div>
                <div class="arrow" v-else @click="toggleTree()">⏵</div>
            </div>
            <div class="arrow-disabled" v-else>
                ⏵
            </div>
            <div class="object-name"> &nbsp {{ n.val.data.object_name }} </div>
        </HContainer>
    </div>
    <div v-else class="row-isOdd" @contextmenu="$emit('ov-context-clicked',n.val.id)" @click="NS.swapCanvas(n.val.id)">
        <HContainer style="width:100%" spacing="0px">

&nbsp;
<div v-for="i in n.val.data.nodeDepth" class="indent">●</div>
<div v-if="n.children.length>0">
    <div class="arrow" v-if="displayTree==true" @click="toggleTree()">⏷</div>
    <div class="arrow" v-else @click="toggleTree()">⏵</div>
</div>
<div class="arrow-disabled" v-else>
    ⏵
</div>
<div class="object-name"> &nbsp {{ n.val.data.object_name }} </div>
</HContainer>
    </div>
    <div v-if="displayTree==true" style="width:100%;">
        <HContainer v-for="child in n.children" spacing="0px">
            <NestedObject @ov-context-clicked="$emit('ov-context-clicked',$event)" :n="child" :isEven="!isEven"/>
        </HContainer>
    </div>
</div>

</template>

<style scoped>
    .row{
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        width:auto;
        background:rgb(88, 88, 88);
    }
    .row-isOdd{
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        width:auto;
        background:rgb(76, 76, 76);
    }
    .row:hover{
        background:rgb(96, 96, 121);

    }
    .row-isOdd:hover{
        background:rgb(111, 111, 142);

    }

    .arrow{
        color:white;
        background-color: rgb(138, 138, 138);
        height:15px;
        width:15px;
        text-align: center;
        font-size:small;
        border-radius:5px;
        line-height:15px;
    }
    .arrow:hover{
        background-color: rgb(139, 139, 139);
    }
    .object-name{
        width:max-content;
        color:white;
        display:flex;
    }

    .child-container{
        width:100%;
    }
    .object-child:nth-of-type(odd){
        background:rgb(57, 57, 57);
    }
    .object-child:nth-of-type(even){
        background:rgb(84, 84, 84);
    }
    .indent{
        height:15px;
        width:15px;
        color:rgb(145, 145, 145);
        font-size:small;
        line-height:15px;
    }
    .arrow-disabled{
        color:rgb(66, 66, 66);
        background-color: rgb(109, 109, 109);
        height:15px;
        width:15px;
        text-align: center;
        font-size:small;
        border-radius:5px;
        line-height:14px;
    }
    .vert-line{
        width:2px;
        height:100%;
        color:white;
        position:relative;
    }
</style>