const logout = async () => {
    try {
        const response = await fetch('http://localhost:8080/auth/logout',  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Logout successful:', data);
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

export default logout;