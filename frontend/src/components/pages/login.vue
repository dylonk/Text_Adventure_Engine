<script setup>
import { ref } from 'vue';
import globalNavBar from '@/components/standardjs/navbar.vue';
import { useRouter } from 'vue-router';

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

const router = useRouter();

const onLoginSubmit = async (event) => {
  event.preventDefault();
  const plainFormData = { ...formData.value };
  console.log('Form data being sent for login:', plainFormData);
  try {
    const response = await fetch('http://localhost:5000/auth/login', {
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
    const response = await fetch('http://localhost:5000/auth/register', {
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
    router.push('/login');
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
/* For demonstration only. For a site-wide font, move the @import and body font-family
   rules to a global CSS file (e.g., frontend/src/assets/base.css or a global style in App.vue). */
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap');

#page {
  display: flex;
  flex-direction: row;
  height: 90vh;
  background: #1d1f21;
  color: #e0e0e0;
  font-family: 'Pixelify Sans', sans-serif;
  padding: 20px;
}

#login,
#registration {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  background: #2c2f33;
  border: 2px solid #e0e0e0;
  box-shadow: 6px 6px 0 #000;
  padding: 20px;
  border-radius: 8px;
}

.login-title,
.registration-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 0 #000;
}

form {
  display: flex;
  flex-direction: column;
  width: 80%;
}

input {
  margin-bottom: 10px;
  padding: 10px;
  background: #1d1f21;
  border: 2px solid #e0e0e0;
  color: #e0e0e0;
  font-size: 1rem;
  border-radius: 4px;
  box-shadow: inset 2px 2px 0 #000;
}

button {
  padding: 10px;
  background: #e74c3c;
  border: none;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  box-shadow: 4px 4px 0 #000;
  border-radius: 4px;
  transition: background 0.2s;
}

button:hover {
  background: #c0392b;
}

#separator {
  width: 2px;
  background: #e0e0e0;
  margin: 0 10px;
}
</style>
