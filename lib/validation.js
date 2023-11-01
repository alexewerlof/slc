export function isStr(x) {
    return typeof x === 'string'
}

export function isNum(x) {
    return typeof x === 'number' && !Number.isNaN(x)
}

export function isBetween(x, min, max) {
    if (!isNum(min)) {
        throw new TypeError(`"min" must be a number. Got ${min}`)
    }
    if (!isNum(max)) {
        throw new TypeError(`"max" must be a number. Got ${max}`)
    }
    if (min >= max) {
        throw new RangeError(`"min" must be less than "max". Got min=${min} and max=${max}`)
    }
    return isNum(x) && x >= min && x <= max
}

export function isObj(x) {
    return typeof x === 'object' && x !== null && !Array.isArray(x)
}

export function invalidRequiredString(val) {
    return typeof val !== 'string' || val.trim() === ''
}

export function invalidOptionalString(val) {
    return typeof val !== 'undefined' && typeof val !== 'string'
}

export function invalidRequiredObject(val) {
    return val === null || typeof val !== 'object' || Array.isArray(val)
}

export function invalidOptionalPositiveInteger(val) {
    return !Number.isInteger(val) || val < 0
}

export function validateParams(params) {
    if (invalidRequiredObject(params)) {
        throw new Error('Expected an object')
    }

    const {
        title = '',
        description = '',
        unit = 'event',
        good,
        valid = 'all',
        timeSlot = 0,
    } = params

    if (invalidOptionalString(title)) {
        throw new Error(`When present, "title" must be a string. Got ${title}`)
    }

    if (invalidOptionalString(description)) {
        throw new Error(`When present, "description" must be a string. Got ${description}`)
    }

    if (invalidOptionalString(unit)) {
        throw new Error(`When present, "unit" must be a string. Got ${unit}`)
    }

    if (invalidRequiredString(good)) {
        throw new Error(`"good" must be a string. Got ${good}`)
    }

    if (invalidOptionalPositiveInteger(timeSlot)) {
        throw new Error(`When present, "timeSlot" must be a finite integer >= 0. Got ${timeSlot}`)
    }

    return {
        title,
        description,
        unit,
        good,
        valid,
        timeSlot,
    }
}
