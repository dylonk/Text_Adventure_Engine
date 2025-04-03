<script setup>
import router from '../pages/router.js';
import { useProjectStore } from './project_store.js';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const projectStore = useProjectStore();
const clientId = '91d4304a4949af6'; // Your Imgur Client ID
const fileInput = ref(null);

const menu1Open = ref(false);
const menu2Open = ref(false);
const menu3Open = ref(false);

function toggleMenu(menu) {
  menu1Open.value = false;
  menu2Open.value = false;
  menu3Open.value = false;

  if (menu === 'menu1') menu1Open.value = !menu1Open.value;
  else if (menu === 'menu2') menu2Open.value = !menu2Open.value;
  else if (menu === 'menu3') menu3Open.value = !menu3Open.value;
}

function handleClickOutside(event) {
  if (!event.target.closest('.toolbar')) {
    menu1Open.value = false;
    menu2Open.value = false;
    menu3Open.value = false;
  }
}

function uploadImage() {
  fileInput.value.click();
}

async function handleFile(event) {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: formData,
    });

    const result = await response.json();
    console.log("Imgur response:", result);
    console.log("Status:", response.status);

    if (response.ok && result.success) {
      alert(`Image uploaded:\n${result.data.link}`);
    } else {
      alert(`Upload failed.\nStatus: ${response.status}\nMessage: ${result?.data?.error || 'Unknown error'}`);
    }
  } catch (err) {
    console.error("Error uploading image:", err);
    alert("An error occurred while uploading.");
  }
}

function setupPreview() {
  const currentProject = localStorage.getItem('project');
  if (!currentProject) {
    projectStore.exportProject();
  }
  projectStore.showPreview = true;
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="toolbar">
    <!-- File -->
    <div class="dropdown">
      <button class="dropbtn" @click="toggleMenu('menu1')">file</button>
      <div class="dropdown-content" v-if="menu1Open">
        <a @click.prevent="projectStore.exportProject()">Save</a>
        <a @click.prevent="projectStore.renameProject()">Rename</a>
        <a @click.prevent="projectStore.saveProjectToFile()">Export Project</a>
        <a @click.prevent="projectStore.openProjectFromFile()">Import Project</a>
        <a @click.prevent="router.push('/publish')">Publish</a>
      </div>
    </div>

    <!-- Edit -->
    <div class="dropdown">
      <button class="dropbtn" @click="toggleMenu('menu2')">edit</button>
      <div class="dropdown-content" v-if="menu2Open">
        <a href="#">Option A</a>
        <a href="#">Option B</a>
        <a href="#">Option C</a>
        <a @click.prevent="uploadImage">Upload Image</a>
      </div>
    </div>

    <!-- View -->
    <div class="dropdown">
      <button class="dropbtn" @click="toggleMenu('menu3')">view</button>
      <div class="dropdown-content" v-if="menu3Open">
        <a @click.prevent="projectStore.showPreview ? projectStore.showPreview = false : setupPreview()">Preview</a>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/png, image/jpeg"
      style="display: none"
      @change="handleFile"
    />

    <!-- Project Info -->
    <div class="project-info">
      <div class="project-id" style="color:rgb(0,150,200);">{{ projectStore.projectId }}&nbsp;</div>
      <div class="project-name" style="color:rgb(200,200,200);font-weight:bold">{{ projectStore.projectName }}</div>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  background-color: #4f4d56;
  border-bottom: solid black 1px;
  border-top: solid black 1px;
}
.project-info {
  margin-left: auto;
  display: flex;
  height: 100%;
}
.project-info > * {
  vertical-align: middle;
  margin-left: 5px;
  margin-right: 5px;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropbtn {
  background-color: #b2b0ba;
  color: rgb(0, 0, 0);
  padding: 5px 10px;
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
