import { BASE_URL, BASE_URL_SERVER } from "./base.api";

async function deleteProceso(id) {

    console.log(id);
    
    const response = await fetch("/rrhh-comisiones/procesos/delete", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({ id }), 
    });

    if (!response.ok) {
        throw new Error('Ocurrió un error al eliminar el proceso');
    }

    return await response.json();
}

export default deleteProceso;