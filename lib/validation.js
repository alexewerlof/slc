export function isDef(x) {
    return typeof x !== 'undefined'
}

export function isFn(x) {
    return typeof x === 'function'
}

export function isObj(x) {
    return typeof x === 'object' && x !== null && !isArr(x)
}

export function hasProp(x, propName) {
    return isObj(x) && (propName in x)
}

export function hasOProp(x, propName) {
    return isObj(x) && Object.hasOwnProperty.call(x, propName)
}

export function isStr(x) {
    return typeof x === 'string'
}

export function isStrLen(x, min, max) {
    if (!isStr(x)) {
        return false
    }

    if (max === undefined) {
        return x.length >= min
    }

    return inRange(x.length, min, max)
}

export function isNum(x) {
    return typeof x === 'number' && !Number.isNaN(x)
}

export function isInt(x) {
    return Number.isInteger(x)
}

export function isPosInt(x) {
    return isInt(x) && x > 0
}

export function inRange(x, min, max) {
    if (!isNum(x)) {
        return false
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
    return inRange(x, min, max) && isPosInt(x)
}

export function isInstance(x, Class) {
    if (!isObj(x)) {
        return false
    }
    return Object.getPrototypeOf(x) === Class.prototype
}

function isAlphaNumChar(x) {
    return /^[a-zA-Z0-9]$/.test(x)
}

/**
 * Based on [OpenSLO spec](https://github.com/OpenSLO/OpenSLO?tab=readme-ov-file#general-schema),
 * all implementations must at least support object names that follow RFC1123:
 * - are up to 63 characters in length
 * - contain lowercase alphanumeric characters or -
 * - start with an alphanumeric character
 * - end with an alphanumeric character
 *
 * Implementations are additionally encouraged to support names that:
 * - are up to 255 characters in length
 * - contain lowercase alphanumeric characters or -, ., |, /, \
 */
export function isOsloName(x) {
    if (!isStr(x)) {
        return false
    }
    if (x.length < 1 || x.length > 255) {
        return false
    }
    if (x.toLocaleLowerCase() !== x) {
        // There's at least one upper case character
        return false
    }
    const allChars = x.split('')
    if (!isAlphaNumChar(allChars[0])) {
        return false
    }
    if (!isAlphaNumChar(allChars[allChars.length - 1])) {
        return false
    }
    for (const ch of allChars) {
        const isAllowed = isAlphaNumChar(ch) || ch === '-'
        if (!isAllowed) {
            return false
        }
    }
    return true
}

export function isArr(x) {
    return Array.isArray(x)
}

export function isArrIdx(arr, x) {
    return isArr(arr) && isInt(x) && x >= 0 && x < arr.length
}

export function isInArr(x, arr) {
    if (!isArr(arr)) {
        throw new TypeError(`isInArr(): "arr" must be an array. Got ${arr}`)
    }
    return arr.includes(x)
}

export function isSameArr(a, b) {
    if (!isArr(a)) {
        throw new TypeError(`isSameArr(): "a" must be an array. Got ${JSON.stringify(a)}`)
    }
    if (!isArr(b)) {
        throw new TypeError(`isSameArr(): "b" must be an array. Got ${JSON.stringify(b)}`)
    }
    if (a === b) {
        return true
    }
    return a.length === b.length && a.every((v, i) => v === b[i])
}
