<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useProjectStore } from '../editor/project_store';
import editIcon from '@/assets/Images/projects/edit.png';
import tutorial from '../editor/tutorial.vue';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite


const router = useRouter();
const recentProjects = ref([]);
const userId = ref('');

const projectStore = useProjectStore(); // Using projectStore globally
const isProjectsLoaded = ref(false)

const fetchProjects = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    userId.value = userData._id;

  } catch (error) {
    console.warn('Error fetching user profile:', error);
  }

  try {
    console.warn('Fetching projects for user:', userId.value);
    const response = await axios.get(`${API_BASE_URL}/projects?userId=${userId.value}`);
    recentProjects.value = response.data.map(project => ({
      id: project.id,
      title: project.name,
      image: 'https://talentclick.com/wp-content/uploads/2021/08/placeholder-image.png'
    }));
    isProjectsLoaded.value = true

  } catch (error) {
    console.warn('Error fetching projects:', error);
  }
};

// Delete project using projectStore
const deleteProject = async (id) => {
  if (!confirm("Are you sure you want to delete this project?")) return;
  try {
        const response = await fetch(`${API_BASE_URL}/projects/delete?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const errorDetail = await response.text();
          throw new Error(`Failed to delete project: ${errorDetail}`);
        }
        // Remove the deleted project from the recentProjects list. a little redundant but lets it take effect immediately
        recentProjects.value = recentProjects.value.filter(p => p.id !== id);
      } catch (error) {
        console.error('Failed to delete project', error);
      }
};

// Rename project using projectStore
const renameProject = async (id) => {
  const newTitle = prompt("Enter the new project name:");
  if (!newTitle) return;

  try {
    projectStore.renameProject(id, newTitle);
    const project = recentProjects.value.find(p => p.id === id);
    if (project) project.title = newTitle;
  } catch (error) {
    console.warn("Error renaming project:", error);
  }
};

onMounted(fetchProjects);


function newProject() {
  router.push('/create');
  projectStore.initProject();
  tutorial.tutorialStep.value = null;
}

//this function inits a project, but with the tutorial
function startTutorial() {
  router.push('/create');
  projectStore.initProject();
  projectStore.startTutorial();
}

function loadProjectFile() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  router.push('/create');
  return new Promise((resolve, reject) => {
    fileInput.onchange = async () => {
      try {
        const file = fileInput.files[0];  // Get the selected file
        if (file) {
          // Call the openProjectFromFile method in project store
          projectStore.openProjectFromFile(file);
          resolve();  // Resolve the promise once the project is loaded
        } else {
          reject('No file selected');
        }
      } catch (error) {
        reject('Failed to load project from file: ' + error.message);
      }
    };
    fileInput.click();  // Trigger the file input dialog
  });
}

function loadProject(id) {
  projectStore.openProject(id);
  router.push('/create');
}
</script>

<template>
  <div id="project-container">
  <div class="projects-layout">
    <div class="sidebar">        
        <p class="welcome-title">Welcome to our text adventure engine!</p>
        <div class="action-buttons-container">
          <button class="primary-action-button" style="background:green" @click="newProject">New Project</button>
          <button class="primary-action-button" style="background:cadetblue" @click="loadProjectFile">Load Project From File</button>
          <button class="primary-action-button" style="background:royalblue" @click="startTutorial">Tutorial</button>
        </div>
      </div>
    <div class="projects-panel">
    <div class="projects-section">
      <h2 class="projects-section-title">My Projects</h2>
      <div class="projects-list">
        <div 
          v-for="project in recentProjects" 
          :key="project.id" 
          class="project-item"
        >
          <div class="project-item-header">
            <button class="project-name-button" @click="loadProject(project.id)">            <span>{{ project.title || 'NULL PROJECTNAME' }}</span>
            </button>

            <img 
              :src="editIcon" 
              alt="Edit" 
              class="edit-icon" 
              @click="renameProject(project.id)"
            />
          </div>
          <div style="width:100%"></div>
          <div class="project-item-actions">
            <button class="delete-button" @click="deleteProject(project.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
</template>

<style scoped>

#project-container {
  position: relative;
  background:#dbdbdb;
  flex:1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  overflow-y: auto;
}

.project-name-button{
  font-size:1rem;
  width:max-content;
  background:none;
  border:none;
}
.project-name-button:hover{
  cursor:pointer;
  text-decoration: underline;
  color:blue;
}
.projects-section {
  background: rgb(44, 47, 51);
  font-family:'Josefin Sans';
  width: 100%;  
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.projects-section-title {
  font-size: 1rem;
  color: #e0e0e0;
  margin: 8px;
  flex-shrink: 0;
}

.projects-list {
  display: flex;
  flex-direction: column;
  background: #c0c0c0;
  box-sizing: border-box;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.project-item {
  display:flex;
  background: #cacaca;
  width: 100%;
  max-width: 100%;
  transition: color 0.2s;
  min-width: 0;
  padding: 1/8rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.project-item:nth-child(odd){
  background:#c0c0c0;
}

.project-item-header {
  font-size: 2rem;
  display: flex;
  height: fit-content;
  align-items: center;
  padding: 6px;
  color: #000000;
}

.edit-icon {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  opacity: 0.7;
  box-sizing: border-box;
  transition: opacity 0.2s;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.edit-icon:hover {
  opacity: 1;
}

.welcome-title{
  font-size:2rem;
  margin:2rem;
  font-family: 'RetroQuill', sans-serif;
}

.project-item-actions {
  display: flex;
  justify-content: space-around;
}

.delete-button {
  font-size: 0.75rem;
  margin: 0.25rem;
  padding:0.25rem;
  color: rgba(255, 255, 255, 0);
  cursor: pointer;
  border:none;
  border-radius: 4px;
  height:fit-content;
  background:none;
}
.project-item:hover{
  filter:brightness(90%);
}
.project-item:hover .delete-button{
  color:rgb(54, 54, 54);
  font-weight: 800;
}
.project-item:hover .delete-button:hover{
  color:rgb(202, 0, 0);
}
.primary-action-button {
  font-size: 1.1rem;
  padding: 16px 24px;
  border: none;
  background: #4a7603;
  color: white;
  width: 100%;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'RetroQuill', sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.primary-action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  filter: brightness(1.1);
}

.primary-action-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}
.projects-layout{
  display:flex;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  min-height: 0;
}
.action-buttons-container{
  display:flex;
  flex-direction: column;
  margin:2rem;
  margin-top:auto;
  gap:0.5rem;
}

.sidebar{
  width: clamp(250px, 40vw, 600px);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.projects-panel{
  width: clamp(250px, 50vw, 1000px);
  box-sizing: border-box;
  margin:2rem;
  border-radius:8px;
  overflow:hidden;
  background: #cacaca;
  display: flex;
  flex-direction: column;
  height: calc(100% - 4rem);
  max-height: calc(100vh - 4rem);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .projects-layout {
    flex-direction: column;
    width: 100%;
    margin-left: clamp(0.5rem, 2vw, 1rem);
    margin-right: clamp(0.5rem, 2vw, 1rem);
    gap: clamp(0.5rem, 2vw, 1rem);
  }
  
  .sidebar {
    width: 100%;
    min-width: 100%;
  }
  
  .projects-panel {
    width: 100%;
    margin:0;
    border-radius:0;
    box-shadow: none;
  }
  .projects-list {
    overflow-y:scroll;
  }
}

</style>
