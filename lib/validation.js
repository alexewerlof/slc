export function invalidRequiredString(val) {
    return typeof val !== 'string' || val.trim() === ''
}

export function invalidOptionalString(val) {
    return typeof val !== 'undefined' && typeof val !== 'string'
}

export function invalidOptionalPositiveInteger(val) {
    return !Number.isInteger(val) || val < 0
}

export function validateParams(params) {
    if (params === null || typeof params !== 'object' || Array.isArray(params)) {
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

export function paramToUrl(base, params) {
    const { title, description, unit, good, valid, timeSlot } = validateParams(params)

    const url = new URL(base)
    if (title) {
        url.searchParams.set('title', title)
    }
    if (description) {
        url.searchParams.set('description', description)
    }
    if (unit) {
        url.searchParams.set('unit', unit)
    }
    if (good) {
        url.searchParams.set('good', good)
    }
    if (valid) {
        url.searchParams.set('valid', valid)
    }
    if (timeSlot > 0) {
        url.searchParams.set('timeSlot', timeSlot)
    }

    console.log(timeSlot, typeof timeSlot)

    return url.toString()
}

export function paramsFromUrl(url) {
    const { searchParams } = new URL(url)

    return {
        title: searchParams.get('title'),
        description: searchParams.get('description'),
        unit: searchParams.get('unit'),
        good: searchParams.get('good'),
        valid: searchParams.get('valid'),
        timeSlot: Number(searchParams.get('timeSlot')),
    }
}