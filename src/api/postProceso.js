import { BASE_URL} from "./base.api";

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
        throw new Error('Network response was not ok');
    }

    return response.json();
}