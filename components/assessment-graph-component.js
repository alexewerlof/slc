import { Assessment } from './assessment.js'

export default {
    data() {
        return {
            deltaX: 60,
            deltaY: 60,
            dotRadius: 4,
            providerRadius: 8,
            serviceRadius: 10,
            consumerRadius: 8,
            consumptionRadius: 10,
            dependencyRadius: 12,
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
            return this.deltaX * this.widthCells
        },
        height() {
            return this.deltaY * this.heightCells
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
        gridPoints() {
            const ret = []
            for (let x = 3; x < this.widthCells; x++) {
                for (let y = 3; y < this.heightCells; y++) {
                    ret.push({
                        x: this.scaleX(x),
                        y: this.scaleY(y),
                        r: this.dotRadius,
                    })
                }
            }
            return ret
        },
    },
    methods: {
        scaleX(x) {
            return x * this.deltaX
        },
        scaleY(y) {
            return y * this.deltaY
        },
        serviceX(service) {
            const providerIndex = service.provider.index
            let servicesBefore = 0
            for (let i = 0; i < providerIndex; i++) {
                servicesBefore += this.assessment.providers[i].services.length
            }
            return this.scaleX(servicesBefore + service.index + 3)
        },
        providerX(provider) {
            return provider.services.reduce((sumX, service) => this.serviceX(service) + sumX, 0) /
                provider.services.length
        },
        consumptionY(consumption) {
            const consumerIndex = consumption.consumer.index
            let consumptionsBefore = 0
            for (let i = 0; i < consumerIndex; i++) {
                consumptionsBefore += this.assessment.consumers[i].consumptions.length
            }
            return this.scaleY(consumptionsBefore + consumption.index + 3)
        },
        consumerY(consumer) {
            return consumer.consumptions.reduce((sumY, consumption) => this.consumptionY(consumption) + sumY, 0) /
                consumer.consumptions.length
        },
        d(x1, y1, x2, y2) {
            return `M${x1},${y1}L${x2},${y2}`
        },
    },
}
