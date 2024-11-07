import { BASE_URL } from "./base.api";

async function updateProceso(data) {
    const response = await fetch('/rrhh-comisiones/procesos/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export default updateProceso;