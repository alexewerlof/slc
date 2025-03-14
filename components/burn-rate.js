import { loadComponent } from '../lib/fetch-template.js'
import burnEventComponent from './burn-event.js'
import verticalAxisComponent from './vertical-axis.js'
import horizontalAxisComponent from './horizontal-axis.js'

export default {
    template: await loadComponent(import.meta.url),
    components: {
        burnEventComponent,
        verticalAxisComponent,
        horizontalAxisComponent,
    },
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
        alert: Object,
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
            return this.rangeX / this.alert.burnRate + this.margin.left
        },
        endOfCompliancePeriodTextLines() {
            return [
                `${this.alert.sloWindowBudgetBurn.eventCountL10n } failed ${ this.alert.errorBudgetBurn.eventUnitNorm }`,
                `in ${ this.alert.sloWindowBudgetBurn.humanTime }`,
            ]
        },
        errorBudgetExhaustedTextLines() {
            return [
                `${ this.alert.errorBudgetBurn.eventCountL10n } failed ${ this.alert.errorBudgetBurn.eventUnitNorm }`,
                `in ${ this.alert.errorBudgetBurn.humanTime }`,
            ]
        }
    },
    methods: {
        toggle() {
            this.visible = !this.visible
        },
    }
}