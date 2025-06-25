export default {
    props: {
        type: {
            type: String,
            required: true,
        },
        cx: {
            type: Number,
            required: true,
        },
        cy: {
            type: Number,
            required: true,
        },
        tooltip: {
            type: String,
            required: false,
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
        hasNotification: {
            type: Number,
            default: 0,
        },
    },
    computed: {
        sel() {
            const padding = 5
            return {
                x: this.cx - this.r - padding,
                y: this.cy - this.r - padding,
                width: (this.r + padding) * 2,
                height: (this.r + padding) * 2,
            }
        },
        notif() {
            return {
                cx: this.cx + this.r,
                cy: this.cy - this.r,
                r: 3,
            }
        },
        r() {
            return this.isSelected ? 13 : 12
        },
        outerR() {
            return this.r + 4
        },
        classes() {
            const ret = [
                'assessment-graph-component-entity',
                `assessment-graph-component-entity--${this.type}`,
            ]
            if (this.isSelected) {
                ret.push('assessment-graph-component-entity--selected')
            }

            return ret.join(' ')
        },
    },
    emits: ['status'],
}
