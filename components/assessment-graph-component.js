import { Assessment } from './assessment.js'

export default {
    data() {
        return {
            deltaX: 50,
            deltaY: 50,
            dotRadius: 4,
            providerRadius: 8,
            serviceRadius: 10,
            consumerRadius: 8,
            consumptionRadius: 10,
            dependencyRadius: 12,
            padding: 50,
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
            let ret = this.padding + this.consumptionX
            for (const provider of this.assessment.providers) {
                ret += this.providerWidth(provider)
            }
            return ret
        },
        height() {
            let ret = this.padding + this.serviceY
            for (const consumer of this.assessment.consumers) {
                ret += this.consumerHeight(consumer)
            }
            return ret
        },
        providerY() {
            return this.scaleY(1)
        },
        serviceY() {
            return this.scaleY(2)
        },
        consumerX() {
            return this.scaleX(1)
        },
        consumptionX() {
            return this.scaleX(2)
        },
    },
    methods: {
        scaleX(x) {
            return x * this.deltaX
        },
        scaleY(y) {
            return y * this.deltaY
        },
        providerWidth(provider) {
            let ret = 2 * this.padding
            if (provider.services.length > 1) {
                ret += this.scaleX(provider.services.length - 1)
            }
            return ret
        },
        consumerHeight(consumer) {
            let ret = 2 * this.padding
            if (consumer.consumptions.length > 1) {
                ret += this.scaleY(consumer.consumptions.length - 1)
            }
            return ret
        },
        providerOffset(provider) {
            let ret = this.padding + this.consumptionX
            for (let i = 0; i < provider.index; i++) {
                ret += this.providerWidth(this.assessment.providers[i])
            }
            return ret
        },
        consumerOffset(consumer) {
            let ret = this.padding + this.serviceY
            for (let i = 0; i < consumer.index; i++) {
                ret += this.consumerHeight(this.assessment.consumers[i])
            }
            return ret
        },
        providerX(provider) {
            return this.providerOffset(provider) + this.providerWidth(provider) / 2
        },
        consumerY(consumer) {
            return this.consumerOffset(consumer) + this.consumerHeight(consumer) / 2
        },
        serviceX(service) {
            return this.providerOffset(service.provider) + this.padding + this.scaleX(service.index)
        },
        consumptionY(consumption) {
            return this.consumerOffset(consumption.consumer) + this.padding + this.scaleY(consumption.index)
        },
        d(x1, y1, x2, y2) {
            return `M${x1},${y1}L${x2},${y2}`
        },
    },
}
