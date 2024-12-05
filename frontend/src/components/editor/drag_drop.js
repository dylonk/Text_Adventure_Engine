import { useVueFlow } from '@vue-flow/core';
import { ref, watch } from 'vue';
import { useNodesStore } from './node_store.js';

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
  const { addNodes, screenToFlowCoordinate, updateNode } = useVueFlow();

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

      const pos = screenToFlowCoordinate({ x: event.clientX, y: event.clientY });
      const nodes = nodesStore.getAllNodes();

      // Detect if the drag is hovering over another node
      const hovered = nodes.find(
        (node) =>
          pos.x >= node.position.x &&
          pos.x <= node.position.x + (node.width || 150) &&
          pos.y >= node.position.y &&
          pos.y <= node.position.y + (node.height || 150)
      );

      hoveredNode.value = hovered || null; // Update the hovered node state
      if (hovered) {
        console.log(`Hovering over node: ${hovered.id}`);
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
      id: nodeId.toString(),
      position: pos,
      expandParent: true,
      width: 150,
      height: 150,
      extent: 'parent',
      parentNode: null, // Default to no parent
      draggable: true,
      style: { width: '150px', height: '150px' },
    };

    if (hoveredNode.value) {
      // If dropping onto another node, set it as the parent
      newNode.parentNode = hoveredNode.value.id;
      newNode.extent = 'parent';
      newNode.draggable = false; // Disable dragging for nested nodes
      console.log(`Nesting node ${newNode.id} under parent ${hoveredNode.value.id}`);
    }

    nodesStore.addNode(newNode);
    addNodes(newNode);

    // Clear drag state
    hoveredNode.value = null;
    draggedType.value = null;
    isDragOver.value = false;

    console.log('Node added:', newNode);
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
