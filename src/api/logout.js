import { BASE_URL, BASE_URL_SERVER } from "./base.api";

const logout = async () => {
    try {
        const response = await fetch("/rrhh-comisiones/auth/logout",  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Ocurrió un error al cerrar sesión');
        }
        const data = await response.json();
    } catch (error) {
        console.error('Error en la petición logout', error);
    }
};

export default logout;