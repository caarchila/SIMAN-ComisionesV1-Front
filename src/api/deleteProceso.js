import { BASE_URL } from "./base.api";

async function deleteProceso(id) {

    const response = await fetch(`/rrhh-comisiones/procesos/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    });

    return await response.json();
}

export default deleteProceso;
