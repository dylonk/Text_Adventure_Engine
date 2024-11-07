<script lang="ts" setup>
import { Background } from '@vue-flow/background'
</script>

<template>
  <div class="dropzone-background">
    <Background :size="2" :gap="20" :height="100" :widht="100" pattern-color="#a5bacc" />

    <div class="overlay">
      <slot />
    </div>
  </div>
</template>
