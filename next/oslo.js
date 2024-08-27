const apiVersion = 'openslo/v1'

function osloObj(kind, metadata = {}, spec = {}) {
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