<script setup>
    import { ref, provide } from 'vue'
    import Toolbox  from './toolbox.vue'
    import Canvas from './canvas/canvas.vue'
    import AssetBrowser from './asset_browser.vue'
    import globalNavBar from '@/components/standardjs/navbar.vue'
    import Toolbar from './toolbar.vue'
    import CanvasSelector from './canvasSelector.vue'



    function updateAssets(){
    }
</script>
<!---This is the outermost layer of the editor--->
<template>
        <Toolbar/>
    <div class="editor-container">
        <Toolbox />
        <CanvasSelector/>
        <Canvas />
        <AssetBrowser />
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
    max-height: 100vh !important;
    display:flex;
    flex-direction:row;
    background:white;
    overflow:hidden;
}
.editor_topbar{
    width:100%;
    height:min-content;
    font-size: 12px;
    background-image: linear-gradient(180deg,gray,white);
    border-bottom: darkslategray solid 2px;
}

</style>