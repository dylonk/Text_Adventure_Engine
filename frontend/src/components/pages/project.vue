<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useProjectStore } from '../editor/project_store';
import loadCircle from '@/assets/Images/loading.gif';
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
  
        <p>Welcome to our project creation tool!</p>

        <button class="project-button" style="background:#7fb723" @click="newProject">New Project</button>
        <button class="project-button" style="background:cadetblue" @click="loadProjectFile">Load Project From File</button>
        <button class="project-button" style="background:cadetblue" @click="startTutorial">Tutorial</button>


    <div class="recent-projects">
      <h2 class="section-title">Open Recents</h2>
      <img v-if="!isProjectsLoaded" :src="loadCircle" style="height:30%;">
      <div v-else class="projects-grid">
        <div 
          v-for="project in recentProjects" 
          :key="project.id" 
          class="project-box"
        >
          <div class="project-title">
            <button class="title-button" @click="loadProject(project.id)">            <span>{{ project.title || 'NULL PROJECTNAME' }}</span>
            </button>

            <img 
              :src="editIcon" 
              alt="Edit" 
              class="edit-icon" 
              @click="renameProject(project.id)"
            />
          </div>
          <div style="width:100%"></div>
          <div class="project-actions">
            <button class="action-button delete" @click="deleteProject(project.id)">Delete</button>
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
  justify-content: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 0;
}

.title-button{
  width:max-content;
  background:none;
  border:none;
}
.title-button:hover{
  cursor:pointer;
  text-decoration: underline;
  color:blue;
}
.recent-projects {
  background: rgb(44, 47, 51);
  justify-items: center;
  text-align: center;
  width: 100%;
  flex-shrink: 0;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #e0e0e0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  justify-content: center;
  width: 100%;
  max-width: 100%;
  overflow: visible;
}

.project-box {
  display:flex;
  background: #cacaca;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 12px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.project-title {
  font-size: 2rem;
  display: flex;
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


.project-actions {
  display: flex;
  justify-content: space-around;
}

.action-button {
  font-size: 0.75rem;
  padding: 0.5rem 0.5rem;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  height:fit-content;
  background:gray;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-button {
  font-size: 0.9rem;
  padding: 20px 10px;
  border: 2px solid white;
  background: #c0392b;
  color: white;
  width:100%;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'RetroQuill', sans-serif;
  font-size:large;
  transition: transform 0.2s, box-shadow 0.2s;
}

</style>
