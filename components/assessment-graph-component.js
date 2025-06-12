import { icon } from '../lib/icons.js'
import { Assessment } from './assessment.js'

function arrSum(arr) {
    return arr.reduce((a, b) => a + b, 0)
}

export default {
    data() {
        return {
            delta: 50,
            statusText: undefined,
        }
    },
    emits: ['select'],
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    computed: {
        consumptionCount() {
            return this.assessment.consumptions.length
        },
        heightCells() {
            let ret = 3
            this.assessment.consumers.forEach((consumer) => ret += consumer.consumptions.length)
            return ret
        },
        widthCells() {
            let ret = 3
            this.assessment.providers.forEach((provider) => ret += provider.services.length)
            return ret
        },
        width() {
            const providerWidths = this.assessment.providers.map((provider) => this.providerWidth(provider))
            return this.consumptionX() + arrSum(providerWidths)
        },
        height() {
            const consumptionHeights = this.assessment.consumers.map((consumer) => this.consumerHeight(consumer))
            const maxMetricCount = Math.max(...this.assessment.services.map((s) => s.metrics.length))
            return this.serviceY() + this.scaleY(maxMetricCount) + arrSum(consumptionHeights)
        },
        statusStyle() {
            if (this.statusText) {
                return {
                    opacity: 1,
                }
            }
            return null
        },
    },
    methods: {
        icon,
        scaleX(x) {
            return x * this.delta
        },
        scaleY(y) {
            return y * this.delta
        },
        providerWidth(provider) {
            let ret = 2
            if (provider.services.length > 1) {
                ret += provider.services.length - 1
            }
            return this.scaleX(ret)
        },
        consumerHeight(consumer) {
            let ret = 2
            if (consumer.consumptions.length > 1) {
                ret += consumer.consumptions.length - 1
            }
            return this.scaleY(ret)
        },
        providerOffsetX(provider) {
            let ret = this.consumptionX() //all consumers have the same X
            for (let i = 0; i < provider.index; i++) {
                ret += this.providerWidth(this.assessment.providers[i])
            }
            return ret
        },
        consumerOffsetY(consumer) {
            let ret = this.serviceY() //all services have the same Y
            for (let i = 0; i < consumer.index; i++) {
                ret += this.consumerHeight(this.assessment.consumers[i])
            }
            return ret
        },
        providerX(provider) {
            return this.providerOffsetX(provider) + this.providerWidth(provider) / 2
        },
        providerY() {
            return this.scaleY(0.5)
        },
        consumerX() {
            return this.scaleX(0.5)
        },
        consumerY(consumer) {
            return this.consumerOffsetY(consumer) + this.consumerHeight(consumer) / 2
        },
        serviceX(service) {
            return this.providerOffsetX(service.provider) + this.delta + this.scaleX(service.index)
        },
        serviceY() {
            return this.scaleY(2)
        },
        consumptionX() {
            return this.scaleX(2)
        },
        consumptionY(consumption) {
            return this.consumerOffsetY(consumption.consumer) + this.delta + this.scaleY(consumption.index)
        },
        dependencyX(dependency) {
            return this.serviceX(dependency.service)
        },
        dependencyY(dependency) {
            return this.consumptionY(dependency.consumption)
        },
        metricX(metric) {
            return this.serviceX(metric.service)
        },
        metricY(metric) {
            const metricCount = metric.service.metrics.length
            return this.height - this.scaleY(metricCount - metric.index)
        },
        d(x1, y1, x2, y2) {
            return `M${x1},${y1}L${x2},${y2}`
        },
        updateStatus(statusText) {
            this.statusText = statusText
        },
    },
}
