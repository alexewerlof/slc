import { fetchTemplate, loadCss } from '../lib/fetch-template.js'
import burnEventComponent from './burn-event.js'
import verticalAxisComponent from './vertical-axis.js'
import horizontalAxisComponent from './horizontal-axis.js'

loadCss(import.meta.url)

export default {
    template: await fetchTemplate(import.meta.url),
    data() {
        return {
            width: 500,
            height: 300,
            margin: {
                left: 27,
                right: 5,
                top: 10,
                bottom: 20,
            }
        }
    },
    props: {
        burnRate: Number,
        errorBudgetBurn: Object,
        sloWindowBudgetBurn: Object,
    },
    components: {
        burnEventComponent,
        verticalAxisComponent,
        horizontalAxisComponent,
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
        burnedX() {
            // the ratio of the error budget from the total SLO window
            const errorBudgetRatio = 1 / this.burnRate
            return this.rangeX * errorBudgetRatio + this.margin.left
        },
    },
    methods: {
        toggle() {
            this.visible = !this.visible
        },
    }
}