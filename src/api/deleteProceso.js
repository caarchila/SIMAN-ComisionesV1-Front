import { BASE_URL } from "./base.api";

async function deleteProceso(id) {
    const response = await fetch( `http://localhost:8080/procesos/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({ id }), 
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
}

export default deleteProceso;