import { isArr, isArrIdx, isNum } from './validation.js'

export function percent(p, total) {
    if (!isNum(p)) {
        throw new TypeError(`percent(): "p" should be a number. Got: ${p} (${typeof p})`)
    }
    if (!isNum(total)) {
        throw new TypeError(`percent(): "total" should be a number. Got: ${total} (${typeof total})`)
    }
    return (p * total) / 100
}

export function percentToRatio(x) {
    return toFixed(x / 100, 5)
}

export function toFixed(x, precision = 3) {
    if (!isNum(x)) {
        throw new Error(`toFixed(): "x" should be a number. Got: ${x} (${typeof x})`)
    }
    if (!isNum(precision)) {
        throw new Error(`toFixed(): "precision" should be a number. Got: ${precision} (${typeof precision})`)
    }
    return Number(x.toFixed(precision))
}

export function clamp(x, min, max) {
    if (!isNum(x)) {
        throw new Error(`clamp(): "x" should be a number. Got: ${x} (${typeof x})`)
    }
    if (!isNum(min)) {
        throw new Error(`clamp(): "min" should be a number. Got: ${min} (${typeof min})`)
    }
    if (!isNum(max)) {
        throw new Error(`clamp(): "max" should be a number. Got: ${max} (${typeof max})`)
    }
    if (min > max) {
        throw new RangeError(`min (${min}) cannot be greater than max (${max})`)
    }
    if (x < min) {
        return min
    }
    if (x > max) {
        return max
    }
    return x
}

export function range(arr) {
    if (!isArr(arr)) {
        throw new TypeError(`range(): "arr" should be an array. Got: ${arr} (${typeof arr})`)
    }
    if (arr.length === 0) {
        throw new RangeError(`range(): "arr" should not be empty`)
    }
    let min = arr[0],
        max = arr[0]
    for (const x of arr) {
        if (!isNum(x)) {
            throw new TypeError(`range(): "arr" should contain only numbers. Got: ${x} (${typeof x})`)
        }
        if (x < min) {
            min = x
        }
        if (x > max) {
            max = x
        }
    }
    return [min, max]
}
