import { config } from '../config.js'
import { isObj, isStr } from './validation.js'

const apiVersion = `slc/v${config.urlVer}`

export function metadataObj(name, displayName, labels = {}, annotations = {}) {
    if (name !== undefined) {
        if (!isStr(name)) {
            throw new Error(`name must be a string. Got ${name}`)
        }
    }
    if (!isObj(labels)) {
        throw new Error(`labels must be an object. Got ${labels}`)
    }
    if (!isObj(annotations)) {
        throw new Error(`annotations must be an object. Got ${annotations}`)
    }

    return {
        name,
        displayName,
        labels,
        annotations,
    }
}

export function crdObj(kind, metadata = {}, spec = {}) {
    if (!isObj(metadata)) {
        throw new Error(`metadata must be an object. Got ${metadata}`)
    }
    if (!isObj(spec)) {
        throw new Error(`spec must be an object. Got ${spec}`)
    }

    return {
        apiVersion,
        kind,
        metadata,
        spec,
    }
}
