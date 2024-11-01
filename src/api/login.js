import { BASE_URL } from "./base.api";

async function loginRequest(username, password) {
    const response = await fetch(BASE_URL + 'auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
}

export default loginRequest;