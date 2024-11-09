document.getElementById('login-form').addEventListener('submit', async function(event) {
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
