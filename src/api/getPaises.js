import { BASE_URL } from "./base.api";

async function getPaises() {
    try {
        const response = await fetch('http://localhost:8080/paises/get-paises', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

export default getPaises;