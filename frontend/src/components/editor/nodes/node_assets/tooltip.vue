<script setup>
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
    tooltip_info:String,
})
</script>
<template>
<div class="tooltip-container"> Tooltip: {{ tooltip_info }}
</div>
</template>
<style scoped>
.tooltip-container {
  background:rgb(248, 255, 122);
  border: black 2px solid;
  position:fixed;
  width:min-content;
  height:min-content;
  max-width: 200px;
  padding:10px;
  left:200px;
  top:100px;
  text-shadow:none;
  color:black;
  font-weight: 600;
  z-index:100;
}
</style>