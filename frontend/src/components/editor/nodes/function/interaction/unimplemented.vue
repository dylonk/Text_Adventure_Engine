<script setup>
import NodeBase from '../../node_base.vue';
import node_colors from '../../node-colors';
</script>
<template>
<NodeBase
    node_type="unimplemented"
    display_type="Unimplemented, please add functionality"
    :bg_color="node_colors.unimplemented_bg"
    :stroke_color="node_colors.unimplemented_stroke"
    >
<img class="err-img" src="https://i1.sndcdn.com/artworks-000253006253-51vuix-t500x500.jpg">
</NodeBase>
</template>
<style scoped>
.err-img{
    margin:0px !important;
}
</style>