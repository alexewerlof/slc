import { config } from '../config.js'
import { isObj, isStr } from '../dependencies/jty.js'

const apiVersion = `slc/v${config.urlVer}`

/**
 * Builds a CRD-style metadata object.
 * @param {string|undefined} name resource name (must be a string if provided)
 * @param {string} displayName human-readable display name
 * @param {Object} [labels={}] key-value label map
 * @param {Object} [annotations={}] key-value annotation map
 * @returns {{ name: string|undefined, displayName: string, labels: Object, annotations: Object }}
 */
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

/**
 * Builds a CRD-style resource object with apiVersion, kind, metadata, and spec.
 * @param {string} kind the resource kind (e.g. 'SLO')
 * @param {Object} [metadata={}]
 * @param {Object} [spec={}]
 * @returns {{ apiVersion: string, kind: string, metadata: Object, spec: Object }}
 */
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
