export function isObj(x) {
    return typeof x === 'object' && x !== null && !Array.isArray(x)
}

export function isStr(x) {
    return typeof x === 'string'
}

export function isNum(x) {
    return typeof x === 'number' && !Number.isNaN(x)
}

export function isBetween(x, min, max) {
    if (!isNum(min)) {
        throw new TypeError(`isBetween(): "min" must be a number. Got ${min}`)
    }
    if (!isNum(max)) {
        throw new TypeError(`isBetween(): "max" must be a number. Got ${max}`)
    }
    if (min >= max) {
        throw new RangeError(`isBetween(): "min" must be less than "max". Got min=${min} and max=${max}`)
    }

    return isNum(x) && x >= min && x <= max
}

export function isPIntBetween(x, min, max) {
    return isBetween(x, min, max) && Number.isInteger(x) && x > 0
}
