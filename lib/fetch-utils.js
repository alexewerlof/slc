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

/**
 * Loads a HTML template from a HTML file next to the JS file and returns it as a string.
 *
 * @param {string} htmlUrlStr the path to the HTML file
 */
export async function getText(htmlUrlStr) {
    const response = await fetch(htmlUrlStr)
    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(`HTTP GET ${url} status: ${response.status}: ${errorResponse.error.message}`)
    }
    return await response.text()
}
