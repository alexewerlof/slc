/**
 * Returns true if the value is not undefined.
 * @param {*} x
 * @returns {boolean}
 */
export function isDef(x) {
    return typeof x !== 'undefined'
}

/**
 * Returns true if the value is a function.
 * @param {*} x
 * @returns {boolean}
 */
export function isFn(x) {
    return typeof x === 'function'
}

/**
 * Returns true if the value is a plain (non-null, non-array) object.
 * @param {*} x
 * @returns {boolean}
 */
export function isObj(x) {
    return typeof x === 'object' && x !== null && !isArr(x)
}

/**
 * Returns true if the object has the property (own or inherited).
 * @param {*} x
 * @param {string} propName
 * @returns {boolean}
 */
export function hasProp(x, propName) {
    return isObj(x) && propName in x
}

/**
 * Returns true if the object has the property as its own (non-inherited) property.
 * @param {*} x
 * @param {string} propName
 * @returns {boolean}
 */
export function hasOProp(x, propName) {
    return isObj(x) && Object.hasOwnProperty.call(x, propName)
}

/**
 * Returns true if the value is a string.
 * @param {*} x
 * @returns {boolean}
 */
export function isStr(x) {
    return typeof x === 'string'
}

/**
 * Returns true if the value is a string with length in the range [min, max].
 * @param {*} x
 * @param {number} min minimum length (inclusive)
 * @param {number} [max] maximum length (inclusive); omit to only check the minimum
 * @returns {boolean}
 */
export function isStrLen(x, min, max) {
    if (!isStr(x)) {
        return false
    }

    if (max === undefined) {
        return x.length >= min
    }

    return inRange(x.length, min, max)
}

/**
 * Returns true if the value is a boolean.
 * @param {*} x
 * @returns {boolean}
 */
export function isBool(x) {
    return typeof x === 'boolean'
}

/**
 * Returns true if the value is a finite number (not NaN).
 * @param {*} x
 * @returns {boolean}
 */
export function isNum(x) {
    return typeof x === 'number' && !Number.isNaN(x)
}

/**
 * Returns true if the value is a safe integer.
 * @param {*} x
 * @returns {boolean}
 */
export function isInt(x) {
    return Number.isInteger(x)
}

/**
 * Returns true if the numeric value is within [min, max] inclusive.
 * @param {*} x value to test
 * @param {number} min inclusive lower bound
 * @param {number} max inclusive upper bound
 * @returns {boolean}
 */
export function inRange(x, min, max) {
    if (!isNum(x)) {
        return false
    }
    if (!isNum(min)) {
        throw new TypeError(`inRange(): "min" must be a number. Got ${min} (${typeof min})`)
    }
    if (!isNum(max)) {
        throw new TypeError(`inRange(): "max" must be a number. Got ${max} (${typeof max})`)
    }
    if (min >= max) {
        throw new RangeError(`inRange(): "min" must be less than "max". Got min=${min} and max=${max}`)
    }

    return x >= min && x <= max
}

/**
 * Returns true if the value is an integer within [min, max] inclusive.
 * @param {*} x value to test
 * @param {number} min inclusive lower bound
 * @param {number} max inclusive upper bound
 * @returns {boolean}
 */
export function inRangeInt(x, min, max) {
    return isInt(x) && inRange(x, min, max)
}

/**
 * Returns true if the value is an instance of the given class (direct prototype match).
 * @param {*} x
 * @param {Function} Class the constructor to check against
 * @returns {boolean}
 */
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

/**
 * Returns true if the value is an array.
 * @param {*} x
 * @returns {boolean}
 */
export function isArr(x) {
    return Array.isArray(x)
}

/**
 * Returns true if x is a valid index into arr.
 * @param {Array} arr
 * @param {*} x
 * @returns {boolean}
 */
export function isArrIdx(arr, x) {
    return isArr(arr) && isInt(x) && x >= 0 && x < arr.length
}

/**
 * Returns true if x is a member of arr.
 * @param {*} x
 * @param {Array} arr
 * @returns {boolean}
 */
export function isInArr(x, arr) {
    if (!isArr(arr)) {
        throw new TypeError(`isInArr(): "arr" must be an array. Got ${arr}`)
    }
    return arr.includes(x)
}

/**
 * Returns true if two arrays have identical length and equal elements (===) at each index.
 * @param {Array} a
 * @param {Array} b
 * @returns {boolean}
 */
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

/**
 * Returns true if x is a string that can be parsed as a valid URL.
 * @param {*} x
 * @returns {boolean}
 */
export function isUrlStr(x) {
    if (!isStr(x)) {
        return false
    }
    try {
        new URL(x)
        return true
    } catch (_err) {
        return false
    }
}
