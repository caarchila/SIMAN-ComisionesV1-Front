import { BASE_URL, headers } from "./base.api";

const getProcesos = async () => {

    const sessionId = localStorage.getItem('session');

    const response = await fetch('http://localhost:8080/procesos/get-procesos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ sessionId }) // Send the sessionId in the body, 
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Error fetching procesos:', error);
        return;
    }

    const procesos = await response.json();
    return procesos;
};

export default getProcesos;