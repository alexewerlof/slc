import { Assessment } from './assessment.js'

const DX = 100
const DY = 100
const DRADIUS = 3

export default {
    data() {
        return {
            providerRadius: 10,
            serviceRadius: 8,
            consumerRadius: 10,
            consumptionRadius: 8,
            dependencyRadius: 5,
            deltaX: 100,
            deltaY: 100,
            width: 1100,
            height: 880,
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
        gridPoints() {
            const ret = []
            for (let i = 0; i < 100; i++) {
                for (let j = 0; j < 100; j++) {
                    const { x, y } = this.indexToPixel(i, j)
                    ret.push({ x, y, r: DRADIUS })
                }
            }
            return ret
        },
    },
    methods: {
        serviceX(service) {
            const providerIndex = service.provider.index
            let servicesBefore = 0
            for (let i = 0; i < providerIndex; i++) {
                servicesBefore += this.assessment.providers[i].services.length
            }
            return this.scaleX(servicesBefore + service.index + 3)
        },
        serviceY() {
            return this.scaleY(2)
        },
        providerX(provider) {
            return provider.services.reduce((sumX, service) => this.serviceX(service) + sumX, 0) /
                provider.services.length
        },
        providerY() {
            return this.scaleY(1)
        },
        consumptionX() {
            return this.scaleX(2)
        },
        consumptionY(consumption) {
            const consumerIndex = consumption.consumer.index
            let consumptionsBefore = 0
            for (let i = 0; i < consumerIndex; i++) {
                consumptionsBefore += this.assessment.consumers[i].consumptions.length
            }
            return this.scaleY(consumptionsBefore + consumption.index + 3)
        },
        consumerX() {
            return this.scaleX(1)
        },
        consumerY(consumer) {
            return consumer.consumptions.reduce((sumY, consumption) => this.consumptionY(consumption) + sumY, 0) /
                consumer.consumptions.length
        },
        d(x1, y1, x2, y2) {
            return `M${x1},${y1}L${x2},${y2}`
        },
        scaleX(x) {
            return x * this.deltaX
        },
        scaleY(y) {
            return y * this.deltaY
        },
        indexToPixel(indexX, indexY) {
            return {
                x: indexX * DX,
                y: indexY * DY,
            }
        },
    },
}
