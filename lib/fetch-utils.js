export async function postMessage(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(`HTTP POST ${url} status: ${response.status}: ${errorResponse.error.message}`)
    }
    return response.json()
}
