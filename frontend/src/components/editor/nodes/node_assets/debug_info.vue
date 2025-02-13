<script setup>
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
    info_text:String,
})
</script>
<template>
<div class="debug-info"> {{ info_text }}
</div>
</template>
<style scoped>
.debug-info {
  margin-top: 5px;
  font-size: 12px;
  color: #555555;
  background: #f9f9f9;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>