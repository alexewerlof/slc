import { createApp } from '../../vendor/vue.js'
import { createBuckets, generateData } from '../../lib/buckets.js'
import { analyzeData, createIncidentBuckets, overwriteData, percentileIndex } from '../../lib/data.js'
import { config } from '../../config.js'
import * as d3 from '../../vendor/d3.js'
import { boundTypeToOperator, calculateSlsMetric, createIsGood } from '../../lib/sl.js'
import { isNum } from '../../lib/validation.js'
import { percent } from '../../lib/math.js'
import { numL10n, percL10n } from '../../lib/fmt.js'
import { registerAllComponents } from '../../components/index.js'

const percentageColor = d3.scaleLinear().domain([config.slider.min, config.slider.max]).range(['#F86262', '#1BC554'])

const app = createApp({
    data() {
        return {
            config,
            windowDays: config.windowDays.default,
            // How many windows of data should be generated in the simulation
            windowCount: config.simulator.windowCount.default,
            // How many data points should be generated per day
            dataCountPerDay: config.simulator.dataCountPerDay.default,
            min: config.simulator.metricRange.min.default,
            max: config.simulator.metricRange.max.default,
            selectedTab: undefined,
            metricName: config.metricName.default,
            metricUnit: config.metricUnit.default,
            metricData: [],
            percentages: config.simulator.percentages.default,
            onlyInt: true,
            sortAscending: true,
            incidentLengthPerc: config.incidentLengthPerc.default,
            incidentInsertionPoint: 0,
            lowerThreshold: config.lowerThreshold.default,
            upperThreshold: config.upperThreshold.default,
            upperBound: config.upperBound.default,
            lowerBound: config.lowerBound.default,
            slo: {
                value: config.slo.default,
            },
        }
    },
    computed: {
        sliDefinition() {
            return {
                metricName: this.metricName,
                lowerBound: this.lowerBound,
                upperBound: this.upperBound,
            }
        },
        sloDefinition() {
            return {
                value: this.slo.value,
                windowDays: this.windowDays,
                windowDataCount: this.windowDataCount,
                lowerThreshold: this.lowerThreshold,
                upperThreshold: this.upperThreshold,
            }
        },
        windowDataCount() {
            return this.windowDays * this.dataCountPerDay
        },
        dataCount() {
            return Math.round(this.windowDataCount * this.windowCount)
        },
        incidentDataCount() {
            return Math.round(percent(this.incidentLengthPerc, this.windowDataCount))
        },
        sortedMetricData() {
            return [...this.metricData].sort(this.sortAscending ? d3.ascending : d3.descending)
        },
        metricDataPoints() {
            return this.metricData.map((y, x) => [x, y])
        },
        sortedMetricDataPoints() {
            return this.sortedMetricData.map((y, x) => [x, y])
        },
        range() {
            return this.max - this.min
        },
        buckets() {
            return createBuckets(this.min, this.max, this.percentages)
        },
        distributionPoints() {
            const ret = []
            ret.push([0, this.min])
            let sum = 0
            for (const bucket of this.buckets) {
                sum += bucket.probability
                ret.push([Math.round(percent(sum, this.dataCount)), bucket.max])
            }
            return ret
        },
        probabilityPoints() {
            return this.buckets.flatMap((bucket) => {
                return [
                    [bucket.min, bucket.probability],
                    [bucket.max, bucket.probability],
                ]
            })
        },
        probabilityGuides() {
            const ret = []

            for (const bucket of this.buckets) {
                ret.push({
                    x: bucket.min,
                    label: bucket.min,
                })
            }

            if (this.buckets.length > 1) {
                const lastBucket = this.buckets[this.buckets.length - 1]
                ret.push({
                    x: lastBucket.max,
                    label: lastBucket.max,
                })
            }

            if (this.upperBound) {
                ret.push({
                    x: this.upperThreshold,
                    label: '$UT',
                })
            }

            if (this.lowerBound) {
                ret.push({
                    x: this.lowerThreshold,
                    label: '$LT',
                })
            }

            return ret
        },
        percentiles() {
            const ret = []
            const len = this.sortedMetricData.length
            for (let x = 0; x <= 100; x += 1) {
                const index = percentileIndex(len, x)
                const y = this.sortedMetricData[index]
                ret.push([x, y])
            }
            return ret
        },
        thresholdGuidesY() {
            const ret = []
            if (this.upperBound) {
                ret.push({
                    y: this.upperThreshold,
                    label: '$UT',
                })
            }
            if (this.lowerBound) {
                ret.push({
                    y: this.lowerThreshold,
                    label: '$LT',
                })
            }
            return ret
        },
        meanMedianGuidesY() {
            const ret = []
            ret.push({
                y: this.analytics.mean,
                label: 'Mean',
            })
            ret.push({
                y: this.analytics.median,
                label: 'Median',
            })
            return ret
        },
        slsGuides() {
            return [
                {
                    y: this.slo.value,
                    label: this.slo.value,
                },
                {
                    x: this.windowDataCount,
                    label: '1 Window',
                },
            ]
        },
        slStats() {
            const stats = {
                good: 0,
                bad: 0,
                total: 0,
            }

            const isGood = createIsGood(this.sliDefinition, this.sloDefinition)

            for (const dataPoint of this.metricData) {
                if (isGood(dataPoint)) {
                    stats.good++
                } else {
                    stats.bad++
                }
                stats.total++
            }

            return stats
        },
        slsPoints() {
            const slsValues = calculateSlsMetric(this.metricData, this.sliDefinition, this.sloDefinition)
            return slsValues.map((value, i) => [i, value])
        },
        slsRange() {
            let min = d3.min(this.slsPoints.map(([, y]) => y))
            if (min > this.slo.value) {
                min = this.slo.value
            }
            return [min, 100]
        },
        burnRatePoints() {
            const errorBudgetPercent = 100 - this.slo.value
            return this.slsPoints.map(([x, sls]) => {
                const errorPercent = 100 - sls
                return [x, errorPercent / errorBudgetPercent]
            })
        },
        burnRateGuides() {
            return [
                {
                    y: 1,
                    label: '1',
                },
                {
                    y: 6,
                    label: '6',
                },
                {
                    y: 14.4,
                    label: '14.4',
                },
                {
                    x: this.windowDataCount,
                    label: '1 Window',
                },
            ]
        },
        burnRateYExtent() {
            const maxBurnRate = d3.max(this.burnRatePoints.map(([, y]) => y))
            return [0, Math.max(maxBurnRate, 14.4)]
        },
        accumulatedFailure() {
            let failureCounter = 0
            const isGood = createIsGood(this.sliDefinition, this.sloDefinition)
            return this.metricData.map((dataPoint, i) => {
                if (!isGood(dataPoint)) {
                    failureCounter++
                }
                return [i, failureCounter]
            })
        },
        analytics() {
            return analyzeData(this.sortedMetricData)
        },
        jsonData() {
            return JSON.stringify(this.metricData)
        },
    },
    watch: {
        min() {
            if (this.min > this.max) {
                this.max = this.min
            }

            if (this.lowerThreshold < this.min) {
                this.lowerThreshold = this.min
            }

            if (this.lowerThreshold > this.upperThreshold) {
                this.lowerThreshold = this.upperThreshold
            }
        },
        max() {
            if (this.max < this.min) {
                this.min = this.max
            }

            if (this.upperThreshold > this.max) {
                this.upperThreshold = this.max
            }

            if (this.lowerThreshold > this.upperThreshold) {
                this.lowerThreshold = this.upperThreshold
            }
        },
    },
    methods: {
        percL10n,
        numL10n,
        /**
         * Sets all percentage sliders to the same value.
         * @param {number} val the percentage value to assign to every bucket
         */
        setAllPercentagesTo(val) {
            this.percentages = new Array(this.percentages.length).fill(val)
        },
        /**
         * Appends a new percentage bucket with the default slider value.
         */
        addRange() {
            this.percentages.push(config.slider.default)
        },
        /**
         * Removes the last percentage bucket (minimum of one bucket is kept).
         */
        removeRange() {
            if (this.percentages.length > 1) {
                this.percentages.pop()
            }
        },
        /**
         * Formats a number with the given number of decimal digits.
         * @param {number} n
         * @param {number} [digits=1]
         * @returns {string}
         */
        toFixed(n, digits = 1) {
            return n.toFixed(digits)
        },
        /**
         * Converts a bound type key to its operator string for display.
         * @param {string} type e.g. 'le', 'ge'
         * @returns {string}
         */
        boundTypeToString(type) {
            return boundTypeToOperator(type)
        },
        /**
         * Returns the ordinal string for a given integer (e.g. 1 → '1st').
         * @param {number} x
         * @returns {string}
         */
        nthRender(x) {
            switch (x) {
                case 0:
                    return '0th'
                case 1:
                    return '1st'
                case 2:
                    return '2nd'
                case 3:
                    return '3rd'
                default:
                    return `${x}th`
            }
        },
        /**
         * Formats a number as a percentage string with one decimal place.
         * @param {number} x
         * @returns {string}
         */
        percentRender(x) {
            return `${x.toFixed(1)}%`
        },
        /**
         * Formats a number as a burn-rate multiplier string (e.g. 1.5 → '1.5x').
         * @param {number} x
         * @returns {string}
         */
        xRender(x) {
            return `${Number(x).toFixed(1)}x`
        },
        /**
         * Formats a value with the current metric unit appended, or returns the value as-is if not a number.
         * @param {number|*} x
         * @returns {string|*}
         */
        unitRender(x) {
            return isNum(x) ? `${x}${this.metricUnit}` : x
        },
        /**
         * Returns an inline style object with a background colour derived from the bucket percentage.
         * @param {number} percentage index into `this.percentages`
         * @returns {{ backgroundColor: string }}
         */
        percentageIndicatorStyle(percentage) {
            return {
                backgroundColor: percentageColor(this.percentages[percentage]),
            }
        },
        /**
         * Generates a fresh set of random metric data using the current bucket configuration.
         */
        generateData() {},
        /**
         * Generates incident data points (bad values) and splices them into
         * `metricData` at the configured insertion point.
         */
        addIncident() {
            const incidentBuckets = createIncidentBuckets(this.min, this.max, this.sliDefinition, this.sloDefinition)
            const incidentDataCount = Math.min(this.dataCount - this.incidentInsertionPoint, this.incidentDataCount)
            console.log(
                'metricData.length',
                this.metricData.length,
                '. Inserting',
                incidentDataCount,
                'incident data points at',
                this.incidentInsertionPoint,
            )
            const incidentData = generateData(incidentDataCount, incidentBuckets, this.onlyInt)
            this.metricData = overwriteData(this.metricData, incidentData, this.incidentInsertionPoint)
        },
    },
    created() {
        this.generateData()
    },
})

await registerAllComponents(app)
app.mount('#app')
