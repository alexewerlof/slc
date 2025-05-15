import { isInArr, isStr } from './validation.js'

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

export async function fetchTextFiles(...paths) {
    return await Promise.all(paths.map(fetchTextFile))
}

export async function fetchTextFilesAndConcat(...paths) {
    const contents = await fetchTextFiles(...paths)
    return contents.join('\n')
}

export async function fetchMessage(role, ...paths) {
    if (!isInArr(role, ['system', 'user', 'assistant'])) {
        throw new Error(`Invalid role: ${role}`)
    }

    const contentsArr = await fetchTextFiles(...paths)

    return {
        role,
        content: contentsArr.join('\n'),
    }
}
