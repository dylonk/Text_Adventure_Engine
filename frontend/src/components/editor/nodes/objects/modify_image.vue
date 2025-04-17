<script setup>
import { defineProps, ref, watch, computed } from 'vue'
import { useNodesStore } from '../node_store.js'
import FunctionBase from '../function/func_base.vue'
import { HandleOut, HandleIn, HContainer, VContainer } from '../node_assets/n-component-imports.js'
import node_colors from '../node-colors.js'

const props = defineProps({
  id: { default: -1 },
})

const NS = useNodesStore()

const defaultObjData = {
  display_type: "ModifyImage",
  isFunction: true,
  function_name: "modify_image",
  properties: {
    fade_enabled: false,
    fade_duration: 2000,
  },
  handles: {
    in: [{
      id: 0,
      type: "image",
      position: "left"
    }],
    out: [{
      id: 0,
      type: "image",
      position: "right"
    }]
  }
}

NS.contributeNodeData(props.id, defaultObjData)

// Reactive local inputs bound to properties
const fadeEnabled = ref(NS.getNodeData(props.id, "properties")?.fade_enabled || false)
const fadeDuration = ref(NS.getNodeData(props.id, "properties")?.fade_duration || 2000)

// Update store when inputs change
watch(fadeEnabled, (val) => {
  NS.setNodeProperty(props.id, "fade_enabled", val)
})

watch(fadeDuration, (val) => {
  NS.setNodeProperty(props.id, "fade_duration", val)
})

// Get connected image node
const getConnectedImageNode = () => {
  const node = NS.getNode(props.id)
  if (!node?.data?.inputEdges) return null
  
  // Get the first connected node
  const connectedNodeId = Object.values(node.data.inputEdges)[0]
  if (!connectedNodeId) return null
  
  const connectedNode = NS.getNode(connectedNodeId)
  return connectedNode?.type === 'image' ? connectedNode : null
}
</script>

<template>
  <FunctionBase :id="id">
    <HContainer outerMargin="5px">
      <HandleIn :id="id" />
      <VContainer outerMargin="0px">
        <div class="modify-image-controls">
          <div class="control-group">
            <label class="control-label">
              <input
                type="checkbox"
                v-model="fadeEnabled"
                class="control-checkbox"
              />
              Fade Effect
            </label>
            <div v-if="fadeEnabled" class="control-input-container">
              <input
                type="number"
                v-model="fadeDuration"
                min="100"
                max="10000"
                step="100"
                class="control-input"
                placeholder="Duration (ms)"
              />
            </div>
          </div>
        </div>
      </VContainer>
      <HandleOut :id="id" />
    </HContainer>
  </FunctionBase>
</template>

<style scoped>
.modify-image-controls {
  padding: 10px;
  background: var(--node-bg-color, #2a2a2a);
  border-radius: 6px;
  width: 100%;
  min-width: 220px;
}

.control-group {
  margin-bottom: 10px;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-color, #ffffff);
  margin-bottom: 6px;
}

.control-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--accent-color, #6366f1);
}

.control-input-container {
  margin-left: 24px;
}

.control-input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.2));
  border-radius: 4px;
  background: var(--input-bg-color, rgba(255, 255, 255, 0.1));
  color: var(--text-color, #ffffff);
  font-size: 14px;
}

.control-input:focus {
  outline: none;
  border-color: var(--accent-color, #6366f1);
}

.control-input::placeholder {
  color: var(--placeholder-color, rgba(255, 255, 255, 0.5));
}
</style> 