<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    id: Number,
    name: { type: String, default: 'Item' },
    description: { type: String, default: 'An interactable item.' },
    roomId: Number  // Room ID passed from parent (RoomNode)


});

const interact = () => {
    alert(`You interacted with ${props.name}: ${props.description}`);
};
</script>

<template>
    <div class="item_container" @click="interact">
        <p class="item_name">{{ props.name }}</p>
        <p class="item_description">{{ props.description }}</p>
    </div>
</template>

<style>
.item_container {
    padding: 10px;
    background: rgb(230, 230, 230);
    border: 1px solid black;
    cursor: pointer;
    margin: 5px 0;
}

.item_name {
    font-weight: bold;
}

.item_description {
    font-style: italic;
}
</style>
