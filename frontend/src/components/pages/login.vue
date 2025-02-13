<script setup>
import { ref } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';
import { useRouter } from 'vue-router'; // import useRouter from Vue

// Create refs to store form data
const formData = ref({
  username: '',
  password: ''
});

const registrationData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Access the router to redirect after login
const router = useRouter();

// Function to handle login submission
const onLoginSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Make a shallow copy of the form data to avoid sending reactive objects
  const plainFormData = { ...formData.value };

  console.log('Form data being sent for login:', plainFormData);  // Log the plain form data for debugging

  try {
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plainFormData) // Send the plain object (no reactivity)
    });

    if (!response.ok) {
      const errorDetail = await response.text();  // Get error response details
      throw new Error(`Login failed: ${errorDetail}`);
    }

    const result = await response.json(); // Parse the JSON response from the server
    localStorage.setItem('token', result.token); // Store the token in local storage
    router.push('/user'); // Redirect to a protected page
  } catch (error) {
    console.error('Error:', error.message); // Show detailed error message
    alert(`Error: ${error.message}`); // Display the error
  }
};


// Function to handle registration submission
const onRegisterSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission
  
  console.log('Form data being sent for registration:', registrationData.value);  // Log the form data to ensure it's correct

  // Check if passwords match before proceeding
  if (registrationData.value.password !== registrationData.value.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData.value) // Send the form data as JSON
    });

    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response as JSON
      throw new Error(errorData.error || 'Registration failed');
    }

    const result = await response.json();  // Parse the JSON response from the server
    console.log(result.message);  // Success message or response from the server
    alert('Registration successful!');  // Show success message
    router.push('/login');  // Redirect to login page after successful registration
  } catch (error) {
    console.error('Error:', error);
    alert('Registration failed');
  }
};
</script>

<template>
  <globalNavBar />
  <div id="page">
    <div id="login">
      <div class="login-title">Login</div>
      <!-- Login Form -->
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
    </div>

    <div id="separator"></div>

    <div id="registration">
      <div class="registration-title">Register</div>
      <!-- Registration Form -->
      
      <form @submit.prevent="onRegisterSubmit">
        <input
          type="text"
          v-model="registrationData.username"
          placeholder="Username"
          required
        />
        <input
          type="text"
          v-model="registrationData.email"
          placeholder="Email"
          required
        />
        <input
          type="password"
          v-model="registrationData.password"
          placeholder="Password"
          required
        />
        <input
          type="password"
          v-model="registrationData.confirmPassword"
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
  /* Styles for the page */
  #page {
    display: flex;
    flex-direction: row;
    height: 90%;
  }

  #login {
    width: 50%;
    float: left;
  }

  .login-title {
    text-align: center;
    font-size: 24px;
    margin-top: 20%;
  }

  #separator {
    width: 0%;
    top: 0;
    border: 2px solid black;
  }

  #registration {
    width: 50%;
    float: right;
  }

  .registration-title {
    text-align: center;
    font-size: 24px;
    margin-top: 20%;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    transform: translate(50%);
    margin-top: 10px;
  }

  input {
    margin-bottom: 7px;
  }
</style>
