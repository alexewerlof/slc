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
        selectedEntity: {
            type: Object,
            required: false,
        },
    },
    computed: {
        taskCount() {
            return this.assessment.tasks.length
        },
        heightCells() {
            let ret = 3
            this.assessment.consumers.forEach((consumer) => ret += consumer.tasks.length)
            return ret
        },
        widthCells() {
            let ret = 3
            this.assessment.providers.forEach((provider) => ret += provider.services.length)
            return ret
        },
        width() {
            const providerWidths = this.assessment.providers.map((provider) => this.providerWidth(provider))
            return this.taskX() + arrSum(providerWidths)
        },
        height() {
            const maxMetricCount = Math.max(...this.assessment.services.map((s) => s.metrics.length))
            return this.serviceY() + this.scaleY(this.taskCount + maxMetricCount + 2)
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
        dependencyX(dependency) {
            return this.serviceX(dependency.service)
        },
        dependencyY(dependency) {
            return this.taskY(dependency.task)
        },
        metricX(metric) {
            return this.serviceX(metric.service)
        },
        metricY(metric) {
            return this.serviceY(metric.service) + this.scaleY(this.taskCount + metric.index + 2)
        },
        d(x1, y1, x2, y2) {
            return `M${x1},${y1}L${x2},${y2}`
        },
        updateStatus(statusText) {
            this.statusText = statusText
        },
    },
}
