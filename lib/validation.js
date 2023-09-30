export function invalidRequiredString(val) {
    return typeof val !== 'string' || val.trim() === ''
}

export function invalidOptionalString(val) {
    return typeof val !== 'undefined' && typeof val !== 'string'
}

export function invalidOptionalPositiveInteger(val) {
    return !Number.isInteger(val) || val < 0
}

export function validateExample(val) {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
        throw new Error('Expected an object')
    }

    const {
        title = '',
        description = '',
        unit = 'event',
        good,
        valid = 'all',
        timeSlot = 0,
    } = val

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

    if (!Number.isInteger(timeSlot) || timeSlot < 0) {
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