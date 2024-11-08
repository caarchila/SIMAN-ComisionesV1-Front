import { BASE_URL, BASE_URL_SERVER } from "./base.api";

async function loginRequest(username, password) {
    const response = await fetch("/rrhh-comisiones/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error('Ocurrió un error al iniciar sesión');
    }

    const data = await response.json();

    return data;
}

export default loginRequest;