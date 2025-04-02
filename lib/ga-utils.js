import { isNum, isStr } from './validation.js'

/**
 * Parameters are data that are associated with an event
 * Universal Analytics events are based on the legacy event/category/label/value model
 * @see https://developers.google.com/tag-platform/devguides/events
 * For event anatomy
 * @see https://support.google.com/analytics/answer/1033068#Anatomy&zippy=%2Cin-this-article
 * @param {string} [category]
 * @param {string} [label]
 * @param {number} [value]
 * @returns {object} the parameters to be sent to the gtag() function
 */
function eventParams(category, label, value) {
    ret = {}
    if (isStr(category)) {
        ret.event_category = category
    }
    if (isStr(label)) {
        ret.event_label = label
    }
    if (isStr(value)) {
        value = Number(value)
    }
    if (isNum(value)) {
        ret.value = value
    }
    return ret
}

/**
 * Logs an event to the Google analytics backend.
 * @param {string} name @see event naming rules: https://support.google.com/analytics/answer/13316687
 * @param {string} [category]
 * @param {string} [label]
 * @param {number} [value]
 */
export function trackEvent(name, category, label, value) {
    if (!isStr(name)) {
        throw new Error(`trackEvent(): name must be a string. Got ${name}`)
    }

    try {
        gtag('event', name, eventParams(category, label, value))
    } catch (_err) {
        // ignore
    }
}
