<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
import Editor from '@/components/editor/Editor.vue'

function goToCreate() {
      this.$router.push('/create')
}
</script>
<template>
    <globalNavBar></globalNavBar>
<body class="create-container">
    <Editor/>
</body>
</template>
<style scoped>
.create-container{
    width:100dvw;
    display:flex;
    flex-direction: column;
    flex: 1;
}

</style>