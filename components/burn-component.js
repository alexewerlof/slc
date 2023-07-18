const template = await (await fetch('components/burn-component.html')).text()

export default {
    template,
    data() {
        return {
            width: 500,
            height: 500,
            margin: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 250,
            }
        }
    },
    props: {
        burnRate: Number,
        longAlertPerc: Number,
        shortAlertDivider: Number,
        showShortAlert: Boolean,
    },
    computed: {
        viewBox() {
            return `0 0 ${this.width} ${this.height}`
        },
        horizontalAxis() {
            return {
                x1: this.margin.left,
                x2: this.width - this.margin.right,
                y1: this.height - this.margin.bottom,
                y2: this.height - this.margin.bottom,
            }
        },
        verticalAxis() {
            return {
                x1: this.margin.left,
                x2: this.margin.left,
                y1: this.margin.top,
                y2: this.height - this.margin.bottom,
            }
        },
        sloWindowEnd() {
            return {
                x1: this.width - this.margin.right,
                x2: this.width - this.margin.right,
                y1: this.margin.top,
                y2: this.height - this.margin.bottom,
            }
        },
        d() {
            // the ratio of the error budget from the total SLO window
            const errorBudgetRatio = 1 / this.burnRate
            const longAlertRatio = errorBudgetRatio * this.longAlertPerc / 100
            const shortAlertRatio = longAlertRatio / this.shortAlertDivider

            const W = this.width - this.margin.left - this.margin.right
            const x1 = this.margin.left
            const ebBurnedX = W * errorBudgetRatio + this.margin.left
            const y1 = this.margin.top
            const y2 = this.height - this.margin.bottom

            const burnLine = {
                x1,
                y1,
                x2: ebBurnedX,
                y2,
            }

            const ebBurned = {
                x1: ebBurnedX,
                x2: ebBurnedX,
                y1,
                y2,
            }

            const longAlertX = W * longAlertRatio + this.margin.left

            const longAlert = {
                x1: longAlertX,
                x2: longAlertX,
                y1,
                y2,
            }

            const shortAlertX = W * shortAlertRatio + this.margin.left

            const shortAlert = {
                x1: shortAlertX,
                x2: shortAlertX,
                y1,
                y2,
            }

            return { burnLine, ebBurned, longAlert, shortAlert }
        },
    },
    methods: {
        toggle() {
            this.visible = !this.visible
        },
    }
}