<script setup>
import { ref, defineProps } from 'vue';
import NodeBase from '../node_base.vue'
const props = defineProps({
  name: { type: String, default: 'NULL_OBJ_NAME' },
});
</script>

<template>
<NodeBase>
</NodeBase>
</template>

<style>

</style>