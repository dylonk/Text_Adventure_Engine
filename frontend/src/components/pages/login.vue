<script setup>
import { ref } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';
import { useRouter } from 'vue-router'; // import useRouter from Vue

// Create a ref to store the form data
const formData = ref({
  username: '',
  password: ''
});

// Access the router to redirect after login
const router = useRouter();

// Function to handle login submission
const onLoginSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission
  
  try {
    const response = await fetch('http://localhost:5000/auth/login', {//this is our login route. change later when we deploy to internet
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value) // Send the form data as JSON
    });

    if (!response.ok) {
      throw new Error('response was not ok');
    }

    const result = await response.json(); // Parse the JSON response from the server
    localStorage.setItem('token', result.token); // Store the token in local storage

    // Redirect to a protected page or update the UI
    router.push('/user'); // Use router.push to redirect to a user page
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed');
  }
};
</script>

<template>
  <globalNavBar/>
  <div id="page">
    <div id="login-title">Login</div>
    <!-- Use @submit.prevent to call onLoginSubmit when the form is submitted -->
    <form @submit.prevent="onLoginSubmit">
      <input
        type="text"
        v-model="formData.username"  
        placeholder="Username"
        required
      />
      <input
        type="password"
        v-model="formData.password"  
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>

    <div class="separator"></div>

    <div id="registration-title">Register</div>
    <form action="/auth/register" method="POST">
      <input type="text" name="username" placeholder="Username" required />
      <input type="text" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<style scoped>
  /* Styles for the page */
  #page {
    position: relative;
  }

  #login-title {
    position: absolute;
    margin-top: 7%;
    margin-left: 34.5%;
    font-size: 24px;
    border-bottom: 2px solid black;
    border-spacing: 10px;
    padding: 0px 30px;
  }

  #login-form {
    display: flex;
    flex-direction: column;
    position: absolute;
    margin-top: 9%;
    margin-left: 30%;
    width: 15%;
  }

  .separator {
    position: absolute;
    border-left: 2px solid black;
    margin-left: 47.5%;
    height: 10000px;
    transform: translate(0px, -100px);
    z-index: -1;
  }

  #registration-title {
    position: absolute;
    margin-top: 7%;
    margin-left: 54%;
    font-size: 24px;
    border-bottom: 2px solid black;
    padding: 0px 30px;
  }

  #registration-form {
    display: flex;
    flex-direction: column;
    position: absolute;
    margin-top: 9%;
    margin-left: 50%;
    width: 15%;
  }
</style>