const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // for Vite



//this is modular now. The function gives you whatever data you want on the current user, either everything or a specific attribute.
export async function fetchUserData(attribute = null) {
    console.log("attempting to fetch user data", attribute);
    const token = localStorage.getItem('token');  // Get the token from localStorage

    if (!token) {
        return; // If no token, do not proceed
    }

    try {
        const response = await fetch('${API_BASE_URL}/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the JWT token in the Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log("fetched user data", data[attribute]);
        return attribute ? data[attribute] : data;
    } catch (error) {
        console.warn('Error fetching user profile:', error);
    }
}
