<script setup>
    import globalNavBar from '@/components/standardjs/navbar.vue'
    function goToLogin() {
        this.$router.push('/auth')
    }




// --------------------- LOGIN HANDLING -----------------------

    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    //finds user
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token) {
        // Redirect to login page if not authenticated
        window.location.href = this.$router.push('/auth');
    } else {
        // Fetch user data from the server
        fetch('http://localhost:5000/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('user-info').textContent = `Hello, ${data.username}!`;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch user data');
        });
    }
    // Logout function
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = this.$router.push('/auth');
    });
</script>




<template>
    <globalNavBar/>
    <div id="page">
        <div id="login-title">Login</div>
        <form id="login-form" action="/auth/login" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
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