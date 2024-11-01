
const token = localStorage.getItem('token');

export const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer token`
}

export const BASE_URL = 'http://localhost:8080/';

