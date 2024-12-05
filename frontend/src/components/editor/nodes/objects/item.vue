<template>
  <div
    class="item-node"
    :style="nodeStyle"
    @mousedown="handleMouseDown"
  >
    <span>{{ nodeTitle }}</span>
    <div v-if="node && node.children && node.children.length" class="children-container">
      <div
        v-for="childId in node.children"
        :key="childId"
        class="child-node"
      >
        {{ getNode(childId)?.node_title || "Unnamed Node" }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useNodesStore } from "../../node_store.js";

export default defineComponent({
  name: "ItemNode",
  props: {
    nodeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const nodesStore = useNodesStore();
    const node = computed(() => nodesStore.getNode(props.nodeId));

    const nodeTitle = computed(() => node.value?.node_title || "Unnamed Node");
    const nodeStyle = computed(() => ({
      backgroundColor: "#ffb86d",
      borderColor: "#633555",
    }));

    function getNode(childId) {
      return nodesStore.getNode(childId);
    }

    function handleMouseDown(event) {
      console.log(`Node ${props.nodeId} clicked`);
      event.stopPropagation();
    }

    return {
      nodeTitle,
      nodeStyle,
      node,
      getNode,
    };
  },
});
</script>

<style scoped>
.item-node {
  position: absolute;
  padding: 10px;
  border: 2px solid;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}
.children-container {
  margin-top: 10px;
  padding: 5px;
  border-top: 1px solid #ddd;
}
.child-node {
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #aaa;
  border-radius: 3px;
  background-color: #eee;
}
</style>
