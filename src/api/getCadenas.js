import { BASE_URL, headers } from "./base.api";

async function getCadenas() {
    try {
        const response = await fetch(BASE_URL + '/cadenas/get-cadenas', {
            headers: headers
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