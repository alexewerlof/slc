import { isStr } from '../dependencies/jty.js'

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
 * Returns true if x is a string that can be parsed as a valid URL.
 * @param {*} x
 * @returns {x is string}
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
