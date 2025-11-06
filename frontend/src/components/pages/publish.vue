<script>
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import Project from './project.vue';
import { useProjectStore } from '../editor/project_store';
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
  methods: {
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
        useProjectStore().exportGame(this.title, this.description, imageUrl);

        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 2000)); // simulate delay of 2 seconds

        this.showToast("Game published successfully!", "success");
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
  <div class="publish-container">
    <div class="publish-page">
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
</template>

<style scoped>
/* Full screen layout */
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

.publish-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
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
