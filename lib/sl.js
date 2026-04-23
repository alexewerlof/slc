/**
 * @typedef {'le'|'lt'|'ge'|'gt'|''} BoundType
 */

/**
 * Maps a bound type key to its JavaScript comparison operator string.
 * @param {BoundType} boundType
 * @returns {string} the operator string, or an empty string for unknown/absent bound types
 */
export function boundTypeToOperator(boundType) {
    switch (boundType) {
        case 'le':
            return '<='
        case 'lt':
            return '<'
        case 'ge':
            return '>='
        case 'gt':
            return '>'
        default:
            return ''
    }
}

/**
 * Builds the body of a function that tests whether a data point is "good".
 * @param {string} varName the variable name used inside the function body
 * @param {{ lowerBound: string, upperBound: string }} sli
 * @param {{ lowerThreshold: number, upperThreshold: number }} slo
 * @returns {string} a function body string suitable for `new Function(varName, body)`
 */
export function createIsGoodFnBody(varName, sli, slo) {
    const { lowerBound, upperBound } = sli
    const { lowerThreshold, upperThreshold } = slo

    if (lowerBound && !Number.isFinite(lowerThreshold)) {
        throw new Error('Lower bound threshold must be a number')
    }

    if (upperBound && !Number.isFinite(upperThreshold)) {
        throw new Error('Upper bound threshold must be a number')
    }

    if (lowerBound && upperBound && lowerThreshold > upperThreshold) {
        throw new Error('Lower bound threshold must be less than upper bound threshold')
    }

    if (!lowerBound && !upperBound) {
        return 'return true'
    }

    const fnBodyTokens = ['return']
    const lowerBoundOp = boundTypeToOperator(lowerBound)
    const upperBoundOp = boundTypeToOperator(upperBound)

    if (lowerBoundOp) {
        fnBodyTokens.push(varName)
        fnBodyTokens.push(lowerBoundOp)
        fnBodyTokens.push(lowerThreshold)

        if (upperBoundOp) {
            fnBodyTokens.push('&&')
        }
    }

    if (upperBoundOp) {
        fnBodyTokens.push(varName)
        fnBodyTokens.push(upperBoundOp)
        fnBodyTokens.push(upperThreshold)
    }

    return fnBodyTokens.join(' ')
}

/**
 * Creates a function that tests whether a single data point is "good" according to the SLI/SLO bounds.
 * @param {{ lowerBound: string, upperBound: string }} sli
 * @param {{ lowerThreshold: number, upperThreshold: number }} slo
 * @returns {Function} predicate `(dataPoint: number) => boolean`
 */
export function createIsGood(sli, slo) {
    const varName = 'dataPoint'
    return new Function(varName, createIsGoodFnBody(varName, sli, slo))
}

/**
 * Maps an array of metric data points to booleans indicating whether each is "good".
 * @param {number[]} metricData
 * @param {{ lowerBound: string, upperBound: string }} sli
 * @param {{ lowerThreshold: number, upperThreshold: number }} slo
 * @returns {boolean[]}
 */
export function metricToGood(metricData, sli, slo) {
    const isGood = createIsGood(sli, slo)
    return metricData.map(isGood)
}

/**
 * Calculates the SLS (Service Level Score) percentage over a sub-range of metric data.
 * @param {number[]} metricData the full metric data array
 * @param {number} startIndex inclusive start index
 * @param {number} windowLength number of data points in the window
 * @param {{ lowerBound: string, upperBound: string }} sli
 * @param {{ lowerThreshold: number, upperThreshold: number }} slo
 * @returns {number} percentage of good events (0–100)
 */
export function sls(metricData, startIndex, windowLength, sli, slo) {
    let good = 0,
        valid = 0
    const isGood = createIsGood(sli, slo)
    for (let i = startIndex; i < startIndex + windowLength; i++) {
        const dataPoint = metricData[i]
        if (isGood(dataPoint)) {
            good++
        }
        valid++
    }
    return (100 * good) / valid
}

/**
 * Takes an array of boolean values and moves through the array
 * to count the number of true values in a window of a given size.
 *
 * @param {boolean[]} boolArr
 * @param {number} windowLen
 * @returns {{ good: number, bad: number, valid: number }[]}
 */
export function movingWindowBooleanCounter(boolArr, windowLen) {
    const ret = []
    function add(good, valid) {
        ret.push({
            good,
            valid,
            bad: valid - good,
        })
    }
    let trueCount = 0
    const min = Math.min(windowLen, boolArr.length)
    for (let i = 0; i < min; i++) {
        if (boolArr[i]) {
            trueCount++
        }
        add(trueCount, i + 1)
    }

    // Now we have a full window of data
    let start = 0
    let end = windowLen
    const max = boolArr.length

    while (end < max) {
        if (boolArr[start]) {
            trueCount--
        }
        start++
        if (boolArr[end]) {
            trueCount++
        }
        end++
        add(trueCount, windowLen)
    }

    return ret
}

/**
 * Calculates SLS metric percentages by applying a moving window boolean counter.
 * @param {number[]} metricData raw metric data points
 * @param {{ lowerBound: string, upperBound: string }} sli
 * @param {{ lowerThreshold: number, upperThreshold: number, windowDataCount: number }} slo
 * @returns {number[]} array of percentage values (0–100) per data point
 */
export function calculateSlsMetric(metricData, sli, slo) {
    const goodDataBoolean = metricToGood(metricData, sli, slo)
    const { windowDataCount } = slo
    const counts = movingWindowBooleanCounter(goodDataBoolean, windowDataCount)
    return counts.map(({ good, valid }) => (100 * good) / valid)
}
