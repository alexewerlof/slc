
const numberFormat = new Intl.NumberFormat()

/** 
 * Returns the number in string format with location-specific separators to make it easier to read
 * @param {number} num the number to format
 * @returns {string} the formatted number
 * @example
 * numberSep(1000) // '1,000'
 */
export function numberSep(num) {
    return numberFormat.format(num)
}