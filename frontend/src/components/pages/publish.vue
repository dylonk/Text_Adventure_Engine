<script>
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import Project from './project.vue';
import { useProjectStore } from '../editor/project_store';
import { fetchUserData } from '@/components/standardjs/fetchUserData';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite



export default {
  components: {
  },
  data() {
    return {
      title: '',
      description: '',
      thumbnail: null,
      thumbnailPreview: 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg', // Default thumbnail
      isPublishing: false // track  state
    };
  },
  computed: {
    projectStore() {
      return useProjectStore();
    },
    showModal() {
      return this.projectStore.showPublishModal;
    },
    isStandalonePage() {
      // Check if we're on the /publish route (standalone page mode)
      return this.$route.path === '/publish';
    },
    shouldShow() {
      // Show if modal is open OR if we're on the standalone page
      return this.showModal || this.isStandalonePage;
    }
  },
  methods: {
    closeModal() {
      this.projectStore.showPublishModal = false;
    },
    showToast(message, type) {
      Toastify({
        text: message,
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: type === 'success' ? '#27ae60' : '#c0392b', // Green for success, Red for error
        stopOnFocus: true,
      }).showToast();
    },

      //uploads thumbnail LOCALLY using base64. only uploaded to imgur on publish
      handleThumbnailUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.thumbnail = file; // store the File object
        const reader = new FileReader();
        reader.onload = (e) => {
          this.thumbnailPreview = e.target.result; // base64 for preview only
        };
        reader.readAsDataURL(file);
      } else {
        this.showToast("Please select a valid image file.", "error");
      }
    },
    async uploadThumbnailToImgur(file) {
    const clientId = '91d4304a4949af6'; // Imgur Client ID

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result?.data?.error || 'Upload failed');
    }

    return result.data.link; // <-- this is the image URL
  },

  



  
    async publishGame() {
      if (!this.title || !this.description) {
        this.showToast("Please fill in all fields before publishing.", "error");
        return;
      }

      this.isPublishing = true; // Show loading state
      try {
        console.log("Publishing Game:", this.title, this.description);
        console.log("Thumbnail:", this.thumbnail);

        this.showToast("Uploading thumbnail...", "success");
        const imageUrl = await this.uploadThumbnailToImgur(this.thumbnail); // Upload file

        const formData = new FormData();
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("thumbnail", this.thumbnail);
        const username = await fetchUserData('username');
        useProjectStore().exportGame(this.title, this.description, imageUrl, username);

        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 2000)); // simulate delay of 2 seconds

        this.showToast("Game published successfully!", "success");
        // Close modal after successful publish (only if in modal mode)
        if (this.showModal && !this.isStandalonePage) {
          setTimeout(() => {
            this.closeModal();
            // Reset form
            this.title = '';
            this.description = '';
            this.thumbnail = null;
            this.thumbnailPreview = 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg';
          }, 1500);
        } else {
          // Reset form for standalone page
          setTimeout(() => {
            this.title = '';
            this.description = '';
            this.thumbnail = null;
            this.thumbnailPreview = 'https://i.pinimg.com/736x/13/34/75/133475f2b4de23314a01df9a61f85436.jpg';
          }, 1500);
        }
      } catch (error) {
        this.showToast("Publishing failed. Please try again.", "error");
      } finally {
        this.isPublishing = false; // Hide loading state
      }
    }
  }
};
</script>

<template>
  <!-- Publish Modal Overlay (when used as modal) -->
  <div v-if="showModal && !isStandalonePage" class="publish-overlay" @click.self="closeModal">
    <div class="publish-modal">
      <button class="close-btn" @click="closeModal">×</button>
      <div class="publish-content">
        <h1 class="publish-title">Publish Your Game</h1>

        <!-- Thumbnail Preview -->
        <div class="thumbnail-box">
          <img :src="thumbnailPreview" alt="Thumbnail Preview" />
        </div>

        <label for="thumbnail-upload" class="upload-btn">
          Upload Thumbnail
        </label>
        <input type="file" id="thumbnail-upload" class="hidden-input" @change="handleThumbnailUpload" />

        <label class="title-label">Title</label>
        <input v-model="title" type="text" class="title-input" placeholder="Enter title..." />

        <textarea v-model="description" class="description-box" placeholder="Description"></textarea>

        <div class="bottom-section">
          <button class="publish-btn" @click="publishGame" :disabled="isPublishing">
            <span v-if="isPublishing" class="spinner"></span>
            <span v-else>Publish</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Standalone Page (when accessed via route) -->
  <div v-if="isStandalonePage" class="publish-container">
    <div class="publish-page">
      <h1 class="publish-title">Publish Your Game</h1>

      <!-- Thumbnail Preview -->
      <div class="thumbnail-box">
        <img :src="thumbnailPreview" alt="Thumbnail Preview" />
      </div>

      <label for="thumbnail-upload-standalone" class="upload-btn">
        Upload Thumbnail
      </label>
      <input type="file" id="thumbnail-upload-standalone" class="hidden-input" @change="handleThumbnailUpload" />

      <label class="title-label">Title</label>
      <input v-model="title" type="text" class="title-input" placeholder="Enter title..." />

      <textarea v-model="description" class="description-box" placeholder="Description"></textarea>

      <div class="bottom-section">
        <button class="publish-btn" @click="publishGame" :disabled="isPublishing">
          <span v-if="isPublishing" class="spinner"></span>
          <span v-else>Publish</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Standalone Page Layout */
.publish-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: black;
  color: white;
  font-family: monospace;
  position: relative;
}

.publish-page {
  width: 80%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
  background: #222;
  border: 2px solid #c0392b;
  height: 80vh;
  position: relative;
}

/* Modal Overlay - similar to explore.vue */
.publish-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.817);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.publish-modal {
  position: relative;
  background: #222;
  border-radius: 8px;
  width: 80vw;
  max-width: 800px;
  box-sizing: border-box;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  border: 2px solid #c0392b;
}

.close-btn {
  outline: none;
  border: none;
  z-index: 500;
  background: #222;
  text-align: center;
  color: rgb(200, 200, 200);
  font-size: 2rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  line-height: 1;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: white;
  transform: scale(1.05);
  background: #333;
}

.publish-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px;
  color: white;
  font-family: monospace;
  min-height: 400px;
}

.publish-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  margin-top: 0;
  color: white;
}

/* Fixed Thumbnail Box */
.thumbnail-box {
  width: 200px;
  height: 200px;
  background: black;
  border: 2px solid #c0392b;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  overflow: hidden;
}

.thumbnail-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  display: inline-block;
  padding: 10px;
  border: 2px solid #c0392b;
  background: #c0392b;
  color: white;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  margin-bottom: 15px;
}

.upload-btn:hover {
  background: #a02d24;
}

.hidden-input {
  display: none;
}

.title-label {
  margin-top: 10px;
  color: white;
  font-weight: bold;
}

.title-input {
  width: 80%;
  padding: 8px;
  border: 2px solid #c0392b;
  background: black;
  color: white;
  margin-top: 5px;
  font-size: 1rem;
}

.description-box {
  width: 80%;
  height: 100px;
  padding: 8px;
  border: 2px solid #c0392b;
  background: black;
  color: white;
  margin-top: 10px;
  font-size: 1rem;
}

/* publish button -- bottom right */
.bottom-section {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.publish-btn {
  padding: 12px 40px;
  background: #27ae60;
  border: 2px solid #1e8449;
  font-weight: bold;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 130px;
}

.publish-btn:disabled {
  background: #1e8449;
  cursor: not-allowed;
}

/* Loading Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
