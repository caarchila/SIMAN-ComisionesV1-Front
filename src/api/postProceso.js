import { BASE_URL, headers } from "./base.api";

export async function postProceso(data) {
    const response = await fetch(BASE_URL + "/procesos/save", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}