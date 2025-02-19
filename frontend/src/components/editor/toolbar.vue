<script setup>

import { useProjectStore } from './project_store.js';
const projectStore = useProjectStore();

</script>
<template>
    <div class="toolbar">
    <div class="project-info">
      <div class="project-name">{{ projectStore.projectName }}</div>
      <div class="project-id">{{ projectStore.projectId }}</div>
    </div>    
      <!-- file dropdown -->
      <div class="dropdown">
        <button class="dropbtn" @click="toggleMenu('menu1')">file</button>
        <div class="dropdown-content" v-if="menu1Open">
          <a href="#">Open</a>
          <a href="#"@click="useProjectStore().exportProject()">Save</a>
          <a href="#"@click="useProjectStore().renameProject()">Rename</a>
        </div>
      </div>
  
      <!-- edit dropdown -->
      <div class="dropdown">
        <button class="dropbtn" @click="toggleMenu('menu2')">edit</button>
        <div class="dropdown-content" v-if="menu2Open">
          <a href="#">Option A</a>
          <a href="#">Option B</a>
          <a href="#">Option C</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        menu1Open: false,
        menu2Open: false,
      };
    },
    methods: {
      toggleMenu(menu) {
        if (menu === 'menu1') {
          this.menu1Open = !this.menu1Open;
        } else if (menu === 'menu2') {
          this.menu2Open = !this.menu2Open;
        }
      },
      handleClickOutside(event) {
        if (!this.$el.contains(event.target)) {
          this.menu1Open = false;
          this.menu2Open = false;
        }
      }
    },
    mounted() {
      document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
      document.removeEventListener('click', this.handleClickOutside);
    }
  };
  </script>
  
  <style scoped>
  /* Toolbar style */
  .toolbar {
    display: flex;
    justify-content: flex-start;
    background-color: #333;
    padding: 10px;
  }
  
  /* Dropdown menu styling */
  .dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropbtn {
    background-color: #4CAF50;
    color: white;
    padding: 10px;
    font-size: 16px;
    border: none;
    cursor: pointer;
  }
  
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    z-index: 1;
  }
  
  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  
  .dropdown-content a:hover {
    background-color: #ddd;
  }
  
  .dropdown:hover .dropdown-content {
    display: block;
  }
  
  .dropdown:hover .dropbtn {
    background-color: #3e8e41;
  }
  </style>
  