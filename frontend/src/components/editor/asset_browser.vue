<script setup>

const GlobaLNodes = {}
</script>

<template>
    <div class="asset_browser_container">
        <a class="ab_title">Asset Browser</a>
        <div class="assets">
            <div class="asset">Global</div>
        </div>
    </div>
</template>

<style scoped>
    .asset_browser_container{
        display:flex;
        flex-direction: column;
        width:15%;
        background:rgb(95, 95, 95);
    }
    .assets{
        height:100%;
        display:flex;
        flex-direction: column;
        background: rgb(71, 71, 71);
        border: 2px solid rgb(49, 49, 49);
        margin:8px;
        margin-top:2px;
        border-radius:4px;
    }
    .asset{
        padding:3px;
        padding-left:6px;
        padding-right:6px;
        text-align: left;
        color:rgb(163, 163, 163);
        font-size: medium;
        border-bottom: 2px solid rgb(87, 87, 87);
    }
    .ab_title{
        text-align: center;
        color:rgb(220, 220, 220);
        font-size: medium;
    }
</style>