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
        
        const data = await response.json();
        
        return data;
        
    } catch (error) {
        console.error('Error en la petición getCadenas', error);
    }
}

export default getCadenas;