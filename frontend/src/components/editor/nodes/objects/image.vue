<script setup>
import { defineProps, ref, watch, computed } from 'vue'
import { useNodesStore } from '../node_store.js'
import FunctionBase from '../function/func_base.vue'
import { HandleOut, HandleIn, HContainer, VContainer,SmallButton } from '../node_assets/n-component-imports.js'

const props = defineProps({
  id: { default: -1 },
})

const NS = useNodesStore()

const defaultObjData = {
  display_type: "Image",
  function_name: "image",
  selectedImage: null,
}
const imageName = {
  paramName: "imageName",
  params: []
}


NS.contributeFunctionParameters(props.id,imageName.paramName,imageName.params); // a little confusing, but this adds 1 param to function_params in the style [response_textboxes(name), textbox1(parameter index 0),textbox2(parameter index 1)]

NS.contributeNodeData(props.id, defaultObjData)

// Reactive local input bound to property
const imgurLink = ref(NS.getNodeData(props.id, "properties")?.imgur_link || "")

// Update store when input changes
watch(imgurLink, (val) => {
  NS.setNodeProperty(props.id, "imgur_link", val)
})

const imgurURL = computed(() => imgurLink.value)
</script>

<template>
  <FunctionBase :id="id">
    <HContainer outerMargin="5px">
      <HandleIn :id="id" />
    <VContainer outerMargin="0px">
      <SmallButton :id="id" text="Add Image"></SmallButton>
      <img
        v-if="imgurURL"
        :src="imgurURL"
        alt="Imgur Image"
        class="image-preview"
      />

      <div v-else class="italic text-xs text-gray-400 text-center p-2">
        No image set. Provide an Imgur link.
      </div>
      <input
        v-model="imgurLink"
        placeholder="Paste an Imgur .jpg or .png URL"
        class="w-full border p-1 rounded text-sm"
      />

    </VContainer>
    <HandleOut :id="id" />
  </HContainer>
  </FunctionBase>
</template>

<style scoped>
.image-preview {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
