<script setup>
import { defineProps, ref, watch, computed, onMounted } from 'vue'
import { useNodesStore } from '../node_store.js'
import FunctionBase from '../function/func_base.vue'
import CameraImage from '../../../../assets/Images/camera.png'
import { HandleOut, HandleIn, HContainer, VContainer,SmallButton, Dropdown } from '../node_assets/n-component-imports.js'

const props = defineProps({
  id: { default: -1 },
})

const NS = useNodesStore()

const defaultObjData = {
  display_type: "Image",
  function_name: "image",
}

NS.contributeNodeData(props.id, defaultObjData)


// Reactive local input bound to property
const imgSrc = ref(CameraImage)
const inputLink = ref("")
const lastImgAdded = ref("")

function addImage(){
  if(inputLink.value==""){
    alert("No image link present")
    return;
  }
  const imageName = prompt("Create a unique name for your image")
  if(imageName==null){
    alert("Image name cannot be empty")
    return;
  }
  NS.pushProjectImage(imageName,inputLink.value)
  inputLink.value = ""
  lastImgAdded.value=imageName
}
function updateImgSrc(imageName){
  imgSrc.value = NS.getProjectImageLink(imageName)
  console.log("[EDITOR] Image source updated:", imageName, imgSrc.value)
}
onMounted(()=>{
  console.log("Mounted, ",NS.getParam(props.id,"Image_Selection_dropdown")[0])
  imgSrc.value = NS.getProjectImageLink(NS.getParam(props.id,"Image_Selection_dropdown")[0])
})
</script>

<template>
  <FunctionBase :id="id">
    <HContainer outerMargin="5px">
      <HandleIn :id="id" />
    <VContainer>
      <div class="image-preview">
        <img v-if="imgSrc"
          :src="imgSrc"
          alt="Imgur Image"
          class="image-preview"
        />
        <div v-else class="italic text-xs text-gray-400 text-center p-2" style="background:#2a2a2a; color:white; padding:2px;border-radius:3px">
          No image set. Select an image below.
        </div>
      </div>
      <Dropdown dropdownType="images" :id="id" title="Image Selection" @dropdown-updated="(name) => updateImgSrc(name)" displayHorizontal="true"></Dropdown>
        <div style="border:#808080 solid 1px;border-radius:5px;">
          <VContainer style="padding:10px;">
          <div style="color:black;">Add a new image</div>
          <HContainer>
            <input
            class="nodrag"
            v-model="inputLink"
            placeholder="Paste an Imgur .jpg or .png URL"
            />

            <SmallButton :id="id" text="Enter" :defaultSelection="lastImgAdded" @click="addImage()"></SmallButton>
          </HContainer>
          </VContainer>

      </div>
    </VContainer>
    <HandleOut :id="id" />
  </HContainer>
  </FunctionBase>
</template>

<style scoped>
.image-preview {
  width: 100%;
  height: 100px;
  object-fit: contain;
  background: #2b2b2b;
  border-radius: 4px;
}
</style>
