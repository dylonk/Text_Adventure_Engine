<script setup>
import globalNavBar from '@/components/standardjs/navbar.vue'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute();
const basePath = '@/assets/';
const gameInfoLink = String(route.params.info);//it's all in the route params.

//im thinking that it gets the name and goes from there, finding it in the database. 
// I'm not really sure how we're loading games yet. They will probably have their own pages. BUt will the descriptions.?? much to think about
const filePath = ref(basePath + gameInfoLink + '.txt?raw');


const image = ref('');
const title = ref('');;
const creator = ref('');;
const description = ref('');;
onMounted(async () => {
  try {
    const module = await import(`@/assets/${gameInfoLink}.txt?raw`);
    const infoData = module.default;
    console.log(infoData);
    const info = infoData.split('\n');
    image.value = info[0];
    title.value = String(info[1]);
    creator.value = String(info[2]);
    description.value = String(info[3]);
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});
</script>

<template>
    <globalNavBar/>
    <div id="page">
        <div id="image"><img :src=image></div>
        <div id="lower">
          <div id="left">
            <div id="title">Game Title: {{ title }}</div>
            <div id="creator">Game Made By: {{ creator }}</div>
          </div>
          <div id="right">
            <div id="description">{{ description }}</div>
          </div>
        </div>
    </div>
</template>

<style>
#lower {
  display: flex;
  justify-content: space-between;
}

#image {
    text-align: center;
    border-bottom: 3px solid black;
    padding-bottom: 10px;
    border-bottom: 2px solid black;
    height: auto;
    max-height: 50%;
    width: 100%;
    object-fit: contain;
}

#left {
    margin-top: 1%;
    margin-left: 10%;
}

#creator {
  margin-top: 10%;
}

#right {
    margin-top: 1%;
    margin-right: 20%;
}

</style>