<script setup>
import { ref, defineProps, computed } from 'vue';
const props = defineProps({
    spacing:{type:String,default:"5px"},
    outerMargin:{type:String,default:"5px"}
    
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
    width:100%;
    height:max-content;
    display:flex;
    flex-direction: row;
    align-items: center;
}
.h-container>*{
    margin-right:v-bind('spacing');
}
</style>