export function id(x) {
    return x
}

export function isArr(x) {
    return Array.isArray(x)
}

export function isSameArray(a, b) {
    if (!isArr(a)) {
        throw new TypeError(`isSameArray(): "a" must be an array. Got ${JSON.stringify(a)}`)
    }
    if (!isArr(b)) {
        throw new TypeError(`isSameArray(): "b" must be an array. Got ${JSON.stringify(b)}`)
    }
    if (a === b) {
        return true
    }
    return a.length === b.length && a.every((v, i) => v === b[i])
}