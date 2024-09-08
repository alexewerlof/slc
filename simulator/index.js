import { createApp } from '../vendor/vue.js'
import plot2dComponent from '../components/plot-2d.js'
import tabsComponent from '../components/tabs.js'
import { createBuckets, generateData } from '../lib/buckets.js'
import { analyzeData, createIncidentBuckets, overwriteData, percentileIndex } from '../lib/data.js'
import { config } from '../config.js'
import { d3 } from '../vendor/d3.js'
import { boundTypeToOperator, calculateSlsMetric, createIsGood } from '../lib/sl.js'
import { isNum } from '../lib/validation.js'
import { percent } from '../lib/math.js'
import { percL10n } from '../lib/fmt.js'

const percentageColor = d3.scaleLinear()
    .domain([config.slider.min, config.slider.max])
    .range(["#F86262", "#1BC554"])

const app = createApp({
    components: {
        plot2dComponent,
        tabsComponent,
    },
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
            selectedTab: 'Generator',
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
            for (let bucket of this.buckets) {
                sum += bucket.probability
                ret.push([Math.round(percent(sum, this.dataCount)), bucket.max])
            }
            return ret
        },
        probabilityPoints() {
            return this.buckets.flatMap(bucket => {
                return [
                    [bucket.min, bucket.probability],
                    [bucket.max, bucket.probability],
                ]
            })
        },
        probabilityGuides() {
            const ret = []

            for (let bucket of this.buckets) {
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
                }
            ]
        },
        slStats() {
            const stats = {
                good: 0,
                bad: 0,
                total: 0,
            }

            const isGood = createIsGood(this.sliDefinition, this.sloDefinition)

            for (let dataPoint of this.metricData) {
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
            let min = d3.min(this.slsPoints.map(([x, y]) => y))
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
                }
            ]
        },
        burnRateYExtent() {
            const maxBurnRate = d3.max(this.burnRatePoints.map(([x, y]) => y))
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
        }
    },
    methods: {
        percL10n,
        setAllPercentagesTo(val) {
            this.percentages = new Array(this.percentages.length).fill(val)
        },
        addRange() {
            this.percentages.push(config.slider.default)
        },
        removeRange() {
            if (this.percentages.length > 1) {
                this.percentages.pop()
            }
        },
        toFixed(n, digits = 1) {
            return n.toFixed(digits)
        },
        boundTypeToString(type) {
            return boundTypeToOperator(type)
        },
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
        percentRender(x) {
            return `${x.toFixed(1)}%`
        },
        xRender(x) {
            return `${Number(x).toFixed(1)}x`
        },
        unitRender(x) {
            return isNum(x) ? `${x}${this.metricUnit}` : x
        },
        percentageIndicatorStyle(percentage) {
            return {
                backgroundColor: percentageColor(this.percentages[percentage])
            }
        },
        generateData() {
            this.metricData = generateData(this.dataCount, this.buckets, this.onlyInt)
        },
        addIncident() {
            const incidentBuckets = createIncidentBuckets(this.min, this.max, this.sliDefinition, this.sloDefinition)
            const incidentDataCount = Math.min(this.dataCount - this.incidentInsertionPoint, this.incidentDataCount)
            console.log('metricData.length', this.metricData.length, '. Inserting', incidentDataCount, 'incident data points at', this.incidentInsertionPoint)
            const incidentData = generateData(incidentDataCount, incidentBuckets, this.onlyInt)
            this.metricData = overwriteData(this.metricData, incidentData, this.incidentInsertionPoint)
        },
    },
    created() {
        this.generateData()
    },
})

app.mount('#app')