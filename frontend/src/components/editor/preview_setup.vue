

<script setup>
import { HContainer, VContainer } from './nodes/node_assets/n-component-imports';
import { useGameStore } from './nodes/game_logic';

const GL = useGameStore()

function setProperty(property, input){
    let selectedNode = GL.getNode(Number(GL.objectViewerSelected))
    selectedNode.properties[property]=input
    GL.updateNode(selectedNode)
}
</script>
<template> 
    <div class="mod-panel" v-if="GL.initialized">
        <VContainer>
            <VContainer spacing="0px">
                <h3 style="background:rgb(60,60,60);font-weight: bold;font-size:large; padding-left:5px;">Modification Panel</h3>
                <hr>
                <VContainer>
                    <div class="mod-subpanel">
                        <h3>Presets</h3>
                    </div>
                    <div class="mod-subpanel" style="height:100%">
                        <h3>Properties</h3>
                        <h3 style="background-color:#8cbc75; color:white; font-weight:bold;font-size:large;">{{GL.getNode(Number(GL.objectViewerSelected)).objectName}}</h3>
                        <div class="property-title"></div>
                        <div v-for="(value,property) in GL.getNode(Number(GL.objectViewerSelected), true).properties">
                            <HContainer style="border-bottom:1px rgb(200,200,200) solid;">
                            <div class="property-title">{{ property }}</div>
                            <input class="property-input" :value="value" @input="setProperty(property,$event.target.value);">
                            </HContainer>
                        </div>
                    </div>
                </VContainer>
            </VContainer>
        </VContainer>
    </div>
</template>
<style scoped>
    .mod-panel{
        background: rgb(227, 227, 227);
        width:220px;
        height:100%;
    }
    .mod-panel hr{
        border-top: groove 3px rgb(225, 225, 225);
    }
    .mod-title{
        height:20px;
        width:100%;
        background:rgb(85, 85, 85);
    }
    .mod-subpanel{
        height:200px;
        background:rgb(241, 241, 241);
        overflow-y:auto;
    }
    h3{
        color:rgb(255, 255, 255);
        padding:2px;
        padding-left:3px;
        background:rgb(129, 129, 129);
        font-size:small;
    }
    .object-name{
        color:white;
        background-color: ;
    }
    .property-input{
        width:50%;
        border:none;
    }
    .property-title{
        color:black;
        font-weight:bold;
        width:50%;
        padding-left:3px;
    }
</style>