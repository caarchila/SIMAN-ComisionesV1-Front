import { BASE_URL, headers } from "./base.api";

async function getCadenas() {

    const sessionId = localStorage.getItem('session');
    
    try {
        const response = await fetch(BASE_URL + '/cadenas/get-cadenas',  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ sessionId }) // Send the sessionId in the body, 
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data);
        
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export default getCadenas;