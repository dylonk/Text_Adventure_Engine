<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
import Editor from '@/components/editor/editor.vue'

function goToCreate() {
      this.$router.push('/create')
}
</script>
<template>
    <globalNavBar/>
    <Editor/>
</template>
<style>

</style>