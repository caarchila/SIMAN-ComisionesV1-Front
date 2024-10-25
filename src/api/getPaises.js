import { BASE_URL, headers } from "./base.api";

async function getPaises() {
    try {
        const response = await fetch(BASE_URL + '/paises/get-paises', {
            headers: headers
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