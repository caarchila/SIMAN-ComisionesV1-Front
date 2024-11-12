import { BASE_URL, BASE_URL_SERVER } from "./base.api";

async function updateProceso(data) {
    const response = await fetch(BASE_URL + "/procesos/update", {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Ocurrió un error al actualizar el proceso');
    }

    return response.json();
}

export default updateProceso;