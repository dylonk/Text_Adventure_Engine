<script setup>
import { defineProps, ref, defineEmits } from 'vue'; // Import defineEmits
import { useGameStore } from '../game_logic';
import PreviewObject from './preview_object.vue'
import { HContainer } from './n-component-imports';

const GL = useGameStore();
const displayTree = ref(true)

//TODO: Optimize this file so its not calling so many damn times (retrieve node in script and reference that instead of getNode every time)

const props = defineProps({
    id:0,
    nodeDepth:0,
    isEven:true,
})

function toggleTree(){
    displayTree.value = !displayTree.value
    console.log("🪹👁️ nested_object.vue tree vis toggled")
}

function setSelectedObject(){
    GL.objectViewerSelected = Number(props.id)
}


</script>

<template>
<div v-if="GL.getNode(id)!=null"  style="min-width:100%; width:fit-content;">

    <div v-if="id == GL.objectViewerSelected" class="row-Selected"  @click="setSelectedObject()">
        <HContainer style="width:100%;" spacing="0px">

            &nbsp;
            <div v-for="i in nodeDepth" class="indent">●</div>
            <div v-if="GL.getNode(id).n.length>0">
                <div class="arrow" v-if="displayTree==true" @click="toggleTree()">⏷</div>
                <div class="arrow" v-else @click="toggleTree()">⏵</div>
            </div>
            <div class="arrow-disabled" v-else>
                ⏵
            </div>
            <div class="object-name"> &nbsp {{ GL.getNode(id).objectName }} </div>
            <div v-if="GL.getNode(id).display_type === 'Image' && GL.getNode(id).properties?.imgur_link" class="image-preview-container">
                <img :src="GL.getNode(id).properties.imgur_link" class="preview-image" :alt="GL.getNode(id).objectName" />
            </div>
        </HContainer>
    </div>
    <div v-else-if="id == GL.canvasID" class="row-active"  @click="setSelectedObject()">
        <HContainer style="width:100%;" spacing="0px">

            &nbsp;
            <div v-for="i in nodeDepth" class="indent">●</div>
            <div v-if="GL.getNode(id).n.length>0">
                <div class="arrow" v-if="displayTree==true" @click="toggleTree()">⏷</div>
                <div class="arrow" v-else @click="toggleTree()">⏵</div>
            </div>
            <div class="arrow-disabled" v-else>
                ⏵
            </div>
            <div class="object-name"> &nbsp {{ GL.getNode(id).objectName }} </div>
            <div v-if="GL.getNode(id).display_type === 'Image' && GL.getNode(id).properties?.imgur_link" class="image-preview-container">
                <img :src="GL.getNode(id).properties.imgur_link" class="preview-image" :alt="GL.getNode(id).objectName" />
            </div>
        </HContainer>
    </div>
    <div v-else-if="GL.getNode(id).inScope" class="row-inScope"  @click="setSelectedObject()">
        <HContainer  style="width:100%;" spacing="0px">

            &nbsp;
            <div v-for="i in nodeDepth" class="indent">●</div>
            <div v-if="GL.getNode(id).n.length>0">
                <div class="arrow" v-if="displayTree==true" @click="toggleTree()">⏷</div>
                <div class="arrow" v-else @click="toggleTree()">⏵</div>
            </div>
            <div class="arrow-disabled" v-else>
                ⏵
            </div>
            <div class="object-name"> &nbsp {{ GL.getNode(id).objectName }} </div>
            <div v-if="GL.getNode(id).display_type === 'Image' && GL.getNode(id).properties?.imgur_link" class="image-preview-container">
                <img :src="GL.getNode(id).properties.imgur_link" class="preview-image" :alt="GL.getNode(id).objectName" />
            </div>
        </HContainer>
    </div>
    <div v-else-if="isEven" class="row"  @click="setSelectedObject()">
        <HContainer  style="width:100%;" spacing="0px">

            &nbsp;
            <div v-for="i in nodeDepth" class="indent">●</div>
            <div v-if="GL.getNode(id).n.length>0">
                <div class="arrow" v-if="displayTree==true" @click="toggleTree()">⏷</div>
                <div class="arrow" v-else @click="toggleTree()">⏵</div>
            </div>
            <div class="arrow-disabled" v-else>
                ⏵
            </div>
            <div class="object-name"> &nbsp {{ GL.getNode(id).objectName }} </div>
            <div v-if="GL.getNode(id).display_type === 'Image' && GL.getNode(id).properties?.imgur_link" class="image-preview-container">
                <img :src="GL.getNode(id).properties.imgur_link" class="preview-image" :alt="GL.getNode(id).objectName" />
            </div>
        </HContainer>
    </div>
    <div v-else class="row-isOdd"  @click="setSelectedObject()">
        <HContainer  style="width:100%;" spacing="0px">

            &nbsp;
            <div v-for="i in nodeDepth" class="indent">●</div>
            <div v-if="GL.getNode(id).n.length>0">
                <div class="arrow" v-if="displayTree==true" @click="toggleTree()">⏷</div>
                <div class="arrow" v-else @click="toggleTree()">⏵</div>
            </div>
            <div class="arrow-disabled" v-else>
                ⏵
            </div>
            <div class="object-name"> &nbsp {{ GL.getNode(id).objectName }} </div>
            <div v-if="GL.getNode(id).display_type === 'Image' && GL.getNode(id).properties?.imgur_link" class="image-preview-container">
                <img :src="GL.getNode(id).properties.imgur_link" class="preview-image" :alt="GL.getNode(id).objectName" />
            </div>
        </HContainer>
    </div>
    <div v-if="displayTree==true" style="width:100%;">
        <HContainer v-for="childID in GL.getNode(id).n"  style="min-width:100%; width:fit-content;" spacing="0px">
            <div v-if="GL.getNode(childID).isObject==true" style="min-width:100%;">
                <PreviewObject :id="childID" :isEven="!isEven" :nodeDepth="nodeDepth+1"/>
            </div>
        </HContainer>
    </div>
</div>

</template>

<style scoped>
    .row-Selected{
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        width:100%;
        background:rgb(137, 204, 203);
    }
    .row{
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        width:100%;
        background:rgb(255, 255, 255);
    }
    .row-inScope{
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        width:100%;
        background:rgb(193, 237, 208);
    }
    .row-active{
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        width:100%;
        background:rgb(254, 240, 189);
    }
    .row-isOdd{
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        width:100%;
        background:rgb(236, 236, 236);
    }
    .row:hover{
        background:rgb(202, 202, 229);


    }
    .row-isOdd:hover{
        background:rgb(206, 206, 228);

    }
    .row-active:hover{
        background:rgb(224, 228, 206);

    }
    .row-Selected:hover{
        background:rgb(146, 180, 204);
    }
    .row-inScope:hover{
        background:rgb(163, 217, 200);
    }

    .arrow{
        color:rgb(81, 81, 81);
        background-color: rgb(213, 213, 213);
        height:15px;
        width:15px;
        text-align: center;
        font-size:small;
        border-radius:5px;
        line-height:15px;
    }
    .arrow:hover{
        background-color: rgb(171, 171, 171);
    }
    .object-name{
        width:max-content;
        color:black;
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
        color:rgb(115, 115, 115);
        font-size:small;
        line-height:15px;
    }
    .arrow-disabled{
        color:rgb(69, 69, 69);
        background-color: rgb(140, 140, 140);
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
    .preview-image {
        max-width: 100px;
        max-height: 100px;
        object-fit: contain;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-left: 10px;
    }

    .image-preview-container {
        display: flex;
        align-items: center;
        margin-left: auto;
        padding-right: 10px;
    }
</style>