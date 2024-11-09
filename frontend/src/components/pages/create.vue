<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
import Editor from '@/components/editor/editor.vue'

function goToCreate() {
      this.$router.push('/create')
}
</script>
<template>
<body class="create-container">
    <globalNavBar/>
    <Editor/>
</body>
</template>
<style scoped>
.create-container{
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction: column;
}

</style>