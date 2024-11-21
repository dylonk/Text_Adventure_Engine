import { reactive } from 'vue';

export const useNodesStore = () => {
  const nodes = reactive({
    rooms: [],
    items: [],
    prompts: [],
  });

  const addNode = (node) => {
    const nodeExists = [...nodes.rooms, ...nodes.items, ...nodes.prompts].find((n) => n.id === node.id);
    if (!node.id || nodeExists) {
      console.error(`Node with id ${node.id} already exists`);
      return;
    }

    if (node.type === 'room') {
      nodes.rooms.push(node);
    } else if (node.type === 'item') {
      nodes.items.push(node);
    } else if (node.type === 'prompt') {
      nodes.prompts.push(node);
    }
  };

  const getAllNodes = () => [...nodes.rooms, ...nodes.items, ...nodes.prompts];

  const getChildNodes = (parentId) => {
    return getAllNodes().filter((node) => node.parentId === parentId);
  };

  const updateNodePosition = (nodeId, deltaX, deltaY) => {
    const node = getAllNodes().find((n) => n.id === nodeId);
    if (node) {
      node.position.x += deltaX;
      node.position.y += deltaY;

      // Move child nodes recursively
      const childNodes = getChildNodes(node.id);
      childNodes.forEach((child) => updateNodePosition(child.id, deltaX, deltaY));
    } else {
      console.error(`Node with id ${nodeId} not found`);
    }
  };

  return {
    nodes,
    addNode,
    getAllNodes,
    getChildNodes,
    updateNodePosition,
  };
};
