<script setup>
    import { ref } from 'vue'
    import Toolbar  from './toolbox.vue'
    import Canvas from './canvas/canvas.vue'
</script>
<!---This is the outermost layer of the editor--->
<template>
    <div class="editor-container">
        <Toolbar />
        <Canvas />
    </div>
</template>

<style scoped>
*{
    font-family: Arial, Helvetica, sans-serif;
    font-size:12px;
    color:black;
}

.editor-container{
    width:100vw;
    height:100vh;
    display:flex;
    flex-direction:row;
    background:white;
}
</style>