import { isStr } from './validation.js'

export async function fetchPrompt(path) {
    if (!isStr(path)) {
        throw new Error(`Invalid prompt path: ${path}`)
    }
    const response = await fetch(path)
    if (!response.ok) {
        throw new Error(`Failed to fetch prompt ${path} HTTP ${response.status}`)
    }
    return await response.text()
}
