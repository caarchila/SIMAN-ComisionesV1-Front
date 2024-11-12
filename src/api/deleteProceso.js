import { BASE_URL } from "./base.api";

async function deleteProceso(id) {

    const response = await fetch(`${BASE_URL}/procesos/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error('Ocurrió un error al eliminar el proceso');
    }

    return await response.json();
}

export default deleteProceso;
