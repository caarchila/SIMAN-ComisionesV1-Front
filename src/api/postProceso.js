import { BASE_URL, BASE_URL_SERVER} from "./base.api";

export async function postProceso(data) {
    const response = await fetch("/rrhh-comisiones/procesos/save",  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify( data ) // 
    });
    if (!response.ok) {
        throw new Error('Ocurrió un error al guardar el proceso');
    }

    return response.json();
}