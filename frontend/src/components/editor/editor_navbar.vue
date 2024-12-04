<!---NOT TO BE CONFUSED WITH TOOLBOX. This is the very top bar with file and save and stuff--->
<script setup>



import { ref } from 'vue'
import { useProjectStore } from './project_store';
</script>

<template>

<div class="navbar">

</div>  
</template>

<style scoped>
.navbar {
    display: flex;
    position: sticky;
    top: 0;
    width: 100vw;
    height: max-content;
    padding: 1vh;
    background-color: rgb(64, 64, 64);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
}
</style>