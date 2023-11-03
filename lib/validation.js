export function isObj(x) {
    return typeof x === 'object' && x !== null && !Array.isArray(x)
}

export function isStr(x) {
    return typeof x === 'string'
}

export function isNum(x) {
    return typeof x === 'number' && !Number.isNaN(x)
}

export function inRange(x, min, max) {
    if (!isNum(x)) {
        throw new TypeError(`inRange(): "x" must be a number. Got ${x}`)
    }
    if (!isNum(min)) {
        throw new TypeError(`inRange(): "min" must be a number. Got ${min}`)
    }
    if (!isNum(max)) {
        throw new TypeError(`inRange(): "max" must be a number. Got ${max}`)
    }
    if (min >= max) {
        throw new RangeError(`inRange(): "min" must be less than "max". Got min=${min} and max=${max}`)
    }

    return x >= min && x <= max
}

// Same as inRange but also check shtat x is a positive integer
export function inRangePosInt(x, min, max) {
    return inRange(x, min, max) && Number.isInteger(x) && x > 0
}
