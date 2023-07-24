export function percent(p, total) {
    if (!Number.isFinite(p)) {
        throw new Error(`percent(): ${ p } is not a finite number (type: ${ typeof p })`)
    }
    if (p < 0 || p > 100) {
        throw new RangeError(`percent(): ${ p } is not a number 0-100`)
    }
    if (!Number.isFinite(total)) {
        throw new Error(`percent(): total is not a finite number: ${ total } (type: ${ typeof total })`)
    }
    return p * total / 100
}

export function percentToRatio(x) {
    return toFixed(x / 100, 5)
}

export function toFixed(x, precision = 3) {
    return Number(x.toFixed(precision))
}

export function clamp(x, min, max) {
    if (x < min) {
        return min
    }
    if (x > max) {
        return max
    }
    return x
}
