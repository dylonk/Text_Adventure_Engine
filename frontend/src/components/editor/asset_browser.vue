<script setup>
import { useNodesStore } from './nodes/stores/node_store.js'
import { computed } from 'vue'

const nodesStore = useNodesStore()

// Use computed properties to observe the nodes in the store
const rooms = computed(() => nodesStore.nodes.rooms)
const items = computed(() => nodesStore.nodes.items)
</script>

<template>
  <div class="asset_browser">
    <h3>Rooms</h3>
    <ul>
      <li v-for="room in rooms" :key="room.id">
        {{ room.node_title }}
        <ul>
          <li v-for="item in nodesStore.getItemsInRoom(room.id)" :key="item.id">
            {{ item.node_title }} (Item)
          </li>
        </ul>
      </li>
    </ul>
    <!-- If you still want to show all items outside of rooms, you can keep the "Items" section -->
    <h3>Items</h3>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.node_title || 'Unnamed Item' }}
      </li>
    </ul>
  </div>
</template>
<style>
.asset_browser{
    display:flex;
    flex-direction: column;
    height:100%;
    background:rgb(225, 225, 225);
}
.asset_browser  >*{
    margin:20px;
}

.tb_title{
    padding:8px;
    text-align: center;
    margin: 0 auto;
    margin-bottom:0px;

    width: 100%;
    height:min-content;
    color:rgb(255, 255, 255);
    background:rgb(189, 189, 189);
    font-weight:800;
    font-size:18px;
}


.context-menu {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.context-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.context-menu li {
    padding: 10px;
    cursor: pointer;
}

.context-menu li:hover {
    background: #f0f0f0;
}
</style>
