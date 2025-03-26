<script setup>
import { ref, defineProps, computed } from 'vue';
const props = defineProps({
    spacing:{type:String,default:"5px"},
    outerMargin:{type:String,default:"0px"}
    
})
</script>

<template>
<div class="h-container">
    <slot></slot>
</div>
</template>

<style scoped>
.h-container{
    margin: v-bind('outerMargin');
    width:auto;
    height:max-content;
    display:flex;
    flex-direction: row;
    align-items: center;
    gap:v-bind('spacing')
}
</style>