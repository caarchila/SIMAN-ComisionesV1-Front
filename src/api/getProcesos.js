import { BASE_URL} from "./base.api";

const getProcesos = async () => {

    const response = await fetch('http://localhost:8080/procesos/get-procesos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Error fetching procesos:', error);
        return;
    }

    const procesos = await response.json();
    return procesos;

};

export default getProcesos;