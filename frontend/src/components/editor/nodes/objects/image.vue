<script setup>
import { defineProps, ref, watch, computed } from 'vue'
import { useNodesStore } from '../node_store.js'
import FunctionBase from '../function/func_base.vue'
import { HandleOut, HandleIn, HContainer, VContainer } from '../node_assets/n-component-imports.js'

const props = defineProps({
  id: { default: -1 },
})

const NS = useNodesStore()

const defaultObjData = {
  display_type: "Image",
  properties: {
    imgur_link: "",
  },
}

NS.contributeNodeData(props.id, defaultObjData, true)

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
