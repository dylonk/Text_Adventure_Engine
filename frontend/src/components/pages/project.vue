<script setup>
import { useRouter } from 'vue-router';
import { ref,onMounted } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';
import clickSound from '@/assets/sounds/click.wav';
import moreSound from '@/assets/sounds/more.wav';
import { useProjectStore } from '../editor/project_store';
import axios from 'axios';//I'm using axios here to simplify the http. We don't necessarily need to use it with evreything.

const router = useRouter();


const recentProjects = ref([]);
const userId = ref('');
// Fetch the projects for the logged-in user
const fetchProjects = async () => {
  try {
    const token = localStorage.getItem('token');  //gotta get the token to make sure user logged in
        const response = await fetch('http://localhost:5000/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the JWT token in the Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        userId.value = userData._id;  // all this just to get the users id. If only i was less lazy and made this more modular.

    } catch (error) {
        console.error('Error fetching user profile:', error);
    }

  try {
    console.log('Fetching projects for user:', userId.value);
    const response = await axios.get(`http://localhost:5000/projects?userId=${userId.value}`);
    console.log(response.data);
    // Assuming response.data is an array of projects
    recentProjects.value = response.data.map(project => ({
      id: project.id,
      title: project.name,  // Assuming project.name corresponds to the title
      image: 'https://via.placeholder.com/150'  // Add the actual image URL or placeholder
    }));
  } catch (error) {
    if(true){
      console.error('Error fetching projects (project.vue was bothering me set statement to false to bring back spam)');
    }
    else{
      console.error('Error fetching projects:', error);
    }
  }
};

//when mounted, uses the above code to get all the user's projects. we can always edit it to only get the 6 most recently edited.
onMounted(() => {
  fetchProjects();
});


// Play sound function
function playClickSound(soundType = 'click') {
  const sound = new Audio(soundType === 'more' ? moreSound : clickSound);
  sound.volume = 0.5;
  sound.play().catch((e) => console.warn("Sound play blocked", e));
}

// Navigate to new project (canvas screen)
function newProject() {
  playClickSound();
  router.push('/create');
  useProjectStore().initProject();
}

// Load project from file explorer
function loadProject() {
  playClickSound();
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,.txt,.project';
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert(`Loaded project: ${file.name}`);
    }
  };
  input.click();
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
        <button class="project-button" @click="loadProject">Load Project</button>
      </div>
    </div>

    <div class="recent-projects">
      <h2 class="section-title"> Open Recents</h2>
      <div class="projects-grid">
        <div 
          v-for="project in recentProjects" 
          :key="project.id" 
          class="project-box"
          @click="playClickSound()">
          <div class="project-title">{{ project.title }}</div>
          <img :src="project.image" alt="Project image" class="project-image" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap');

#project-container {
  position: relative;
  min-height: 100vh;
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
  cursor: pointer;
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
</style>