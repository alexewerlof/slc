import { isDef, isInstance, isObj } from '../validation.js'

export async function postMessage(url, data, extraHeaders = {}) {
    if (!isInstance(url, URL)) {
        throw new TypeError(`url must be an instance of URL. Got ${url}`)
    }
    if (!isObj(data)) {
        throw new TypeError(`data must be an object. Got ${data}`)
    }
    const headers = {
        'Content-Type': 'application/json',
    }
    if (isDef(extraHeaders)) {
        if (!isObj(extraHeaders)) {
            throw new TypeError(`extraHeaders must be an object. Got ${extraHeaders}`)
        }
        for (const [name, value] of Object.entries(extraHeaders)) {
            headers[name] = value
        }
    }
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        const errorResponse = await response.json()
        throw new Error(`HTTP POST ${url} status: ${response.status}: ${errorResponse.error.message}`)
    }
    return response.json()
}
