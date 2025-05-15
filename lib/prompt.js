import { isStr } from './validation.js'

async function fetchTextFile(path) {
    if (!isStr(path)) {
        throw new Error(`Invalid prompt path: ${path}`)
    }
    const response = await fetch(path)
    if (!response.ok) {
        throw new Error(`Failed to fetch prompt ${path} HTTP ${response.status}`)
    }
    return await response.text()
}

export async function fetchTextFilesAndConcat(...paths) {
    const contents = await Promise.all(paths.map(fetchTextFile))
    return contents.join('\n')
}
