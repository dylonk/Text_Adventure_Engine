<script setup>
import { ref, defineProps, computed } from 'vue';
const props = defineProps({
    spacing:{type:String,default:"0px"},
    outerMargin:{type:String,default:"0px"},
    justifyContent:{type:String,default:"center"}

})
</script>

<template>
<div class="v-container">
    <slot></slot>
</div>
</template>

<style scoped>
.v-container{
    margin: v-bind('outerMargin');
    width:100%;
    height:max-content;
    display:flex;
    flex-direction: column;
    justify-content: v-bind('justifyContent');
    gap:v-bind('spacing')
}
</style>