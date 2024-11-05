import { BASE_URL } from "./base.api";

const logout = async () => {
    try {
        const response = await fetch('/rrhh-comisiones/auth/logout',  {
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
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

export default logout;