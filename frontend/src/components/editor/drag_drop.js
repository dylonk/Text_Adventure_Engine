import { useVueFlow } from '@vue-flow/core';
import { ref, watch } from 'vue';
import { useNodesStore } from './nodes/stores/node_store.js';

let id = 1;

function getId() {
  return id++;
}

const state = {
  draggedType: ref(null),
  isDragOver: ref(false),
  isDragging: ref(false),
  hoveredNode: ref(null), // Track the node being hovered over
};

export default function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging, hoveredNode } = state;
  const nodesStore = useNodesStore();
  const { addNodes, screenToFlowCoordinate, updateNode, onNodesInitialized } = useVueFlow();

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : '';
  });

  function onDragStart(event, type) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type);
      event.dataTransfer.effectAllowed = 'move';
    }
    draggedType.value = type;
    isDragging.value = true;
    console.log('Drag started with type:', draggedType.value);

    document.addEventListener('drop', onDragEnd);
  }

  function onDragOver(event) {
    event.preventDefault();

    if (draggedType.value) {
      isDragOver.value = true;

      // Get the current mouse position in flow coordinates
      const pos = screenToFlowCoordinate({ x: event.clientX, y: event.clientY });
      const nodes = nodesStore.getAllNodes();

      // Check if the position is over an existing node
      const hovered = nodes.find(
        (node) =>
          pos.x >= node.position.x &&
          pos.x <= node.position.x + (node.width || 100) &&
          pos.y >= node.position.y &&
          pos.y <= node.position.y + (node.height || 100)
      );

      if (hovered) {
        hoveredNode.value = hovered;
        console.log(`Hovering over node: ${hovered.id}`);
      } else {
        hoveredNode.value = null;
      }

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    }
  }

  function onDragLeave() {
    isDragOver.value = false;
    hoveredNode.value = null; // Clear the hovered node
  }

  function onDragEnd() {
    isDragging.value = false;
    isDragOver.value = false;
    draggedType.value = null;
    hoveredNode.value = null; // Clear the hovered node
    document.removeEventListener('drop', onDragEnd);
  }

  function onDrop(event) {
    const pos = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    });

    const nodeType = draggedType.value;
    const nodeId = getId();

    const newNode = {
      type: nodeType,
      id: nodeId.toString(), // Ensure the ID is a string
      position: pos,
      expandParent: true,
      width: 100, // Default width
      height: 100, // Default height
      parentId: null, // Default to no parent
      draggable: true, // Default to draggable
    };

    if (hoveredNode.value) {
      // Nest the new node under the parent node
      newNode.parentId = hoveredNode.value.id;
      newNode.extent = 'parent'; // Ensures the child moves with the parent
      newNode.draggable = false; // Optionally disable dragging for child nodes
      console.log(`Nesting node ${nodeId} under parent ${hoveredNode.value.id}`);

      // Verification log to ensure correct parent assignment
      if (newNode.parentId === hoveredNode.value.id) {
        console.log(`Node ${newNode.id} successfully nested under parent ${hoveredNode.value.id}.`);
      } else {
        console.error(`Failed to nest node ${newNode.id} under parent ${hoveredNode.value.id}.`);
      }
    }

    // Add the node to the store
    nodesStore.addNode(newNode);

    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: {
          x: node.position.x - node.dimensions.width / 2,
          y: node.position.y - node.dimensions.height / 2,
        },
      }));
      off();
    });

    addNodes(newNode);

    // Debugging log: Verify the current state of all nodes
    console.log('All nodes after drop:', nodesStore.getAllNodes());

    // Clear the hovered node and dragged state
    hoveredNode.value = null;
    draggedType.value = null;
    isDragOver.value = false;
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    hoveredNode,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDragEnd,
    onDrop,
  };
}
