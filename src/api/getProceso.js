import { BASE_URL } from "./base.api";

async function getProceso(id) {

    console.log(id);
    
    // Create the request body
    const requestBody = { id }; // This will create { id: 213 }


    const response = await fetch("/rrhh-comisiones/procesos/procesoById", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({id: requestBody.id.id} )
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export default getProceso;