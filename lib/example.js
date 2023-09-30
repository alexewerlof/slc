export function invalidRequiredString(val) {
    return typeof val !== 'string' || val.trim() === ''
}

export function invalidOptionalString(val) {
    return typeof val !== 'undefined' && typeof val !== 'string'
}

export function validateExample(val) {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
        throw new Error('Expected an object')
    }

    const { title = '', description = '', good, valid = '', unit } = val

    if (invalidOptionalString(title)) {
        throw new Error(`When present, "title" must be a string. Got ${title}`)
    }

    if (invalidOptionalString(description)) {
        throw new Error(`When present, "description" must be a string. Got ${description}`)
    }

    if (invalidRequiredString(good)) {
        throw new Error(`"good" must be a string. Got ${good}`)
    }

    const unitType = typeof unit

    if (unitType === 'number') {
        if (!Number.isInteger(unit) || unit <= 0) {
            throw new Error(`When "unit" is a number, it must be a finite integer greater than 0. Got ${unit}`)
        }
        if (invalidOptionalString(valid)) {
            throw new Error(`When "unit" is a number, "valid" is an optional string. Got ${valid}`)
        }
        return {
            title,
            description,
            good,
            valid,
            unit,
        }    
    } else if (unitType === 'string') {
        if (invalidRequiredString(unit)) {
            throw new Error(`"unit" must be a non-empty string. Got ${unit}`)
        }
        if (invalidRequiredString(valid)) {
            throw new Error(`"valid" must be a non-empty string. Got ${valid}`)
        }
        return {
            title,
            description,
            good,
            valid,
            unit,
        }    
    } else {
        throw new Error(`"unit" must be a string or number. Got ${unit} (${unitType})`)
    }
}