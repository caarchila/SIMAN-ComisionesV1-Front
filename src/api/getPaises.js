import { BASE_URL, BASE_URL_SERVER } from "./base.api";

async function getPaises() {
    try {
        const response = await fetch("/rrhh-comisiones/paises/get-paises", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Ocurrió un error al obtener los paises');
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error en la petición getPaises', error);
    }
}

export default getPaises;