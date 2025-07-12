import { unicodeSymbol } from '../lib/icons.js'
import { Assessment } from './assessment.js'

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
        selectedEntity: {
            type: Object,
            required: false,
        },
    },
    computed: {
        taskCount() {
            return this.assessment.tasks.length
        },
        maxMetricCount() {
            const { services } = this.assessment
            if (services.length === 0) {
                return 0
            }
            return Math.max(...services.map((s) => s.metrics.length))
        },
        consumersAndTasksWidth() {
            return this.scaleX(2)
        },
        width() {
            return this.consumersAndTasksWidth + this.providersAndServicesWidth
        },
        providersAndServicesWidth() {
            const width = this.assessment.providers.reduce(
                (sum, provider) => sum + this.providerWidth(provider),
                0,
            )
            return Math.max(width, this.scaleY(1))
        },
        providersAndServicesHeight() {
            return this.scaleY(2)
        },
        consumersAndTasksHeight() {
            const height = this.assessment.consumers.reduce(
                (sum, consumer) => sum + this.consumerHeight(consumer),
                0,
            )
            return Math.max(height, this.scaleY(1))
        },
        metricsOffsetY() {
            return this.providersAndServicesHeight + this.consumersAndTasksHeight
        },
        height() {
            return this.providersAndServicesHeight + this.consumersAndTasksHeight + this.scaleY(this.maxMetricCount)
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
        unicodeSymbol,
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
            if (consumer.tasks.length > 1) {
                ret += consumer.tasks.length - 1
            }
            return this.scaleY(ret)
        },
        providerOffsetX(provider) {
            let ret = this.taskX() //all consumers have the same X
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
        taskX() {
            return this.scaleX(2)
        },
        taskY(task) {
            return this.consumerOffsetY(task.consumer) + this.delta + this.scaleY(task.index)
        },
        usageX(usage) {
            return this.serviceX(usage.service)
        },
        usageY(usage) {
            return this.taskY(usage.task)
        },
        metricX(metric) {
            return this.serviceX(metric.service)
        },
        metricY(metric) {
            return this.metricsOffsetY + this.scaleY(metric.index)
        },
        d(x1, y1, x2, y2) {
            return `M${x1},${y1}L${x2},${y2}`
        },
        updateStatus(statusText) {
            this.statusText = statusText
        },
    },
}
