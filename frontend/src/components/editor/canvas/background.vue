<script lang="ts" setup>
import { Background } from '@vue-flow/background'
</script>

<template>
  <div class="dropzone-background">
    <Background :size="3" :gap="20" :height="100" :width="100" :pattern-color="'blue'">
    </Background>

    <div class="overlay">
      <slot />
    </div>
  </div>
</template>
<style scoped>

</style>
