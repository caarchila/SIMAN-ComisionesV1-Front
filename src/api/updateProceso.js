async function updateProceso(data) {
    const response = await fetch('http://localhost:8080/procesos/update', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export default updateProceso;