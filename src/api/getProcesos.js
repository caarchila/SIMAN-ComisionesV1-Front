import { BASE_URL, headers } from "./base.api";

async function getProcesos() {
    try {
        
        const response = await fetch( BASE_URL + '/procesos/get-procesos', {
            headers: headers
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

export default getProcesos;