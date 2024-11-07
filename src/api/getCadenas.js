import { BASE_URL} from "./base.api";

async function getCadenas() {
    
    try {
        const response = await fetch('http://localhost:8080/cadenas/get-cadenas',  {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        
        return data;
        
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export default getCadenas;