import { invalidRequiredObject, invalidRequiredString } from './validation.js'

export function encodeState(obj) {
    if (invalidRequiredObject(obj)) {
        throw new Error(`"obj" must be an object. Got ${obj}`)
    }
    const jsonString = JSON.stringify(obj)
    return btoa(jsonString)
}

export function decodeState(base64String) {
    if (invalidRequiredString(base64String)) {
        throw new Error(`"param" must be a string. Got ${base64String}`)
    }
    const jsonString = atob(base64String)
    return JSON.parse(jsonString)
}
