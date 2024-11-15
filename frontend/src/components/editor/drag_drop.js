    // drag_drop.js
    import { useVueFlow } from '@vue-flow/core'
    import { ref, watch } from 'vue'
    import { useNodesStore } from './nodes/stores/node_store.js' // Import the Pinia store

    let id = 0

    function getId() {
    return `dndnode_${id++}`
    }


    const state = {
    draggedType: ref(null),
    isDragOver: ref(false),
    isDragging: ref(false),
    }

    export default function useDragAndDrop() {
    const { draggedType, isDragOver, isDragging } = state
    const nodesStore = useNodesStore() // Access the Pinia store
    const { addNodes, screenToFlowCoordinate, updateNode, onNodesInitialized } = useVueFlow()

    watch(isDragging, (dragging) => {
        document.body.style.userSelect = dragging ? 'none' : ''
    })

    function onDragStart(event, type) {
        if (event.dataTransfer) {
        event.dataTransfer.setData('application/vueflow', type)
        event.dataTransfer.effectAllowed = 'move'
        }

        draggedType.value = type
        isDragging.value = true
        console.log("dragging ", draggedType.value)

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
        const pos = screenToFlowCoordinate({
        x: event.clientX,
        y: event.clientY,
        })

        const nodeType = draggedType.value;//nodeType is just draggedType
        const nodeId = getId()

        const newNode = {
        type: nodeType,
        id: nodeId,
        position: pos,
        expandParent: true,
        width: 100,
        height: 100,
        parentId: null,  // Ensure parentId is always defined
        }

        if (nodeType === 'room') {
            newNode.node_title= 'Untitled Room' // Ensure the room has a title when created

            console.log("should add room to store")
        }

        // Check if it's an item and if it's dropped over a room
        const roomId = event.dataTransfer.getData('roomId')
        console.log("room id is", event.dataTransfer.getData('roomId'))
        if (nodeType === 'item' && roomId) {
        newNode.parentId = roomId
        console.log("putting item in room", roomId)//debugging
        nodesStore.setItemParent(nodeId, roomId) // Set the parent of the item
        }

        // Add node to the shared store
        nodesStore.addNode(newNode)

        const { off } = onNodesInitialized(() => {
        updateNode(nodeId, (node) => ({
            position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 },
        }))
        off()
        })

        addNodes(newNode)
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
