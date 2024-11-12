import { BASE_URL, BASE_URL_SERVER } from "./base.api";

async function getProceso(id) {

    console.log(id);
    
    // Create the request body
    const requestBody = { id }; // This will create { id: 213 }


    const response = await fetch(BASE_URL + "/procesos/procesoById", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({id: requestBody.id.id} )
    });

    if (!response.ok) {
        throw new Error('Ocurrió un error al obtener el proceso');
    }

    return response.json();
}

export default getProceso;