<script setup>

import router from '../pages/router.js';
import { useProjectStore } from './project_store.js';
import { ref } from 'vue';
const projectStore = useProjectStore();

</script>
<template>
    <div class="toolbar">

      <!-- file dropdown -->
      <div class="dropdown">
        <button class="dropbtn" @click="toggleMenu('menu1')">file</button>
        <div class="dropdown-content" v-if="menu1Open">
          <a href="#"@click="useProjectStore().exportProject()">Save</a>
          <a href="#"@click="useProjectStore().renameProject()">Rename</a>
          <a href="#"@click="useProjectStore().saveProjectToFile()">Export Project</a>
          <a href="#"@click="useProjectStore().openProjectFromFile()">Import Project</a>
          <!-- <a href="#"@click="useProjectStore().deleteProject()">Delete</a> -->
          <a href="#"@click="router.push('/publish')">Publish</a>

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


      <!-- view dropdown -->
      <div class="dropdown">
        <button class="dropbtn" @click="toggleMenu('menu1')">view</button>
        <div class="dropdown-content" v-if="menu1Open">
          <a href="#" @click="projectStore.showPreview ? projectStore.showPreview = false : setupPreview()">Preview</a>
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
      },

      //in order to have the preview screen, must:
      //save the project to localstorage in it's database format
      //then use the transformation function to make it into game format, also in localstorage. It's for testing, so doesn't go in any database.
      //then load the game. This is just like playing the game normally, with no testing parameters
      //this function is run again each time the "play" button is clicked, then drawing from the parameters in the left sidebar.
      //NONE OF THESE PARAMETERS WILL CHANGE THE PROJECT, ONLY THE TESTING GAME IN LOCALSTORAGE. THIS IS THE POINT.


      setupPreview() {
        const projectStore = useProjectStore();
        const currentProject=localStorage.getItem('project'); //if you've saved your project before, this will be there.
        if(currentProject==null){ //if you haven't, don't worry, we'll  do it for you
          projectStore.exportProject();
        }
        projectStore.showPreview = true;//now that the data is in place, it shows the preview screen.
        //now we have the project in localstorage, let's transform it into a game. We Don't have this function yet so it's pseudocode time
        //oh boy it's in game format now. This bitch will be saved to localstorage and overwritten quite a bit, so make sure it's overwritten and not duplicated.
        //we then start the game, loading it up in preview mode (essentially just means it has the wings on either side to facilitate parameter editing)
        //the parameter editor on the left side edits the game json directly. We don't need to worry about messing it up at all; it's for testing only and designed to be modified, and can always set it back to defaults by going off the project store again.
        //when the play button is pressed, it loads the parameters from the parameter editor into the game and starts the game. No parameters? that's just fine, it defaults and starts the game normally.
        //from here, the game plays as normal. It doesn't edit on the fly perse(you can't change a game while it's in progress), but the testing parameters give a similar effect.

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
    z-index: 200;
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
  