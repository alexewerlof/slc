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
                left: 20,
                right: 5,
                top: 10,
                bottom: 20,
            }
        }
    },
    props: {
        longWindowPerc: Number,
        shortWindowDivider: Number,
        shortWindowVisible: Boolean,
        alertLongWindow: Object,
        alertShortWindow: Object,
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
        longWindowX() {
            return this.margin.left + (this.rangeX * this.longWindowPerc / 100)
        },
        shortWindowX() {
            const shortWindowPerc = this.longWindowPerc / this.shortWindowDivider
            return this.longWindowX - (this.rangeX * shortWindowPerc / 100)
        },
    },
    methods: {
        toggle() {
            this.visible = !this.visible
        },
    }
}