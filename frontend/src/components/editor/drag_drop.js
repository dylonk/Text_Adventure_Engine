    // drag_drop.js
    import { useVueFlow } from '@vue-flow/core'
    import { ref, watch, computed } from 'vue'
    import { useNodesStore } from './nodes/node_store.js' // Import the Pinia store
    import node_colors from './nodes/node-colors.js'

//file test
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
          console.log("id counter is:", nodesStore.idCounter);
          const newNode = {
            type: draggedType.value,
            position: pos,
            id:nodesStore.idCounter,    //increments id based on idcounter in node store
            data: {
              display_type:'DnDNoDisplayNameGiven',
              bg_color:computed(()=>node_colors[newNode.type+'_bg'] || 'red'),
              fg_color:computed(()=>node_colors[newNode.type+'_fg'] || 'blue'),
            },
            expandParent: true,
            parentId: null,
          }

          nodesStore.addNode(newNode)
          console.log("new node added!")
        }
/*           else {
            // Move an existing node
            const nodeId = draggedType.value // assuming draggedType.value is the id of the node being moved
            console.log('Moving node with ID:', nodeId);
            updateNode(nodeId, (node) => ({
              position: pos,
            }))
          } */
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
