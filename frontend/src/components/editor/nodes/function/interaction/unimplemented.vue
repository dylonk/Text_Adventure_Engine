<script setup>
import FunctionBase from '../func_base.vue'
import node_colors from '../../node-colors';
</script>
<template>
<FunctionBase
    type="unimplemented"
    display_type="Unimplemented, please add functionality"
    :bg_color="node_colors.unimplemented_bg"
    :stroke_color="node_colors.unimplemented_stroke"
    >
<img class="err-img" src="https://i1.sndcdn.com/artworks-000253006253-51vuix-t500x500.jpg">
</FunctionBase>
</template>
<style scoped>
.err-img{
    margin:0px !important;
}
</style>