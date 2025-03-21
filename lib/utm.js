import { isInstance, isObj, isStr } from './validation.js'

/**
 * Decorates a URL with UTM parameters and returns it
 * @param {URL|String} url a URL instance or string that'll be passed to new URL
 * @param {Object} options utm options
 * @param {string} [options.source] - Identifies the source of the traffic (e.g., 'newsletter', 'google').
 * @param {string} [options.medium] - Identifies the medium of the traffic (e.g., 'email', 'cpc').
 * @param {string} [options.campaign] - Identifies the specific campaign (e.g., 'spring_sale').
 * @param {string} [options.term] - Identifies the paid search keywords (e.g., 'spring').
 * @param {string} [options.content] - Differentiates similar content or links within the same ad (e.g., 'header_link').
 * @returns the url object that was passed to the function
 * @see https://en.wikipedia.org/wiki/UTM_parameters
 */
export function addUTM(url, options) {
    if (!isInstance(url, URL) && !isStr(url)) {
        throw new Error('url must be an instance of URL')
    }
    if (!isObj(options)) {
        return url
    }

    const ret = new URL(url)
    const utmParams = ['source', 'medium', 'campaign', 'term', 'content']
    for (const param of utmParams) {
        const val = options[param]
        if (isStr(val) && val.length) {
            ret.searchParams.set(`utm_${param}`, val.toLowerCase())
        }
    }
    return ret
}
