<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';
import clickSound from '@/assets/sounds/click.wav';
import moreSound from '@/assets/sounds/more.wav';
import { useProjectStore } from '../editor/project_store';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite


const router = useRouter();
const recentProjects = ref([]);
const userId = ref('');
const projectStore = useProjectStore(); // Using projectStore globally

const fetchProjects = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('${API_BASE_URL}/auth/user', {
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
  } catch (error) {
    console.warn('Error fetching projects:', error);
  }
};

// Delete project using projectStore
const deleteProject = async (id) => {
  if (!confirm("Are you sure you want to delete this project?")) return;
  try {
    projectStore.deleteProject(id);
    recentProjects.value = recentProjects.value.filter(project => project.id !== id);
  } catch (error) {
    console.warn("Error deleting project:", error);
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
  <globalNavBar />
  <div id="project-container">
    <div class="background-overlay"></div>
    
    <div class="main-grid">
      <div class="left-container">
        <p>Welcome to our project creation tool!</p>
      </div>
      
      <div class="right-container">
        <button class="project-button" @click="newProject">New Project</button>
        <button class="project-button" @click="loadProjectFile">Load Project From File</button>
      </div>
    </div>

    <div class="recent-projects">
      <h2 class="section-title">Open Recents</h2>
      <div class="projects-grid">
        <div 
          v-for="project in recentProjects" 
          :key="project.id" 
          class="project-box"
        >
          <div class="project-title">{{ project.title }}</div>
          <img :src="project.image" alt="Project image" class="project-image" />
          <div class="project-actions">
            <button class="action-button" @click="loadProject(project.id)">Open</button>
            <button class="action-button delete" @click="deleteProject(project.id)">Delete</button>
            <button class="action-button rename" @click="renameProject(project.id)">Rename</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap');

#project-container {
  position: relative;
  flex:1;
  font-family: 'Pixelify Sans', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.background-overlay {
  background: url('@/assets/Images/stars.jpg') no-repeat center center/cover;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
}

.main-grid {
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 30px;
  width: 70%;
  margin: 120px auto 0 auto;
}

.left-container, .right-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(44, 47, 51, 0.9);
  border: 2px solid #e0e0e0;
  box-shadow: 6px 6px 0 #000;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  min-width: 300px;
}

.left-container {
  font-size: 3rem;
  color: #e0e0e0;
  text-shadow: 4px 4px 0 #000;
}

.right-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recent-projects {
  background: rgba(44, 47, 51, 0.9);
  border: 2px solid #e0e0e0;
  box-shadow: 6px 6px 0 #000;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  width: 70%;
  margin-top: 50px;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #e0e0e0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.project-box {
  background: #e74c3c;
  border: 2px solid #e0e0e0;
  box-shadow: 4px 4px 0 #000;
  border-radius: 6px;
  padding: 12px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-box:hover {
  transform: translateY(-5px);
  box-shadow: 6px 6px 0 #000;
}

.project-title {
  font-size: 1rem;
  margin-bottom: 10px;
  padding: 6px;
  background: #c0392b;
  color: #fff;
  border: 2px solid #e0e0e0;
  box-shadow: 2px 2px 0 #000;
}

.project-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border: 2px solid #e0e0e0;
  box-shadow: inset 2px 2px 0 #000;
}

.project-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}

.action-button {
  font-size: 0.9rem;
  padding: 5px 10px;
  border: 2px solid white;
  background: #c0392b;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 2px 2px 0 #000;
}
</style>
