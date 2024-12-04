<script setup>
import { ref, defineProps } from 'vue';
import NodeBase from '../node_base.vue'
import { DebugInfo } from '../node_assets/n-component-imports';

const props = defineProps({
  object_name: { type: String, default: 'Unnamed_Object' },
  id: {type:Number, default:-1}
});

let debug_message = "ID: " + id;

</script>

<template>
<NodeBase>
<DebugInfo :info_text="debug_message"></DebugInfo>
</NodeBase>
</template>

<style>

</style>