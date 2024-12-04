<script>
import { ref, defineProps, computed } from 'vue';
const props = defineProps({
    spacing:String,
})
</script>

<template>
<div class="h-container">
    <slot></slot>
</div>
</template>

<style scoped>
.h-container{
    width:max-content;
    height:max-content;
    display:flex;
    flex-direction: row;
}
.h-container>*{
    margin-right:v-bind('spacing');
}
</style>