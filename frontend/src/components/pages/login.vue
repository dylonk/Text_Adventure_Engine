<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite

// Inject the refresh function from App.vue
const refreshNavbar = inject('refreshNavbar', null);


const formData = ref({
  email: '',
  password: ''
});

const registrationData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const router = useRouter();

const showLogin = ref(true);

const toggleForm = () => {
  showLogin.value = !showLogin.value;
};

const onLoginSubmit = async (event) => {
  console.log('Form data being sent for login:', formData.value);
  event.preventDefault();
  const plainFormData = { ...formData.value };
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plainFormData)
    });
    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Login failed: ${errorDetail}`);
    }
    const result = await response.json();
    localStorage.setItem('token', result.token);
    // Refresh the navbar before navigating
    if (refreshNavbar) {
      refreshNavbar();
    }
    router.push('/user');
  } catch (error) {
    console.error('Error:', error.message);
    alert(`Error: ${error.message}`);
  }
};

const onRegisterSubmit = async (event) => {
  event.preventDefault();
  console.log('Form data being sent for registration:', registrationData.value);
  if (registrationData.value.password !== registrationData.value.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData.value)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    const result = await response.json();
    console.log(result.message);
    alert('Registration successful!');
  } catch (error) {
    console.error('Error:', error);
    alert('Registration failed');
  }
};
</script>

<template>
  <div id="page">
    <!-- Login Form -->
    <div v-if="showLogin" id="login" class="auth-card">
      <div class="title-container">
        <div class="login-title">Login</div>
        <button type="button" class="swap-button" @click="toggleForm">
          Or create a new account!
        </button>
      </div>
      <form @submit.prevent="onLoginSubmit">
        <input
          type="text"
          v-model="formData.email"
          placeholder="Email"
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

    <!-- Registration Form -->
    <div v-else id="registration" class="auth-card">
      <div class="title-container">
        <div class="registration-title">Register</div>
        <button type="button" class="swap-button" @click="toggleForm">
          Log into an existing account
        </button>
      </div>
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
@import url("https://fonts.googleapis.com/css2?family=Josefin+Sans");

#page {
  display: flex;
  flex-direction: row;
  flex: 1;
  background: linear-gradient(0deg, rgb(194, 215, 217) 0%, rgba(126, 128, 232, 0.645) 80%);
  color: #000;
  font-family: 'RetroQuill', sans-serif;
  padding: 2rem;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.auth-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  max-width: 500px;
  background: #d8e0e8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  box-sizing: border-box;
}

.title-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0.5rem 1rem;
}

.login-title,
.registration-title {
  font-family: 'Josefin Sans';
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: #000;
  text-align: left;
  flex-shrink: 0;
}

.swap-button {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: rgba(104, 97, 199, 0.8);
  font-size: 0.9rem;
  font-family: 'Josefin Sans';
  font-weight: 400;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  text-align: right;
  margin: 0;
  margin-top: 0;
  box-shadow: none;
  white-space: nowrap;
  flex-shrink: 0;
}

.swap-button:hover {
  color: rgba(104, 97, 199, 1);
  background: rgba(104, 97, 199, 0.1);
  transform: none;
  box-shadow: none;
  filter: none;
}

.swap-button:active {
  transform: none;
  box-shadow: none;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

input {
  margin-bottom: 0;
  padding: 0.75rem;
  background: rgb(232, 237, 234);
  border: 1px solid rgba(104, 97, 199, 0.403);
  color: #333;
  font-size: 1rem;
  font-family: 'Josefin Sans';
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;
  transition: all 0.2s ease;
}

input:focus {
  outline: 2px solid rgba(104, 97, 199, 0.6);
  background: white;
}

input::placeholder {
  color: #666;
}

form button[type="submit"] {
  padding: 16px;
  background: #3d3d3d;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-family: 'RetroQuill', sans-serif;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.185), 0 2px 4px rgba(0, 0, 0, 0.185);
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

form button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  filter: brightness(1.05);
}

form button[type="submit"]:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

@media (max-width: 768px) {
  #page {
    padding: 1rem;
  }

  .auth-card {
    max-width: 100%;
    width: 100%;
  }
}
</style>
