    // drag_drop.js
    import { useVueFlow } from '@vue-flow/core'
    import { ref, watch } from 'vue'
    import { useNodesStore } from './nodes/node_store.js' // Import the Pinia store

    let id = 1

    function getId() {  //ids are just one after the other
    return id++
    }


    const state = {
    draggedType: ref(null),
    draggingTB: ref(false),
    isDragOver: ref(false),
    isDragging: ref(false),
    }

    export default function useDragAndDrop() {
    const { draggedType, isDragOver, isDragging,draggingTB } = state
    const nodesStore = useNodesStore() // Access the Pinia store
    const { addNodes, screenToFlowCoordinate, updateNode, onNodesInitialized } = useVueFlow()

    watch(isDragging, (dragging) => {   //when dragging
        document.body.style.userSelect = dragging ? 'none' : ''
    })

    function onDragStart(event, type,isToolbox) {
        console.log('isToolbox is:', isToolbox)
        draggingTB.value=isToolbox//is it a real node, or a toolbox node?
        if (event.dataTransfer) {
        event.dataTransfer.setData('application/vueflow', type)
        event.dataTransfer.effectAllowed = 'move'
        }
        draggedType.value = type
        isDragging.value = true
        console.log("dragging", draggedType.value)

        document.addEventListener('drop', onDragEnd)
    }

    function onDragOver(event) {
        event.preventDefault()

        if (draggedType.value) {
        isDragOver.value = true

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move'
        }
        }
    }

    function onDragLeave() {
        isDragOver.value = false
    }

    function onDragEnd() {
        isDragging.value = false
        isDragOver.value = false
        draggedType.value = null
        document.removeEventListener('drop', onDragEnd)
    }

    function onDrop(event) {
        console.log('draggingTB is:', draggingTB.value)
        const pos = screenToFlowCoordinate({
          x: event.clientX,
          y: event.clientY,
        })

        if (draggingTB.value) {
          // Create a new node
          const newNode = {
            type: draggedType.value,
            id: getId(),
            position: pos,
            expandParent: true,
            width: 0,
            height: 0,
            parentId: null,
          }
          nodesStore.addNode(newNode)
          addNodes(newNode)
          console.log("new node added!")
        }
        else {
          // Move an existing node
          const nodeId = draggedType.value // assuming draggedType.value is the id of the node being moved
          updateNode(nodeId, (node) => ({
            position: pos,
          }))
        }
      }

    return {
        draggedType,
        isDragOver,
        isDragging,
        onDragStart,
        onDragLeave,
        onDragOver,
        onDrop,
    }
    }
