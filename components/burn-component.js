import { fetchTemplate } from '../lib/fetch-template.js'
import { arrToPolygonPoints } from '../lib/svg.js'
import burnEventComponent from './burn-event-component.js'

export default {
    template: await fetchTemplate('burn-component.html', import.meta.url),
    data() {
        return {
            width: 500,
            height: 300,
            margin: {
                left: 20,
                right: 5,
                top: 10,
                bottom: 20,
            }
        }
    },
    props: {
        burnRate: Number,
        longAlertPerc: Number,
    },
    components: {
        burnEventComponent,
    },
    computed: {
        viewBox() {
            return `0 0 ${this.width} ${this.height}`
        },
        rightX() {
            return this.width - this.margin.right
        },
        leftX() {
            return this.margin.left
        },
        rangeX() {
            return this.width - this.margin.left - this.margin.right
        },
        topY() {
            return this.margin.top
        },
        bottomY() {
            return this.height - this.margin.bottom
        },
        horizontalAxisArrowPoints() {
            return arrToPolygonPoints(
                [this.rightX, this.bottomY],
                [this.rightX - 5, this.bottomY - 3],
                [this.rightX - 5, this.bottomY + 3],
            )
        },
        d() {
            // the ratio of the error budget from the total SLO window
            const errorBudgetRatio = 1 / this.burnRate
            const longAlertRatio = errorBudgetRatio * this.longAlertPerc / 100

            const ebBurnedX = this.rangeX * errorBudgetRatio + this.margin.left
            const longAlertX = this.rangeX * longAlertRatio + this.margin.left

            return { ebBurnedX, longAlertX }
        },
    },
    methods: {
        toggle() {
            this.visible = !this.visible
        },
    }
}