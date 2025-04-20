<!---Each canvas is a component of an "Object". The world editor is a canvas that is a component of the global object-->
<script setup>
import { ref, markRaw,computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useVueFlow,VueFlow, ConnectionMode,applyNodeChanges, applyEdgeChanges } from '@vue-flow/core';
import CanvasBackground from './background.vue'
import CanvasControls from './controls.vue'
import useDragAndDrop from '../drag_drop.js';
import { useNodesStore } from "../nodes/node_store.js"
import { useProjectStore } from '../project_store';
import ContextMenu from '../context_menu.vue';

const { screenToFlowCoordinate} = useVueFlow()
// NEWNODEREQ
import { PromptNode, OutputNode, StartNode, RoomNode, ItemNode, NpcNode, PlayerNode, PathwayNode, UnimplementedNode, CustomNode, AwaitNode, ActionNode, ImageNode, ModifyImageNode} from '../nodes/n-imports';

    const nodeTypes = {
        start: markRaw(StartNode),
        prompt: markRaw(PromptNode),
        room: markRaw(RoomNode),
        item: markRaw(ItemNode),
        npc: markRaw(NpcNode),
        pathway: markRaw(PathwayNode),
        custom: markRaw(CustomNode),
        await: markRaw(AwaitNode),
        action: markRaw(ActionNode),
        player: markRaw(PlayerNode),
        unimplemented: markRaw(UnimplementedNode),
        image: markRaw(ImageNode),
        output: markRaw(OutputNode),
        modify_image: markRaw(ModifyImageNode),
    }

// Pinia store
const nodesStore = useNodesStore();


//contextmenu stuff
const isContextMenuVisible = ref(false)
const contextMenuId = ref(null)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuActions=ref()


const actionsByType = {

//these are actions that can be taken when clicking an empty space on the canvas. for now, paste.
canvasActions: [
  {label: 'Paste', action: () => nodesStore.pasteNode(contextMenuPosition.value.x,contextMenuPosition.value.y) },
],
//these are actions that all objects have. Rename node for now.
objectActions: [
  {label: 'Rename', action: () => nodesStore.renameNode(contextMenuId.value) },
]

//later we can have actions for specific node types. I just don't know of any right now.
//it will probably be mostly function nodes, considering objects are essentially all the same.
}


function showContextMenu(event) {
  console.log("Context Menu Triggered:");
  
  // Use raw screen coordinates (NOT screenToFlowCoordinate)
  contextMenuPosition.value = {
    x: event.clientX,
    y: event.clientY,
  };

  event.preventDefault(); // prevents browser's right-click menu
  console.log("context menu position is ", contextMenuPosition.value);
  isContextMenuVisible.value = true;

  contextMenuActions.value = [...actionsByType.canvasActions];
}
// Handle action for context menu
function handleContextMenuAction(action) {
    console.log(action);
  action.action()
  isContextMenuVisible.value = false
}

// Close the context menu
function closeContextMenu() {
  isContextMenuVisible.value = false
}



const handleCtrlS = () => {
  useProjectStore().exportProject();
  console.log('Ctrl + S pressed');
};

const keydownHandler = (event) => {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleCtrlS();
    }
};
onMounted(() => {
    document.addEventListener('keydown', keydownHandler);
});
onBeforeUnmount(() => {
    document.removeEventListener('keydown', keydownHandler);
})

const showPreview = false;

const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()

function onSwap(){
    //updateNodeInternals(nodesStore.getLocalNodeIDs())
}


const onConnect = (connection) => {
    console.log('Connection made:', connection);
    // Add the new edge to the store
    nodesStore.addEdge({
        id: `${connection.sourceHandle}>${connection.targetHandle}`,
        source: connection.source,
        target: connection.target,
        // You can add additional properties as needed
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        // Optional custom styling
        style: { stroke: '#555', strokeWidth: 2 },
        animated: false,
        // Any other edge properties you need
    });
};
</script>

<template>
    <div class="canvas_container" @drop="onDrop" >
        <VueFlow 
        :apply-default="false"
        :delete-key-code="null"
        v-model:nodes="nodesStore.nodes"
        v-model:edges="nodesStore.edges"
        :node-types="nodeTypes" 
        class="pinia-flow"
        @dragover="onDragOver" 
        @dragleave="onDragLeave" 
        @connect="onConnect"
        @nodes-change="changes => applyNodeChanges(changes  , nodesStore.nodes)"
        @edges-change="changes => applyEdgeChanges(changes, nodesStore.edges)"
        @contextmenu="showContextMenu($event)"
        :connection-mode="ConnectionMode.Strict"
        fit-view-on-init>

            <CanvasBackground        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease',
        }"/>
        <CanvasControls></CanvasControls>
        </VueFlow>
        <ContextMenu
      v-if="isContextMenuVisible"
      :position="contextMenuPosition"
      :actions="contextMenuActions"
      @action="handleContextMenuAction"
      @hide-context-menu="closeContextMenu"
    />
    </div>


</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.4/dist/style.css';

    .canvas_container{
        width:100%;
        height:100%;
    }

</style>