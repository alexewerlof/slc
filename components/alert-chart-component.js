import { loadComponent } from '../lib/fetch-template.js'
import { BurnEventComponent } from './burn-event-component.js'
import { AxisComponent } from './axis-component.js'

export const AlertChartComponent = {
    template: await loadComponent(import.meta.url),
    data() {
        return {
            width: 500,
            height: 300,
            margin: {
                left: 20,
                right: 5,
                top: 10,
                bottom: 20,
            },
        }
    },
    props: {
        alert: Object,
    },
    components: {
        BurnEventComponent,
        AxisComponent,
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
            return this.margin.left + (this.rangeX * this.alert.longWindowPerc / 100)
        },
        shortWindowX() {
            return this.longWindowX - (this.rangeX * this.alert.shortWindowPerc / 100)
        },
        errorBudgetTextLines() {
            const { failureWindow } = this.alert.objective
            return [
                `${failureWindow.eventCountL10n} ${failureWindow.eventUnitNorm} failed`,
                `in ${failureWindow.humanTime}`,
            ]
        },
        longWindowTextLines() {
            const { longFailureWindow } = this.alert
            return [
                `When at least ${longFailureWindow.eventCountL10n} ${longFailureWindow.eventUnitNorm} failed`,
                `in the last ${longFailureWindow.humanTime}`,
            ]
        },
        shortWindowTextLines() {
            const { shortFailureWindow } = this.alert
            return [
                `When at least ${shortFailureWindow.eventCountL10n} ${shortFailureWindow.eventUnitNorm} failed`,
                `in the last ${shortFailureWindow.humanTime}`,
            ]
        },
    },
    methods: {
        toggle() {
            this.visible = !this.visible
        },
    },
}
