<script lang="ts" setup>
import { Background } from '@vue-flow/background'
</script>

<template>
  <div class="dropzone-background">
    <Background :size="3" :gap="20" :height="100" :widht="100" pattern-color="#bbb" />

    <div class="overlay">
      <slot />
    </div>
  </div>
</template>
