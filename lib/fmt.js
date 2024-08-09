import { percentToRatio } from './math.js'

const numberFormat = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 6,
})
const percentFormat = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 3 })

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
 * Takes a percentage value and returns it in the localized format
 * @param {number} num the percentage
 * @returns Percentage in the localized format
 */
export function percL10n(num) {
    return percentFormat.format(percentToRatio(num))
}

export function currL10n(amount, currency) {
    try {
        return amount.toLocaleString(undefined, { style: 'currency', currency })
    } catch (e) {
        console.warn(`Could not format currency: ${currency}`, e)
        return `${amount} ${currency}`
    }
}

export function strFallback(str, fallback) {
    return String(str).trim() === '' ? fallback : str
}

export function entity2symbol(htmlEntity) {
    switch (htmlEntity) {
        case '':
            return ''
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