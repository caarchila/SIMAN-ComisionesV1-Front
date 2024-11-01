import { BASE_URL, headers } from "./base.api";

async function getPaises() {
    const sessionId = localStorage.getItem('session');
    try {
        const response = await fetch(BASE_URL + '/paises/get-paises', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ sessionId }) // Send the sessionId in the body, 
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

export default getPaises;