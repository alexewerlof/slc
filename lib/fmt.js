import { percentToRatio } from './math.js'
import { isStr } from '../dependencies/jty.js'

const numberFormat = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 6,
})
const percentFormat = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 3 })

/**
 * @typedef {'eq'|'ne'|'lt'|'le'|'gt'|'ge'} ComparisonEntity
 */

/**
 * Returns the number in string format with location-specific separators to make it easier to read
 * @param {number} num the number to format
 * @returns {string} the formatted number
 * @example
 * numL10n(1000) // '1,000'
 */
export function numL10n(num) {
    return numberFormat.format(num)
}

/**
 * Formats a number with an optional unit label.
 * @param {number} num the number to format
 * @param {string} [unit] optional unit string appended after a space
 * @returns {string} the formatted number, optionally followed by the unit
 */
export function numUnitL10n(num, unit) {
    if (isStr(unit)) {
        return `${numL10n(num)} ${unit}`
    }
    return numL10n(num)
}

/**
 * Takes a percentage value and returns it in the localized format
 * @param {number} num the percentage
 * @returns Percentage in the localized format
 */
export function percL10n(num) {
    return percentFormat.format(percentToRatio(num))
}

/**
 * Returns the fallback string when str is empty or whitespace-only.
 * @param {*} str the value to test
 * @param {string} fallback the value to return when str trims to empty
 * @returns {string}
 */
export function strFallback(str, fallback) {
    return String(str).trim() === '' ? fallback : str
}

/**
 * Converts an HTML entity shorthand to its corresponding symbol character.
 * @param {ComparisonEntity} htmlEntity
 * @returns {string} the symbol character
 * @throws {Error} for unknown entity names
 */
export function entity2symbol(htmlEntity) {
    switch (htmlEntity) {
        case 'eq':
            return '='
        case 'ne':
            return '≠'
        case 'lt':
            return '<'
        case 'le':
            return '≤'
        case 'gt':
            return '>'
        case 'ge':
            return '≥'
        default:
            throw new Error(`Unknown HTML entity: ${htmlEntity}`)
    }
}

/**
 * Returns the logical opposite bound type.
 * @param {ComparisonEntity} bound
 * @returns {ComparisonEntity} the opposite bound
 * @throws {Error} for unknown bound values
 */
export function oppositeBound(bound) {
    switch (bound) {
        case 'eq':
            return 'ne'
        case 'ne':
            return 'eq'
        case 'lt':
            return 'ge'
        case 'le':
            return 'gt'
        case 'gt':
            return 'le'
        case 'ge':
            return 'lt'
        default:
            throw new Error(`Invalid bound: ${bound}`)
    }
}

/**
 * Like {@link entity2symbol} but normalises `>` to `<` and `≥` to `≤`.
 * @param {ComparisonEntity} htmlEntity
 * @returns {string}
 */
export function entity2symbolNorm(htmlEntity) {
    const sym = entity2symbol(htmlEntity)
    switch (sym) {
        case '>':
            return '<'
        case '≥':
            return '≤'
        default:
            return sym
    }
}

/**
 * Checks if a string contains any of the comparison operators.
 * This is useful for showing a warning when the definition of Good already contains a comparator
 * but the user tries to set bounds as well.
 * @param {string} str
 * @returns {boolean}
 */
export function hasComparators(str) {
    return /[<>≤≥]/.test(str)
}

/**
 * Used in the UI to render a string for the bound selection.
 * @param {string} metricName the name of the metric
 * @param {import('./sl.js').BoundType} boundType the bound entity key (e.g. 'le') or empty string for no-bound
 * @param {string} caption threshold caption
 * @returns {string}
 */
export function boundCaption(metricName, boundType, caption) {
    if (boundType === '') {
        return 'None'
    }

    return `${metricName} ${entity2symbol(boundType)} ${caption}`
}

/**
 * Joins string chunks with a dot, converts PascalCase to kebab-case, and strips invalid characters.
 * @param {...string} chunks one or more string segments to join
 * @returns {string} the normalised name
 * @throws {Error} when any chunk is not a string, or the result would be empty
 */
export function namify(...chunks) {
    if (chunks.some((chunk) => !isStr(chunk))) {
        throw new Error(`namify(): expected string chunks. Got ${chunks}`)
    }
    let str = chunks.map((chunk) => chunk.trim()).join('.')
    // Trim and convert PascalCase to kebab-case, e.g. 'FooBar' -> 'foo-bar'
    str = str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    str = str.replace(/[^a-zA-Z0-9\-./\\]/g, '-').replace(/-+/g, '-')
    if (str.startsWith('-')) {
        str = str.slice(1)
    }
    if (str.endsWith('-')) {
        str = str.slice(0, -1)
    }
    if (str === '') {
        throw new Error(`namify(): ended up with empty string after processing: ${str}`)
    }
    return str
}
