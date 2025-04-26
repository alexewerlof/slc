import { Assessment } from './assessment.js'

export default {
    data() {
        return {
            dotRadius: 3,
            providerRadius: 8,
            serviceRadius: 10,
            consumerRadius: 8,
            consumptionRadius: 10,
            dependencyRadius: 12,
            deltaX: 50,
            deltaY: 50,
            width: 600,
            height: 800,
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
            for (let x = 1; x < 10; x++) {
                for (let y = 1; y < 10; y++) {
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
    mounted() {
        const outerDiv = this.$refs.outerDiv

        if (outerDiv) {
            this.width = outerDiv.clientWidth
            this.height = outerDiv.clientHeight
            console.log(`Outder div dimensions: ${this.width} x ${this.height}`)
        } else {
            console.error('Could not find the outer div element.')
        }
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
    },
}
