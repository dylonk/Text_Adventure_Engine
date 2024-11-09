<script setup>
    import { ref } from 'vue';
    import globalNavBar from '@/components/standardjs/navbar.vue'
    function goToLogin() {
        this.$router.push('/auth');
    }

    const loginElement = document.getElementById('login-form')

    function onLoginSubmit(){


      //-----LOGIN SUBMISSION
        document.getElementById(loginElement).addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent the default form submission
            const form = event.target;//gets the form targheted by the event.
            const formData = new FormData(form);//creates a formdata object from the form.
            const data = {  //creates an object containing the form data.
                username: formData.get('username'),
                password: formData.get('password')


            };

            try {
                const response = await fetch('http://localhost:5000/auth/login', {   //sends a post to auth/login with the form data
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)//converts the data object to a JSON string
                });

                if (!response.ok) {
                    throw new Error('Login failed');
                }

                const result = await response.json();//parses the JSON response from the server
                localStorage.setItem('token', result.token); // Store the token in local storage

                // Redirect to a protected page or update the  UI
                window.location.href = 'profile.html';//could send to a protected page.
            } catch (error) {
                console.error('Error:', error);
                alert('Login failed');
            }
        });
    }
</script>

<template>
    <globalNavBar/>
    <div id="page">
        <div id="login-title">Login</div>
        <form id="login-form" action="/auth/login" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button @click="submitLogin('login-form')" type="submit">Login</button>
        </form>
        <div class="separator"></div>
        <div id="registration-title">Register</div>
        <form id="registration-form" action="/auth/register" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="text" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
            <button type="submit">Register</button>
        </form>
    </div>
</template>

<style scoped>
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