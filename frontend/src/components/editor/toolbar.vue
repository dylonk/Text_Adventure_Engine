<script setup>

import { useProjectStore } from './project_store.js';
const projectStore = useProjectStore();

</script>
<template>
    <div class="toolbar">

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
      <div class="project-info">
        <div class="project-id" style="color:rgb(0,150,200);">{{ projectStore.projectId }}&nbsp;</div>
        <div class="project-name" style="color:rgb(200,200,200);font-weight:bold">{{ projectStore.projectName }}</div>

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
    background-color: #4f4d56;
    border-bottom: solid black 1px;
    border-top: solid black 1px;

  }
  .project-info{
    margin-left:auto;
    display:flex;
    height:100%;
  }
  .project-info>*{
    vertical-align:middle;
    margin-left:5px;
    margin-right:5px;
  }
  /* Dropdown menu styling */
  .dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropbtn {
    background-color: #b2b0ba;
    color: rgb(0, 0, 0);
    padding: 5px;
    padding-right: 10px;
    padding-left:10px;
    font-size: 12px;
    border: none;
    cursor: pointer;
    border-right: black 1px solid;
  }
  
  .dropdown-content {
    border: black 1px solid;
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    z-index: 10;
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
    background-color: #d3d3d3;
  }
  </style>
  