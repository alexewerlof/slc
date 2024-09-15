import { config } from '../config.js'
import { isObj, isStr } from './validation.js'

const apiVersion = `slc/v${config.urlVer}`

export function osloObj(kind, metadata = {}, spec = {}) {
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

export function sliObj(sli) {
    return osloObj('Indicator', {
        name: sli.metricName,
        // displayname: sli.displayname,
    }, {
        good: sli.good,
        total: `All eventNames`,
    })
}

export function sloObj(slo) {
    const name = slo.toString()
    return osloObj('Objective', {
        name,
        // displayname: slo.displayname,
    }, {
        targetPercent: slo.perc,
        indicator: sliObj(slo.sli),
    })
}