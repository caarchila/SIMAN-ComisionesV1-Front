import { BASE_URL, headers } from "./base.api";

export async function postProceso(data) {
    const response = await fetch(BASE_URL + "/procesos/save",  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ data }) // Send the sessionId in the body, 
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}